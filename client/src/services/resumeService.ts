import { ResumeData } from '../hooks/useResumeData';

const API_BASE_URL = '/api';

export interface SaveResumeRequest {
  resumeData: ResumeData;
  templateId?: string;
}

export interface GeneratePDFRequest {
  resumeData: ResumeData;
  templateId: string;
}

export interface ResumeResponse {
  id: string;
  resumeData: ResumeData;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

class ResumeService {
  async saveResume(data: SaveResumeRequest): Promise<ResumeResponse> {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save resume');
    }

    return response.json();
  }

  async getResume(id: string): Promise<ResumeResponse> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }

    return response.json();
  }

  async updateResume(id: string, data: SaveResumeRequest): Promise<ResumeResponse> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update resume');
    }

    return response.json();
  }

  async deleteResume(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete resume');
    }
  }

  async generatePDF(data: GeneratePDFRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/resumes/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return response.blob();
  }

  async generateSummary(experience: string, skills: string[]): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experience, skills }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const result = await response.json();
    return result.summary;
  }

  async improveDescription(description: string, jobTitle: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/ai/improve-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, jobTitle }),
    });

    if (!response.ok) {
      throw new Error('Failed to improve description');
    }

    const result = await response.json();
    return result.improvedDescription;
  }

  async getUserResumes(): Promise<ResumeResponse[]> {
    const response = await fetch(`${API_BASE_URL}/resumes/user`);

    if (!response.ok) {
      throw new Error('Failed to fetch user resumes');
    }

    return response.json();
  }
}

export const resumeService = new ResumeService();