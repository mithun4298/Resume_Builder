import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  async generateSummary(personalInfo: any, experience: any[]): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const prompt = `Generate a professional resume summary for:
Name: ${personalInfo.firstName} ${personalInfo.lastName}
Experience: ${experience.map(exp => `${exp.title} at ${exp.company}`).join(', ')}

Create a compelling 2-3 sentence professional summary that highlights key strengths and career focus.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Create concise, impactful resume summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      return content;
    } catch (error: unknown) {
      console.error('AI Service Error:', error);
      
      if (error instanceof Error) {
        if (error.message?.includes("API key")) {
          throw new Error('Invalid API key. Please check your OpenAI configuration.');
        }
        if (error.message?.includes("quota")) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error(`Failed to generate summary: ${error.message}`);
      }
      
      throw new Error('Failed to generate summary: Unknown error occurred');
    }
  }

  async generateProfessionalSummary(resumeData: any): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const prompt = `Based on this resume data, generate a professional summary:
${JSON.stringify(resumeData, null, 2)}

Create a compelling professional summary that highlights the candidate's key strengths, experience, and career objectives in 2-3 sentences.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Create professional, impactful summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      return content;
    } catch (error: unknown) {
      console.error('AI Service Error:', error);
      
      if (error instanceof Error) {
        if (error.message?.includes("API key")) {
          throw new Error('Invalid API key. Please check your OpenAI configuration.');
        }
        if (error.message?.includes("quota")) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error(`Failed to generate professional summary: ${error.message}`);
      }
      
      throw new Error('Failed to generate professional summary: Unknown error occurred');
    }
  }

  async generateBulletPoints(jobTitle: string, company: string, description: string): Promise<string[]> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const prompt = `Convert this job description into 3-5 professional bullet points for a resume:

Job Title: ${jobTitle}
Company: ${company}
Description: ${description}

Format as bullet points that start with strong action verbs and include quantifiable achievements where possible.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Convert job descriptions into impactful bullet points using strong action verbs and quantifiable achievements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      // Parse bullet points from the response
      const bulletPoints = content
        .split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(line => line.length > 0);

      return bulletPoints.length > 0 ? bulletPoints : [content.trim()];
    } catch (error: unknown) {
      console.error('AI Service Error:', error);
      
      if (error instanceof Error) {
        if (error.message?.includes("API key")) {
          throw new Error('Invalid API key. Please check your OpenAI configuration.');
        }
        if (error.message?.includes("quota")) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error(`Failed to generate bullet points: ${error.message}`);
      }
      
      throw new Error('Failed to generate bullet points: Unknown error occurred');
    }
  }

  async optimizeResume(resumeData: any): Promise<any> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const prompt = `Analyze and suggest improvements for this resume:
${JSON.stringify(resumeData, null, 2)}

Provide specific suggestions for:
1. Professional summary improvements
2. Experience section enhancements
3. Skills optimization
4. Overall structure recommendations

Return suggestions in JSON format with clear categories.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume consultant. Analyze resumes and provide actionable improvement suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      try {
        return JSON.parse(content);
      } catch {
        // If JSON parsing fails, return structured text response
        return {
          suggestions: content,
          type: 'text'
        };
      }

    } catch (error: unknown) {
      console.error('AI Service Error:', error);
      
      if (error instanceof Error) {
        if (error.message?.includes("API key")) {
          throw new Error('Invalid API key. Please check your OpenAI configuration.');
        }
        if (error.message?.includes("quota")) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error(`Failed to optimize resume: ${error.message}`);
      }
      
      throw new Error('Failed to optimize resume: Unknown error occurred');
    }
  }
}

export const aiService = new AIService();