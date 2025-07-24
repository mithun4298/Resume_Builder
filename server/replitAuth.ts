import { Request, Response, NextFunction, Application } from 'express';
import { storage } from './storage';

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

export function setupAuth(app: Application): void {
  app.use('/auth', (_req: Request, res: Response) => {
    res.json({ message: 'Auth endpoint' });
  });
}

export async function upsertUser(claims: AuthClaims): Promise<void> {
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

export async function handleAuthCallback(_req: Request, res: Response): Promise<void> {
  try {
    // TODO: Implement actual auth callback logic
    // This would typically:
    // 1. Extract auth code from request
    // 2. Exchange code for tokens
    // 3. Get user info from provider
    // 4. Call upsertUser with user claims
    // 5. Generate JWT token
    // 6. Redirect or return token
    
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
    // TODO: Implement actual authentication logic
    // This would typically:
    // 1. Extract JWT token from Authorization header
    // 2. Verify token signature and expiration
    // 3. Extract user info from token
    // 4. Attach user to request object
    // 5. Call next() if valid, or return 401 if invalid
    
    // For now, just pass through (development mode)
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

// Optional: Export a middleware that adds user context to requests
export function optionalAuth(req: AuthenticatedRequest, next: NextFunction): void {
  try {
    // TODO: Implement optional authentication
    // This would extract user info if token is present, but not require it
    
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // TODO: Verify JWT token here
      // For now, set a mock authenticated user
      req.user = {
        id: 'auth_user_456',
        email: 'user@example.com',
        name: 'Authenticated User',
        firstName: 'Auth',
        lastName: 'User'
      };
    } else {
      // Set anonymous user for unauthenticated requests
      req.user = {
        id: 'anonymous',
        email: 'anonymous@example.com',
        name: 'Anonymous User'
      };
    }
    
    next();
  } catch (error) {
    console.error('[optionalAuth] Error:', error);
    // Even if auth fails, continue with anonymous user
    req.user = {
      id: 'anonymous',
      email: 'anonymous@example.com',
      name: 'Anonymous User'
    };
    next();
  }
}

// Helper function to extract user from JWT token (for future implementation)
export function extractUserFromToken(token: string): AuthUser | null {
  try {
    // TODO: Implement JWT token verification and user extraction
    // This would typically:
    // 1. Verify token signature
    // 2. Check expiration
    // 3. Extract payload
    // 4. Return user object
    
    console.log('[extractUserFromToken] Token extraction not implemented:', token.substring(0, 20) + '...');
    return null;
  } catch (error) {
    console.error('[extractUserFromToken] Error extracting user from token:', error);
    return null;
  }
}

// Helper function to generate JWT token (for future implementation)
export function generateAuthToken(user: AuthUser): string {
  try {
    // TODO: Implement JWT token generation
    // This would typically:
    // 1. Create payload with user info
    // 2. Sign with secret key
    // 3. Set expiration
    // 4. Return signed token
    
    console.log('[generateAuthToken] Token generation not implemented for user:', user.id);
    return 'mock_jwt_token_' + user.id;
  } catch (error) {
    console.error('[generateAuthToken] Error generating token:', error);
    throw error;
  }
}