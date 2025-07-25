import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

const router = Router();

console.log('[API DEBUG] resumeRoutes.ts loaded');

// Define the AuthenticatedRequest interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Validation schemas
const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  title: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

const ExperienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
});

const EducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
});

const SkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).default('Intermediate'),
  category: z.string().optional(),
});

const SkillsSchema = z.object({
  technical: z.array(z.string()).default([]),
  soft: z.array(z.string()).default([]),
  skills: z.array(SkillSchema).optional(),
});

const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  technologies: z.array(z.string()).default([]),
  url: z.string().url('Invalid project URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const CertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  url: z.string().url('Invalid certification URL').optional().or(z.literal('')),
});

const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().default(''),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: SkillsSchema.default({ technical: [], soft: [] }),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  sectionOrder: z.array(z.enum([
    "personal",
    "summary", 
    "experience",
    "skills",
    "education",
    "projects",
    "certifications"
  ])).optional(),
});

const SaveResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  data: ResumeDataSchema,
  templateId: z.string().default("modern"),
  isPublic: z.boolean().default(false),
});

// Response interfaces
interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
}

interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
}

// Optional auth middleware
const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    req.user = {
      id: 'anonymous',
      email: 'anonymous@example.com',
      name: 'Anonymous User'
    };
  }
  next();
};

// Helper functions
const sendError = (res: Response, status: number, error: string, details?: any): void => {
  const response: ErrorResponse = {
    success: false,
    error,
    ...(details && { details })
  };
  res.status(status).json(response);
};

const sendSuccess = <T>(res: Response, data?: T, message?: string, status: number = 200): void => {
  const response: SuccessResponse<T> = {
    success: true,
    ...(data && { data }),
    ...(message && { message })
  };
  res.status(status).json(response);
};

// Helper function to safely parse ID parameter
const parseIdParam = (idParam: string | undefined): number | null => {
  if (!idParam) return null;
  const id = parseInt(idParam, 10);
  return isNaN(id) ? null : id;
};

// Apply optional auth to all routes
router.use(optionalAuth);

// SPECIFIC ROUTES FIRST (before parameterized routes)

// GET /api/resumes/user/all - Get all user resumes
router.get('/user/all', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log('[API DEBUG] /user/all route handler entered');
  try {
    const userId = req.user?.id || 'anonymous';
    console.log('[API DEBUG] /api/resumes/user/all userId:', userId);
    const resumes = await storage.getUserResumes(userId);
    console.log('[API DEBUG] /api/resumes/user/all resumes:', JSON.stringify(resumes, null, 2));
    sendSuccess(res, { resumes });
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    sendError(res, 500, 'Failed to fetch resumes');
  }
});

// GET /api/resumes/templates - Get available resume templates
router.get('/templates', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design',
        preview: '/templates/modern-preview.png',
        category: 'professional'
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional and timeless layout',
        preview: '/templates/classic-preview.png',
        category: 'traditional'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Bold and artistic design',
        preview: '/templates/creative-preview.png',
        category: 'creative'
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant',
        preview: '/templates/minimal-preview.png',
        category: 'minimal'
      }
    ];
    
    sendSuccess(res, { templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    sendError(res, 500, 'Failed to fetch templates');
  }
});

// GET /api/resumes/stats - Get user resume statistics
router.get('/stats', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // const userId = req.user?.id || 'anonymous';

    const mockStats = {
      totalResumes: 5,
      completedResumes: 3,
      draftResumes: 2,
      totalViews: 127,
      totalDownloads: 23,
      lastActivity: new Date().toISOString(),
      popularTemplate: 'modern',
      averageCompletionRate: 85
    };
    
    sendSuccess(res, { stats: mockStats });
  } catch (error) {
    console.error('Error fetching resume statistics:', error);
    sendError(res, 500, 'Failed to fetch statistics');
  }
});

// GET /api/resumes/shared/:token - Get resume by share token
router.get('/shared/:token', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    
    if (!token || !token.startsWith('share_')) {
      sendError(res, 400, 'Invalid share token');
      return;
    }
    
    // TODO: Implement actual token validation and resume retrieval
    sendError(res, 501, 'Shared resume feature not implemented yet');
  } catch (error) {
    console.error('Error fetching shared resume:', error);
    sendError(res, 500, 'Failed to fetch shared resume');
  }
});

// POST /api/resumes/generate-pdf - Generate PDF from resume data
router.post('/generate-pdf', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = ResumeDataSchema.parse(req.body);
    
    const mockPdfData = {
      url: '/api/resumes/pdf/mock-resume.pdf',
      filename: 'resume.pdf',
      size: '245KB'
    };
    
    sendSuccess(res, { 
      pdf: mockPdfData,
      resumeData: validatedData 
    }, 'PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (error instanceof z.ZodError) {
      sendError(res, 400, 'Invalid resume data', error.errors);
      return;
    }
    sendError(res, 500, 'Failed to generate PDF');
  }
});

// PARAMETERIZED ROUTES (after specific routes)

// POST /api/resumes - Save new resume
router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = SaveResumeSchema.parse(req.body);
    const userId = req.user?.id || 'anonymous';
    
    // Add userId to the resume data
    const resumeData = {
      ...validatedData,
      userId,
    };
    
    const resume = await storage.createResume(userId, resumeData);
    sendSuccess(res, { resume }, 'Resume created successfully', 201);
  } catch (error) {
    console.error('Error creating resume:', error);
    if (error instanceof z.ZodError) {
      sendError(res, 400, 'Invalid data', error.errors);
      return;
    }
    sendError(res, 500, 'Failed to create resume');
  }
});

// GET /api/resumes/:id - Get specific resume
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (id === null) {
      sendError(res, 400, 'Invalid resume ID');
      return;
    }
    
    const userId = req.user?.id || 'anonymous';
    const resume = await storage.getResume(id, userId);
    
    if (!resume) {
      sendError(res, 404, 'Resume not found');
      return;
    }
    
    sendSuccess(res, { resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    sendError(res, 500, 'Failed to fetch resume');
  }
});

// PUT /api/resumes/:id - Update resume
router.put('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (id === null) {
      sendError(res, 400, 'Invalid resume ID');
      return;
    }
    
    const userId = req.user?.id || 'anonymous';
    const validatedDataPartial = SaveResumeSchema.partial().parse(req.body);
    
    // Add userId to the update data
    const updateDataWithUserId = {
      ...validatedDataPartial,
      userId,
      data: validatedDataPartial.data as any // Type assertion to fix Json type issue
    };
    
    const updatedResume = await storage.updateResume(id, userId, updateDataWithUserId);
    
    if (!updatedResume) {
      sendError(res, 404, 'Resume not found');
      return;
    }
    
    sendSuccess(res, { resume: updatedResume }, 'Resume updated successfully');
  } catch (error) {
    console.error('Error updating resume:', error);
    if (error instanceof z.ZodError) {
      sendError(res, 400, 'Invalid data', error.errors);
      return;
    }
    sendError(res, 500, 'Failed to update resume');
  }
}); 

// DELETE /api/resumes/:id - Delete resume
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (id === null) {
      sendError(res, 400, 'Invalid resume ID');
      return;
    }
    
    const userId = req.user?.id || 'anonymous';
    const deleted = await storage.deleteResume(id, userId);
    
    if (!deleted) {
      sendError(res, 404, 'Resume not found');
      return;
    }
    
    sendSuccess(res, {}, 'Resume deleted successfully');
  } catch (error) {
    console.error('Error deleting resume:', error);
    sendError(res, 500, 'Failed to delete resume');
  }
});

// POST /api/resumes/:id/duplicate - Duplicate a resume
router.post('/:id/duplicate', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseIdParam(req.params.id);
    if (id === null) {
      sendError(res, 400, 'Invalid resume ID');
      return;
    }
    
    const userId = req.user?.id || 'anonymous';
    const originalResume = await storage.getResume(id, userId);
    
    if (!originalResume) {
      sendError(res, 404, 'Resume not found');
      return;
    }
    
    const duplicateData = {
      title: `${originalResume.title} (Copy)`,
      data: originalResume.data,
      templateId: originalResume.templateId || 'modern',
      isPublic: false,
      userId, // Add userId to the data
    };
    
    const duplicatedResume = await storage.createResume(userId, duplicateData);
    sendSuccess(res, { resume: duplicatedResume }, 'Resume duplicated successfully', 201);
  } catch (error) {
    console.error('Error duplicating resume:', error);
    sendError(res, 500, 'Failed to duplicate resume');
  }
});

// Error handling middleware for this router
router.use((error: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Resume routes error:', error);
  
  if (error instanceof z.ZodError) {
    sendError(res, 400, 'Validation error', error.errors);
    return;
  }
  
  if (error.name === 'ValidationError') {
    sendError(res, 400, 'Invalid data', error.message);
    return;
  }
  
  if (error.name === 'UnauthorizedError') {
    sendError(res, 401, 'Unauthorized access');
    return;
  }
  
  sendError(res, 500, 'Internal server error');
});

export default router;