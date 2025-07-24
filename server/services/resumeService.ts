import { db } from '../db';
import { resumes } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class ResumeService {
  async createResume(data: {
    userId: string;
    title: string;
    resumeData: any;
    templateId?: string;
  }) {
    try {
      const [resume] = await db.insert(resumes).values({
        userId: data.userId,
        title: data.title,
        data: data.resumeData,
        templateId: data.templateId || 'modern',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      return resume;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

  async getResumeById(id: number, userId: string) {
    try {
      const [resume] = await db
        .select()
        .from(resumes)
        .where(eq(resumes.id, id))
        .limit(1);

      if (!resume || resume.userId !== userId) {
        return null;
      }

      return resume;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  }

  async updateResume(id: number, userId: string, data: Partial<{
    title: string;
    data: any;
    templateId: string;
    isPublic: boolean;
  }>) {
    try {
      const [resume] = await db
        .update(resumes)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(resumes.id, id))
        .returning();

      if (!resume || resume.userId !== userId) {
        return null;
      }

      return resume;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  }

  async deleteResume(id: number, userId: string) {
    try {
      const [resume] = await db
        .delete(resumes)
        .where(eq(resumes.id, id))
        .returning();

      if (!resume || resume.userId !== userId) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  async getUserResumes(userId: string) {
    try {
      const userResumes = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, userId));

      return userResumes;
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      throw error;
    }
  }
}

export const resumeService = new ResumeService();