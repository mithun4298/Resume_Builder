import { Router } from 'express';
import { isAuthenticated } from './replitAuth';

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
      callback: '/api/callback',
      user: '/api/user',
      'auth-user': '/api/auth/user',
      logout: '/api/logout'
    },
    documentation: 'https://github.com/your-repo/resume-builder',
  });
});

// Resume routes
router.get('/resumes', isAuthenticated, async (req, res) => {
  try {
    console.log('[ROUTES] GET /resumes - User:', req.session?.user?.id);
    // TODO: Implement actual resume fetching from database
    // For now, return mock data
    res.json([
      {
        id: '1',
        title: 'Software Engineer Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateId: 'modern',
        downloadCount: 5
      },
      {
        id: '2', 
        title: 'Frontend Developer Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateId: 'elegant',
        downloadCount: 3
      }
    ]);
  } catch (error) {
    console.error('[ROUTES] Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

router.post('/resumes', isAuthenticated, async (req, res) => {
  try {
    console.log('[ROUTES] POST /resumes - User:', req.session?.user?.id);
    console.log('[ROUTES] POST /resumes - Body:', req.body);
    
    const { title, data, templateId } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // TODO: Implement actual resume creation in database
    // For now, return mock response
    const newResume = {
      id: Date.now().toString(),
      title,
      data: data || {},
      templateId: templateId || 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: req.session?.user?.id,
      downloadCount: 0
    };

    console.log('[ROUTES] Created resume:', newResume.id);
    res.status(201).json(newResume);
  } catch (error) {
    console.error('[ROUTES] Error creating resume:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

router.get('/resumes/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[ROUTES] GET /resumes/:id - ID:', id, 'User:', req.session?.user?.id);
    
    // TODO: Implement actual resume fetching from database
    // For now, return mock data
    const resume = {
      id,
      title: 'Sample Resume',
      data: {
        personalInfo: {
          firstName: req.session?.user?.firstName || 'John',
          lastName: req.session?.user?.lastName || 'Doe',
          email: req.session?.user?.email || 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY'
        },
        experience: [],
        education: [],
        skills: [],
        certifications: []
      },
      templateId: 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: req.session?.user?.id
    };

    res.json(resume);
  } catch (error) {
    console.error('[ROUTES] Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

router.put('/resumes/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[ROUTES] PUT /resumes/:id - ID:', id, 'User:', req.session?.user?.id);
    
    // TODO: Implement actual resume updating in database
    // For now, return mock response
    const updatedResume = {
      id,
      ...req.body,
      updatedAt: new Date().toISOString(),
      userId: req.session?.user?.id
    };

    res.json(updatedResume);
  } catch (error) {
    console.error('[ROUTES] Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

router.delete('/resumes/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[ROUTES] DELETE /resumes/:id - ID:', id, 'User:', req.session?.user?.id);
    
    // TODO: Implement actual resume deletion from database
    // For now, return success response
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('[ROUTES] Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

router.get('/resumes/:id/download', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[ROUTES] GET /resumes/:id/download - ID:', id);
    
    // TODO: Implement actual PDF generation
    // For now, return a simple response
    res.status(501).json({ error: 'PDF generation not implemented yet' });
  } catch (error) {
    console.error('[ROUTES] Error downloading resume:', error);
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

export default router;