import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // For development, allow anonymous access
    if (process.env.NODE_ENV === 'development') {
      req.user = {
        id: 'anonymous',
        email: 'anonymous@example.com',
        name: 'Anonymous User'
      };
      return next();
    }
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    req.user = user;
    next();
  });
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = {
      id: 'anonymous',
      email: 'anonymous@example.com',
      name: 'Anonymous User'
    };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
    if (err) {
      req.user = {
        id: 'anonymous',
        email: 'anonymous@example.com',
        name: 'Anonymous User'
      };
    } else {
      req.user = user;
    }
    next();
  });
};