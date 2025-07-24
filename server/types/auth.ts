import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface AuthClaims {
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

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}