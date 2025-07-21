import { Issuer } from 'openid-client';
import passport from 'passport';
import session from 'express-session';
import type { Express, RequestHandler } from 'express';
import memoize from 'memoizee';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';
import OpenIDConnectStrategy from 'passport-openidconnect';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OIDC environment variables not provided');
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: 'sessions',
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // allow local dev
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(user: any, tokens: any) {
  console.log('[updateUserSession] user.id:', user.id, 'tokens:', tokens);
  // Only store necessary token fields to avoid circular references
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = tokens.exp;
}

async function upsertUser(claims: any) {
  console.log('[upsertUser] claims:', claims);
  // Ensure id is always a non-null string
  let id = claims['sub'] || claims['id'];
  if (!id) {
    // Generate a unique string id if missing (timestamp + random)
    id = `gen_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  }
  // Support Google and other providers' field names
  const email = claims['email'] || (claims['emails'] && claims['emails'][0] && claims['emails'][0].value);
  const firstName = claims['given_name'] || claims['first_name'] || (claims['name'] && claims['name'].givenName);
  const lastName = claims['family_name'] || claims['last_name'] || (claims['name'] && claims['name'].familyName);
  const profileImageUrl = claims['picture'] || claims['profile_image_url'];
  await storage.upsertUser({
    id,
    email,
    firstName,
    lastName,
    profileImageUrl,
  });
}

export async function setupAuth(app: Express) {
  console.log('[setupAuth] Initializing authentication routes');
  app.set('trust proxy', 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to memoize/cached user for each request
  app.use((req, res, next) => {
    if (req.user) {
      // User already deserialized for this request
      return next();
    }
    // If not authenticated, just continue
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return next();
    }
    // Defensive: If req.session.passport?.user exists, force deserialization once
    const sessionAny = req.session as any;
    if (sessionAny && sessionAny.passport && sessionAny.passport.user && !req.user) {
      // This triggers passport.deserializeUser only once
      req.login(sessionAny.passport.user, (err: any) => {
        if (err) return next(err);
        next();
      });
    } else {
      next();
    }
  });

  // Discover Google OIDC endpoints and use them in the strategy
  const issuer = await Issuer.discover('https://accounts.google.com');

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: 'https://accounts.google.com',
        authorizationURL: issuer.authorization_endpoint as string,
        tokenURL: issuer.token_endpoint as string,
        userInfoURL: issuer.userinfo_endpoint as string,
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        //callbackURL: 'https://verbose-zebra-ppq547rjgp9c7rwr-5000.app.github.dev/api/callback',
        callbackURL: 'http://localhost:5000/api/callback',
        scope: 'openid email profile',
      },
      async (
        issuer: string,
        profile: any,
        done: (err: any, user?: any) => void
      ) => {
        // The profile object should contain all user info and tokens
        let userProfile: any = profile;
        // Normalize: always set userProfile.id from sub if present
        if (userProfile && userProfile.sub && !userProfile.id) {
          userProfile.id = userProfile.sub;
        }
        console.log('[OpenIDConnectStrategy] profile:', userProfile);
        await upsertUser(userProfile);
        // Attach tokens if present (may need to adjust depending on provider)
        const tokens = {
          access_token: userProfile.access_token,
          refresh_token: userProfile.refresh_token,
          exp: userProfile.exp || undefined,
        };
        updateUserSession(userProfile, tokens);
        done(null, userProfile);
      }
    )
  );

  // Store user id and session tokens in session
  passport.serializeUser((user: any, cb) => {
    console.log('[serializeUser] user:', user);
    cb(null, {
      id: user.id,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      expires_at: user.expires_at,
    });
  });
  // Fetch user from DB by id and restore session tokens
  // In-memory user cache to reduce DB calls (5 min TTL)
  const userCache = new Map();
  passport.deserializeUser(async (sessionObj: any, cb) => {
    const cacheKey = sessionObj.id;
    if (userCache.has(cacheKey)) {
      // Return cached user, no log
      return cb(null, userCache.get(cacheKey));
    }
    // Only log when actually fetching from DB
    console.log('[deserializeUser] DB fetch for user:', sessionObj.id);
    try {
      let user = await storage.getUser(sessionObj.id);
      if (!user) return cb(null, false);
      // Ensure user fields are string | undefined, not null
      user = {
        ...user,
        email: user.email ?? undefined,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        profileImageUrl: user.profileImageUrl ?? undefined,
      };
      // Attach session tokens to user object for middleware
      (user as any).access_token = sessionObj.access_token;
      (user as any).refresh_token = sessionObj.refresh_token;
      (user as any).expires_at = sessionObj.expires_at;
      userCache.set(cacheKey, user);
      setTimeout(() => userCache.delete(cacheKey), 5 * 60 * 1000); // 5 min TTL
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  });

  app.get('/api/auth/user', (req: import('express').Request, res: import('express').Response) => {
    console.log('[GET /api/auth/user] req.user:', req.user);
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

  app.get('/api/login', passport.authenticate('openidconnect', {
    prompt: 'login consent',
    scope: ['openid', 'email', 'profile'],
  }));

  app.get('/api/callback', passport.authenticate('openidconnect', {
    failureRedirect: '/api/login',
    successRedirect: '/',
  }));

  app.get('/api/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  console.log('[isAuthenticated] req.user:', req.user, 'isAuthenticated:', req.isAuthenticated());
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const issuer = await Issuer.discover('https://accounts.google.com');
    const googleClient = new issuer.Client({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uris: ['https://verbose-zebra-ppq547rjgp9c7rwr-5000.app.github.dev/api/callback'],
      response_types: ['code'],
    });
    const tokenResponse = await googleClient.refresh(refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error: any) {
    console.error('[OIDC Refresh Error]', error);
    if (error && typeof error === 'object' && 'response' in error && error.response && 'body' in error.response) {
      console.error('[OIDC Error Response Body]', error.response.body);
    }
    res.status(401).json({ message: 'Unauthorized', error: error && error.message, details: error && error.response && error.response.body });
    return;
  }
};