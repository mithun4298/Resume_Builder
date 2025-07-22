import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertResumeSchema, resumeSchema } from "@shared/schema";
import { z } from "zod";
import { aiService } from "./services/aiService";
import { generateGeminiContent } from "./services/geminiService";
import { pdfService } from "./services/pdfService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
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
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
      const resumes = await storage.getUserResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
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
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
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
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
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
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
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

  // Gemini resume suggestion endpoint
  // Helper to trim summary to max words
  function trimToMaxWords(text: string, maxWords = 100): { trimmed: boolean; summary: string } {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
      return { trimmed: true, summary: words.slice(0, maxWords).join(' ') + '...' };
    }
    return { trimmed: false, summary: text };
  }
  app.post('/api/ai/gemini/suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const { profile, resumeDraft, length = 'medium', tone = 'formal' } = req.body;
      console.log('[Gemini Debug] Data from frontend:', { profile, resumeDraft, length, tone });
      if (!profile || !resumeDraft) {
        return res.status(400).json({ error: "Missing profile or resume draft." });
      }
      // Map length to word limits and prompt text
      const lengthOptions: Record<string, { prompt: string; maxWords: number }> = {
        short: { prompt: 'Limit summary to 1-2 sentences or 50 words maximum.', maxWords: 50 },
        medium: { prompt: 'Limit summary to 3 sentences or 100 words maximum.', maxWords: 100 },
        long: { prompt: 'Limit summary to 5 sentences or 200 words maximum.', maxWords: 200 }
      };
      const lengthSetting = lengthOptions[length] || lengthOptions['medium'];
      // Tone prompt
      const tonePrompt = `Write in a ${tone} tone.`;
      // Strip HTML tags from resumeDraft
      const plainSummary = resumeDraft.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      // Build prompt (exclude explicit user details)
      const prompt = `You are a professional resume writer. Given only the following summary draft, rewrite it to be concise, impactful, and suitable for a resume. ${lengthSetting.prompt} ${tonePrompt} If the draft is minimal, expand and improve it as much as possible based on typical resume standards. Only return the improved summary text, no extra advice or formatting.\n\nSummary: ${plainSummary}`;
      console.log('[Gemini Debug] FINAL PROMPT:', prompt);
      const geminiResponse = await generateGeminiContent(prompt);      
      
      // Extract only the summary text from Gemini response
      let summary = '';
      if (geminiResponse && geminiResponse.candidates && geminiResponse.candidates[0]?.content?.parts[0]?.text) {
        summary = geminiResponse.candidates[0].content.parts[0].text.trim();
      } else {
        summary = JSON.stringify(geminiResponse);
      }
      // Trim summary to max words
      const { trimmed, summary: trimmedSummary } = trimToMaxWords(summary, lengthSetting.maxWords);
      res.json({ summary: trimmedSummary, trimmed });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Gemini API error" });
    }
  });
  // Gemini skills suggestion endpoint
  app.post('/api/ai/gemini/suggest-skills', isAuthenticated, async (req: any, res) => {
    try {
      const { jobTitle, experience } = req.body;
      console.log('[Gemini Debug] Data from frontend (skills):', { jobTitle, experience });
      if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
        return res.status(400).json({ error: "Valid job title is required for skill suggestions" });
      }
      // Build Gemini prompt
      const prompt = `Suggest relevant technical and soft skills for a ${jobTitle} position. ${experience ? `Based on this experience: ${JSON.stringify(experience)}` : ""} Provide 8-10 technical skills and 5-6 soft skills that are most relevant and in-demand. Respond with a JSON object with \"technical\" and \"soft\" arrays.`;
      console.log('[Gemini Debug] FINAL PROMPT (skills):', prompt);
      const geminiResponse = await generateGeminiContent(prompt);
      let geminiText = '';
      if (geminiResponse && geminiResponse.candidates && geminiResponse.candidates[0]?.content?.parts[0]?.text) {
        geminiText = geminiResponse.candidates[0].content.parts[0].text;
      }
      console.log('[Gemini Debug] Gemini response (skills):', geminiResponse);
      console.log('[Gemini Debug] Gemini response text (skills):', geminiText);
      let skills = { technical: [], soft: [] };
      try {
        if (geminiResponse && geminiResponse.candidates && geminiResponse.candidates[0]?.content?.parts[0]?.text) {
          skills = JSON.parse(geminiResponse.candidates[0].content.parts[0].text);
        }
      } catch (e) {
        skills = { technical: [], soft: [] };
      }
      res.json({ skills });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Gemini skills suggestion error" });
    }
  });

  // Gemini experience bullet points endpoint
  app.post('/api/ai/gemini/generate-bullet-points', isAuthenticated, async (req: any, res) => {
      console.log('[Gemini Debug] Data from frontend (experience):', { jobTitle, company, responsibilities });
      console.log('[Gemini Debug] FINAL PROMPT (experience):', prompt);
    try {
      const { jobTitle, company, responsibilities } = req.body;
      console.log('[Gemini Debug] Data from frontend (experience):', { jobTitle, company, responsibilities });
      if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
        return res.status(400).json({ error: "Valid job title is required for bullet point generation" });
      }
      if (!company || typeof company !== 'string' || company.trim().length === 0) {
        return res.status(400).json({ error: "Valid company name is required for bullet point generation" });
      }
      // Build Gemini prompt
      const prompt = `Generate 3-4 professional bullet points for a ${jobTitle} position at ${company}. ${responsibilities ? `Current responsibilities: ${responsibilities}` : ""} Each bullet point should: - Start with an action verb - Include quantifiable achievements where possible - Be ATS-friendly - Be specific to the role Respond with a JSON object with a \"bulletPoints\" array of strings.`;
      console.log('[Gemini Debug] FINAL PROMPT (experience):', prompt);
      const geminiResponse = await generateGeminiContent(prompt);
      let bulletPoints: string[] = [];
      try {
        if (geminiResponse && geminiResponse.candidates && geminiResponse.candidates[0]?.content?.parts[0]?.text) {
          const result = JSON.parse(geminiResponse.candidates[0].content.parts[0].text);
          bulletPoints = result.bulletPoints || [];
        }
      } catch (e) {
        bulletPoints = [];
      }
      res.json({ bulletPoints });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Gemini bullet point generation error" });
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
      console.log("Received request to suggest skills:", req.body);
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
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user in session' });
      }
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
