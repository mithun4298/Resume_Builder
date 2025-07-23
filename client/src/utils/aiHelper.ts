import axios from 'axios';

export type AIProvider = 'openai' | 'gemini';

export interface GenerateAIContentOptions {
  prompt: string;
  provider: AIProvider;
  apiKey?: string;
}

export async function generateAIContent({ prompt, provider, apiKey }: GenerateAIContentOptions): Promise<string> {
  try {
    if (provider === 'openai') {
      const response = await axios.post('/api/openai', { prompt, apiKey });
      return response.data.text || '';
    } else if (provider === 'gemini') {
      const response = await axios.post('/api/gemini', { prompt, apiKey });
      return response.data.text || '';
    } else {
      throw new Error('Unsupported AI provider');
    }
  } catch (error: any) {
    // Optionally log error or send to error tracking
    return 'AI generation failed.';
  }
}
