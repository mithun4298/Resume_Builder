// TypeScript type augmentation for Express to support Passport.js properties
import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
      [key: string]: any;
    }
    interface Request {
      user?: User;
      session?: any;
      isAuthenticated(): boolean;
      login(user: any, done: (err: any) => void): void;
      logout(done: (err?: any) => void): void;
    }
  }
}
