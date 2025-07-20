import { Issuer } from 'openid-client'; // Issuer used for discovery, still valid
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

  // Discover Google OIDC endpoints and use them in the strategy
  const issuer = await Issuer.discover('https://accounts.google.com');

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: 'https://accounts.google.com',
        authorizationURL: issuer.authorization_endpoint,
        tokenURL: issuer.token_endpoint,
        userInfoURL: issuer.userinfo_endpoint,
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: 'https://verbose-zebra-ppq547rjgp9c7rwr-5000.app.github.dev/api/callback',
        scope: 'openid email profile',
        profile: true, // ensure profile is fetched
      },
      async (
        issuer: any,
        sub: string,
        profile: any,
        jwtClaims: any,
        accessToken: string,
        refreshToken: string,
        params: any,
        done: (err: any, user?: any) => void
      ) => {
        // Fallback to jwtClaims if profile is empty, and decode if it's a string
        let userProfile: any = profile && Object.keys(profile).length > 0 ? profile : jwtClaims;
        if (typeof userProfile === 'string') {
          // JWT: header.payload.signature
          try {
            const payload = userProfile.split('.')[1];
            userProfile = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
          } catch (e) {
            console.error('[OpenIDConnectStrategy] Failed to decode JWT claims:', e);
            userProfile = {};
          }
        }
        // Normalize: always set userProfile.id from sub if present
        if (userProfile && userProfile.sub && !userProfile.id) {
          userProfile.id = userProfile.sub;
        }
        console.log('[OpenIDConnectStrategy] profile:', userProfile);
        await upsertUser(userProfile);
        const tokens = {
          access_token: accessToken,
          refresh_token: refreshToken,
          exp: params && params.expires_in ? Math.floor(Date.now() / 1000) + params.expires_in : undefined,
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
  passport.deserializeUser(async (sessionObj: any, cb) => {
    console.log('[deserializeUser] sessionObj:', sessionObj);
    try {
      const user = await storage.getUser(sessionObj.id);
      if (!user) return cb(null, false);
      // Attach session tokens to user object for middleware
      (user as any).access_token = sessionObj.access_token;
      (user as any).refresh_token = sessionObj.refresh_token;
      (user as any).expires_at = sessionObj.expires_at;
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
