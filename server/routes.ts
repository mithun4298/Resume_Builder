import { Router, Application } from 'express';
import { setupAuth } from "./replitAuth";
import resumeRoutes from './routes/resumeRoutes';

const router = Router();

// Setup auth routes
setupAuth(router as Application);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume routes
router.use('/resumes', resumeRoutes);

// Root endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'Resume Builder API',
    version: '1.0.0',
    endpoints: {
      resumes: '/api/resumes',
      health: '/health',
    },
    documentation: 'https://github.com/your-repo/resume-builder',
  });
});

export default router;