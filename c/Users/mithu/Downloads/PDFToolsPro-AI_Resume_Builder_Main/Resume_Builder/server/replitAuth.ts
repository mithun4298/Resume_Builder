import { Request, Response, NextFunction, Application, Router } from 'express';
import { storage } from './storage';

// Define proper interfaces
interface AuthClaims {
  sub?: string;
  id?: string;
  email?: string;
  emails?: Array&lt;{ value: string }&gt;;
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
  [key: string]: any; // Allow additional properties
}

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

// Extend Request interface properly
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Alternative: Create a custom interface if global extension doesn't work
interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function setupAuth(router: Router): void {
  console.log('[SETUP_AUTH] Setting up authentication routes...');

  // Debug middleware to log all requests to this router
  router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[AUTH_ROUTER] ${req.method} ${req.originalUrl} - Path: ${req.path}`);
    next();
  });

  // Login route - redirect to Google OAuth
  router.get('/login', (req: Request, res: Response) => {
    try {
      console.log('[LOGIN_ROUTE] Login route accessed successfully!');
      console.log('[LOGIN_ROUTE] Request URL:', req.originalUrl);
      console.log('[LOGIN_ROUTE] Request Path:', req.path);
      
      // For development, let's just redirect to home for now
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      console.log('[LOGIN_ROUTE] Redirecting to:', `${frontendUrl}/home`);
      
      res.redirect(`${frontendUrl}/home`);
    } catch (error) {
      console.error('[LOGIN_ROUTE] Error in login route:', error);
      res.status(500).json({ 
        error: 'Login failed',
        message: 'Unable to initiate authentication'
      });
    }
  });

  // Auth callback route
  router.get('/auth/callback', async (req: Request, res: Response) => {
    try {
      console.log('[AUTH_CALLBACK] Auth callback route accessed');
      const { code, error } = req.query;
      
      if (error) {
        console.error('[AUTH_CALLBACK] OAuth error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/?error=oauth_error`);
      }

      if (!code) {
        console.error('[AUTH_CALLBACK] No authorization code received');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/?error=no_code`);
      }

      console.log('[AUTH_CALLBACK] Auth callback received code:', typeof code === 'string' ? code.substring(0, 10) + '...' : code);
      
      // For development, just redirect to home
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/home`);
    } catch (error) {
      console.error('[AUTH_CALLBACK] Auth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/?error=auth_failed`);
    }
  });

  // Logout route
  router.get('/logout', (req: Request, res: Response) => {
    try {
      console.log('[LOGOUT_ROUTE] Logout route accessed');
      // Clear any session cookies
      res.clearCookie('session');
      res.clearCookie('auth_token');
      
      console.log('[LOGOUT_ROUTE] User logged out');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(frontendUrl);
    } catch (error) {
      console.error('[LOGOUT_ROUTE] Logout error:', error);
      res.status(500).json({ 
        error: 'Logout failed',
        message: 'Unable to complete logout'
      });
    }
  });

  // User info route
  router.get('/user', (req: Request, res: Response) => {
    try {
      console.log('[USER_ROUTE] User info route accessed');
      // For development, return mock user
      const mockUser = {
        id: 'dev_user_123',
        email: 'dev@example.com',
        name: 'Development User',
        firstName: 'Dev',
        lastName: 'User'
      };
      
      res.json(mockUser);
    } catch (error) {
      console.error('[USER_ROUTE] User info error:', error);
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Unable to get user information'
      });
    }
  });

  // Generic auth endpoint
  router.get('/auth', (req: Request, res: Response) => {
    console.log('[AUTH_ROUTE] Generic auth endpoint accessed');
    res.json({ message: 'Auth endpoint' });
  });

  console.log('[SETUP_AUTH] Authentication routes setup complete');
}

// ... rest of your functions remain the same
export async function upsertUser(claims: AuthClaims): Promise&lt;void&gt; {
  try {
    console.log('[upsertUser] claims:', claims);
    
    // Ensure id is always a non-null string
    let id = claims.sub || claims.id;
    if (!id) {
      // Generate a unique string id if missing (timestamp + random)
      id = `gen_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    }
    
    // Support Google and other providers' field names
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

export async function handleAuthCallback(_req: Request, res: Response): Promise&lt;void&gt; {
  try {
    res.json({ 
      message: 'Auth callback handled',
      status: 'success'
    });
  } catch (error) {
    console.error('[handleAuthCallback] Error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error'
    });
  }
}

export function isAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    console.log('[isAuthenticated] Authentication check passed (development mode)');
    
    // Set a mock authenticated user for development
    req.user = {
      id: 'dev_user_123',
      email: 'dev@example.com',
      name: 'Development User',
      firstName: 'Dev',
      lastName: 'User'
    };
    
    next();
  } catch (error) {
    console.error('[isAuthenticated] Authentication error:', error);
    res.status(401).json({ 
      error: 'Authentication required',
      message: 'Invalid or missing authentication token'
    });
  }
}

export function optionalAuth(req: AuthenticatedRequest, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader &amp;&amp; authHeader.startsWith('Bearer ')) {
      req.user = {
        id: 'auth_user_456',
        email: 'user@example.com',
        name: 'Authenticated User',
        firstName: 'Auth',
        lastName: 'User'
      };
    } else {
      req.user = {
        id: 'anonymous',
        email: 'anonymous@example.com',
        name: 'Anonymous User'
      };
    }
    
    next();
  } catch (error) {
    console.error('[optionalAuth] Error:', error);
    req.user = {
      id: 'anonymous',
      email: 'anonymous@example.com',
      name: 'Anonymous User'
    };
    next();
  }
}

export function extractUserFromToken(token: string): AuthUser | null {
  try {
    console.log('[extractUserFromToken] Token extraction not implemented:', token.substring(0, 20) + '...');
    return null;
  } catch (error) {
    console.error('[extractUserFromToken] Error extracting user from token:', error);
    return null;
  }
}

export function generateAuthToken(user: AuthUser): string {
  try {
    console.log('[generateAuthToken] Token generation not implemented for user:', user.id);
    return 'mock_jwt_token_' + user.id;
  } catch (error) {
    console.error('[generateAuthToken] Error generating token:', error);
    throw error;
  }
}