import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertResumeSchema, resumeSchema } from "@shared/schema";
import { z } from "zod";
import { aiService } from "./services/aiService";
import { pdfService } from "./services/pdfService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Resume routes
  app.get('/api/resumes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resumes = await storage.getUserResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resumeId = parseInt(req.params.id);
      const resume = await storage.getResume(resumeId, userId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.post('/api/resumes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resumeData = insertResumeSchema.parse(req.body);
      
      const resume = await storage.createResume(userId, resumeData);
      res.json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  app.put('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resumeId = parseInt(req.params.id);
      const resumeData = insertResumeSchema.partial().parse(req.body);
      
      const resume = await storage.updateResume(resumeId, userId, resumeData);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error updating resume:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resumeId = parseInt(req.params.id);
      
      const deleted = await storage.deleteResume(resumeId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // AI generation routes
  app.post('/api/ai/generate-summary', isAuthenticated, async (req: any, res) => {
    try {
      const { experience, skills, title } = req.body;
      
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: "Valid job title is required for summary generation" });
      }
      
      const summary = await aiService.generateSummary(experience || [], skills || [], title.trim());
      res.json({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ 
        message: (error instanceof Error ? error.message : "Failed to generate summary"),
        details: (error instanceof Error && error.message.includes("API key")) ? "Please check OpenAI API configuration" : undefined
      });
    }
  });

  app.post('/api/ai/generate-bullet-points', isAuthenticated, async (req: any, res) => {
    try {
      const { jobTitle, company, responsibilities } = req.body;
      
      if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
        return res.status(400).json({ message: "Valid job title is required for bullet point generation" });
      }
      
      if (!company || typeof company !== 'string' || company.trim().length === 0) {
        return res.status(400).json({ message: "Valid company name is required for bullet point generation" });
      }
      
      const bulletPoints = await aiService.generateBulletPoints(jobTitle.trim(), company.trim(), responsibilities);
      res.json({ bulletPoints });
    } catch (error) {
      console.error("Error generating bullet points:", error);
      res.status(500).json({ 
        message: (error instanceof Error ? error.message : "Failed to generate bullet points"),
        details: (error instanceof Error && error.message.includes("API key")) ? "Please check OpenAI API configuration" : undefined
      });
    }
  });

  app.post('/api/ai/suggest-skills', isAuthenticated, async (req: any, res) => {
    try {
      const { jobTitle, experience } = req.body;
      
      if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
        return res.status(400).json({ message: "Valid job title is required for skill suggestions" });
      }
      
      const skills = await aiService.suggestSkills(jobTitle.trim(), experience);
      res.json({ skills });
    } catch (error) {
      console.error("Error suggesting skills:", error);
      res.status(500).json({ 
        message: (error instanceof Error ? error.message : "Failed to suggest skills"),
        details: (error instanceof Error && error.message.includes("API key")) ? "Please check OpenAI API configuration" : undefined
      });
    }
  });

  app.post('/api/ai/calculate-ats-score', isAuthenticated, async (req: any, res) => {
    try {
      const { resumeData, jobDescription } = req.body;
      
      if (!resumeData) {
        return res.status(400).json({ message: "Resume data is required for ATS score calculation" });
      }
      
      const atsScore = await aiService.calculateATSScore(resumeData, jobDescription);
      res.json(atsScore);
    } catch (error) {
      console.error("Error calculating ATS score:", error);
      res.status(500).json({ 
        message: (error instanceof Error ? error.message : "Failed to calculate ATS score"),
        details: (error instanceof Error && error.message.includes("API key")) ? "Please check OpenAI API configuration" : undefined
      });
    }
  });

  // PDF export route
  app.post('/api/resumes/:id/export', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const resumeId = parseInt(req.params.id);
      
      const resume = await storage.getResume(resumeId, userId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const pdfBuffer = await pdfService.generatePDF(resume.data as any, resume.templateId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      res.status(500).json({ message: "Failed to export PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
