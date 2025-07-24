import { Issuer } from 'openid-client';
import session from 'express-session';
import type { Express, RequestHandler, Router } from 'express';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';

// Check for required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Google OIDC environment variables not provided - authentication will be disabled');
}

// Define proper interfaces
interface AuthClaims {
  sub?: string;
  id?: string;
  email?: string;
  emails?: Array<{ value: string }>;
  given_name?: string;
  first_name?: string;
  family_name?: string;
  last_name?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  picture?: string;
  profile_image_url?: string;
  [key: string]: any;
}

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

// Extend session type
declare module 'express-session' {
  interface SessionData {
    user?: AuthUser;
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  
  if (!process.env.DATABASE_URL) {
    // Fallback to memory store for development
    return session({
      secret: process.env.SESSION_SECRET || 'dev-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: sessionTtl,
      },
    });
  }

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

function updateUserSession(user: AuthUser, tokens: any) {
  console.log('[updateUserSession] user.id:', user.id);
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = tokens.expires_at || (tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : undefined);
}

async function upsertUser(claims: AuthClaims) {
  try {
    console.log('[upsertUser] claims:', claims);
    
    let id = claims.sub || claims.id;
    if (!id) {
      id = `gen_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    }
    
    const email = claims.email || (claims.emails?.[0]?.value);
    const firstName = claims.given_name || claims.first_name || claims.name?.givenName;
    const lastName = claims.family_name || claims.last_name || claims.name?.familyName;
    const profileImageUrl = claims.picture || claims.profile_image_url;
    
    await storage.upsertUser({
      id,
      email: email || null,
      firstName: firstName || null,
      lastName: lastName || null,
      profileImageUrl: profileImageUrl || null,
    });
    
    console.log('[upsertUser] User upserted successfully:', id);
  } catch (error) {
    console.error('[upsertUser] Error upserting user:', error);
    throw error;
  }
}

export async function setupAuth(app: Express) {
  console.log('[setupAuth] Initializing authentication routes');
  
  // Set up session middleware
  app.set('trust proxy', 1);
  app.use(getSession());

  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('[setupAuth] Google OAuth not configured - setting up mock routes');
    setupMockAuth(app);
    return;
  }

  try {
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
      console.log('[setupAuth] Login route accessed - redirecting to Google');
      const url = client.authorizationUrl({
        scope: 'openid email profile',
        prompt: 'login consent',
      });
      res.redirect(url);
    });

    // Callback: handle Google response, get tokens, store in session
    app.get('/api/callback', async (req, res) => {
      try {
        console.log('[setupAuth] Callback route accessed');
        const params = client.callbackParams(req);
        const tokenSet = await client.callback('http://localhost:5000/api/callback', params, { state: undefined });
        
        let userInfo: any = {};
        if (tokenSet.access_token) {
          userInfo = await client.userinfo(tokenSet.access_token);
        }

        // Save user and tokens in session
        req.session.user = {
          id: userInfo.sub,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          profileImageUrl: userInfo.picture,
          access_token: tokenSet.access_token,
          refresh_token: tokenSet.refresh_token,
          expires_at: tokenSet.expires_at || (tokenSet.expires_in ? Math.floor(Date.now() / 1000) + tokenSet.expires_in : undefined),
        };

        await upsertUser(userInfo);
        
        // Redirect to frontend home page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/home`);
      } catch (err) {
        console.error('[OIDC callback error]', err);
        res.redirect('/api/login');
      }
    });

    // Auth user endpoint
    app.get('/api/auth/user', (req, res) => {
      if (req.session.user) {
        res.json({ user: req.session.user });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    });

    // User info route (alias for compatibility)
    app.get('/api/user', (req, res) => {
      if (req.session.user) {
        res.json(req.session.user);
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    });

    // Logout
    app.get('/api/logout', (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('[setupAuth] Logout error:', err);
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(frontendUrl);
      });
    });

    console.log('[setupAuth] Google OAuth authentication setup complete');
  } catch (error) {
    console.error('[setupAuth] Error setting up Google OAuth:', error);
    setupMockAuth(app);
  }
}

// Fallback mock authentication for development
function setupMockAuth(app: Express) {
  console.log('[setupMockAuth] Setting up mock authentication routes');

  app.get('/api/login', (req, res) => {
    console.log('[setupMockAuth] Mock login route accessed');
    
    // Create a mock user session
    req.session.user = {
      id: 'mock_user_123',
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
      profileImageUrl: 'https://via.placeholder.com/150',
    };

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/home`);
  });

  app.get('/api/auth/user', (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

  app.get('/api/user', (req, res) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

  app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('[setupMockAuth] Logout error:', err);
      }
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(frontendUrl);
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.session.user;
  console.log('[isAuthenticated] session.user:', user ? 'exists' : 'not found');
  
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // If no expiration or Google OAuth not configured, just proceed
  if (!user.expires_at || !process.env.GOOGLE_CLIENT_ID) {
    return next();
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  // Token expired, try to refresh
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
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
    req.session.user = user;
    
    return next();
  } catch (error: any) {
    console.error('[OIDC Refresh Error]', error);
    return res.status(401).json({ 
      message: 'Unauthorized', 
      error: error?.message 
    });
  }
};

// Legacy exports for compatibility
export async function handleAuthCallback(req: any, res: any): Promise<void> {
  // This is handled by the /api/callback route above
  res.json({ message: 'Use /api/callback instead' });
}