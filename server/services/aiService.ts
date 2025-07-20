import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "" 
});

class AIService {
  private validateApiKey(): void {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }
  }

  async generateSummary(experience: any[], skills: string[], title: string): Promise<string> {
    try {
      this.validateApiKey();
      
      if (!title) {
        throw new Error("Job title is required for summary generation");
      }

      const prompt = `Generate a professional resume summary for a ${title} with the following experience and skills. The summary should be 2-3 sentences, highlight key achievements, and be ATS-friendly.

Experience: ${JSON.stringify(experience)}
Skills: ${skills.join(", ")}

Please respond with just the summary text, no additional formatting.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content?.trim();
      if (!content) {
        throw new Error("No content received from OpenAI");
      }
      
      return content;
    } catch (error) {
      console.error("Error generating summary:", error);
      if (error.message?.includes("API key")) {
        throw new Error("OpenAI API key is not properly configured");
      }
      if (error.message?.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your account.");
      }
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  async generateBulletPoints(jobTitle: string, company: string, responsibilities?: string): Promise<string[]> {
    try {
      this.validateApiKey();
      
      if (!jobTitle || !company) {
        throw new Error("Job title and company are required for bullet point generation");
      }

      const prompt = `Generate 3-4 professional bullet points for a ${jobTitle} position at ${company}. 
      ${responsibilities ? `Current responsibilities: ${responsibilities}` : ""}
      
      Each bullet point should:
      - Start with an action verb
      - Include quantifiable achievements where possible
      - Be ATS-friendly
      - Be specific to the role
      
      Respond with a JSON object with a "bulletPoints" array of strings.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Generate bullet points in JSON format."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      const result = JSON.parse(content);
      return result.bulletPoints || [];
    } catch (error) {
      console.error("Error generating bullet points:", error);
      if (error.message?.includes("API key")) {
        throw new Error("OpenAI API key is not properly configured");
      }
      if (error.message?.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your account.");
      }
      throw new Error(`Failed to generate bullet points: ${error.message}`);
    }
  }

  async suggestSkills(jobTitle: string, experience?: any[]): Promise<{ technical: string[], soft: string[] }> {
    try {
      this.validateApiKey();
      
      if (!jobTitle) {
        throw new Error("Job title is required for skill suggestions");
      }

      const prompt = `Suggest relevant technical and soft skills for a ${jobTitle} position.
      ${experience ? `Based on this experience: ${JSON.stringify(experience)}` : ""}
      
      Provide 8-10 technical skills and 5-6 soft skills that are most relevant and in-demand.
      
      Respond with a JSON object with "technical" and "soft" arrays.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a career counselor providing skill recommendations."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        technical: result.technical || [],
        soft: result.soft || []
      };
    } catch (error) {
      console.error("Error suggesting skills:", error);
      if (error.message?.includes("API key")) {
        throw new Error("OpenAI API key is not properly configured");
      }
      if (error.message?.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your account.");
      }
      throw new Error(`Failed to suggest skills: ${error.message}`);
    }
  }

  async calculateATSScore(resumeData: any, jobDescription?: string): Promise<{ score: number, feedback: string[], suggestions: string[] }> {
    try {
      this.validateApiKey();
      
      if (!resumeData) {
        throw new Error("Resume data is required for ATS score calculation");
      }

      const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a score out of 100.
      ${jobDescription ? `Job Description: ${jobDescription}` : ""}
      
      Resume Data: ${JSON.stringify(resumeData)}
      
      Consider:
      - Keyword optimization
      - Formatting compatibility
      - Section organization
      - Content quality
      - Quantifiable achievements
      
      Respond with a JSON object containing:
      - score: number (0-100)
      - feedback: array of positive points
      - suggestions: array of improvement suggestions`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an ATS optimization expert analyzing resume compatibility."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      const result = JSON.parse(content);
      return {
        score: Math.min(100, Math.max(0, result.score || 75)),
        feedback: result.feedback || ["Resume structure is well-organized"],
        suggestions: result.suggestions || ["Consider adding more quantifiable achievements"]
      };
    } catch (error) {
      console.error("Error calculating ATS score:", error);
      if (error.message?.includes("API key")) {
        throw new Error("OpenAI API key is not properly configured");
      }
      if (error.message?.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your account.");
      }
      throw new Error(`Failed to calculate ATS score: ${error.message}`);
    }
  }
}

export const aiService = new AIService();
