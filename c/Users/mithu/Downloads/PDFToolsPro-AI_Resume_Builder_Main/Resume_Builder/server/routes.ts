import { Router } from 'express';
import { setupAuth } from './auth';

const router = Router();

// Add debug middleware to log all API requests
router.use((req, res, next) => {
  console.log(`[ROUTES DEBUG] ${req.method} ${req.originalUrl} - ${req.path}`);
  next();
});

router.get('/', (_req, res) => {
  res.json({
    message: 'Resume Builder API',
    version: '1.0.0',
    endpoints: {
      resumes: '/api/resumes',
      health: '/health',
      login: '/api/login',
      auth: '/api/auth',
      user: '/api/user',
    },
    documentation: 'https://github.com/your-repo/resume-builder',
  });
});

// Setup authentication routes
console.log('[ROUTES] Setting up auth routes...');
setupAuth(router);

export default router;