import { Router } from 'express';

const router = Router();

// Fix: Use underscore prefix for unused parameters
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

router.get('/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Mock resume endpoints
router.get('/resumes', (_req, res) => {
  res.json({ 
    success: true, 
    data: { resumes: [] },
    message: 'Resumes endpoint working'
  });
});

router.post('/resumes', (_req, res) => {
  res.json({ 
    success: true, 
    data: { resume: { id: 1, title: 'New Resume' } },
    message: 'Resume created successfully'
  });
});

export default router;