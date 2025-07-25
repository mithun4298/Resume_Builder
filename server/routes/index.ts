
import { Router } from 'express';
import resumeRoutes from './resumeRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/resumes', resumeRoutes);

// Mount auth routes (for health, future extension)
router.use('/auth', authRoutes);

// Optionally, keep the API root and test endpoints
router.get('/', (_req, res) => {
  res.json({
    message: 'Resume Builder API',
    version: '1.0.0',
    endpoints: {
      resumes: '/api/resumes',
      health: '/health',
      auth: '/api/auth',
    },
    documentation: 'https://github.com/your-repo/resume-builder',
  });
});

router.get('/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default router;