import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Login, callback, user info, and logout endpoints are set up by replitAuth's setupAuth(app)
// This router is for compatibility and future extension if needed

// Optionally, you can add a health check or test endpoint here
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

export default router;
