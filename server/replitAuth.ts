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

  // Discover Google OIDC endpoints
  const issuer = await Issuer.discover('https://accounts.google.com');
  const client = new issuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uris: ['http://localhost:5000/api/callback'],
    response_types: ['code'],
  });

  // Start login: redirect to Google
  app.get('/api/login', (req, res) => {
    const url = client.authorizationUrl({
      scope: 'openid email profile',
      prompt: 'login consent',
    });
    res.redirect(url);
  });

  // Callback: handle Google response, get tokens, store in session
  app.get('/api/callback', async (req, res) => {
    try {
      const params = client.callbackParams(req);
      const tokenSet = await client.callback('http://localhost:5000/api/callback', params, { state: undefined });
      let userInfo = {};
      if (tokenSet.access_token) {
        userInfo = await client.userinfo(tokenSet.access_token);
      }
      // Save user and tokens in session (type assertion for TS)
      (req.session as any).user = {
        id: (userInfo as any).sub,
        email: (userInfo as any).email,
        firstName: (userInfo as any).given_name,
        lastName: (userInfo as any).family_name,
        profileImageUrl: (userInfo as any).picture,
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_at: tokenSet.expires_at || (tokenSet.expires_in ? Math.floor(Date.now() / 1000) + tokenSet.expires_in : undefined),
      };
      await upsertUser((req.session as any).user);
      res.redirect('/');
    } catch (err) {
      console.error('[OIDC callback error]', err);
      res.redirect('/api/login');
    }
  });

  // Auth user endpoint
  app.get('/api/auth/user', (req, res) => {
    if ((req.session as any).user) {
      res.json({ user: (req.session as any).user });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

  // Logout
  app.get('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = (req.session as any).user;
  console.log('[isAuthenticated] session.user:', user);
  if (!user || !user.expires_at) {
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
      redirect_uris: ['http://localhost:5000/api/callback'],
      response_types: ['code'],
    });
    const tokenResponse = await googleClient.refresh(refreshToken);
    updateUserSession(user, tokenResponse);
    // Update session with new tokens
    user.access_token = tokenResponse.access_token;
    user.refresh_token = tokenResponse.refresh_token;
    user.expires_at = tokenResponse.expires_at || (tokenResponse.expires_in ? Math.floor(Date.now() / 1000) + tokenResponse.expires_in : undefined);
    (req.session as any).user = user;
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