import { db } from './db';
import { users, resumes, type User, type UpsertUser, type Resume, type InsertResume } from '../shared/schema.js';

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Resume operations
  createResume(userId: string, resume: InsertResume): Promise<Resume>;
  updateResume(id: number, userId: string, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: number, userId: string): Promise<boolean>;
  getResume(id: number, userId: string): Promise<Resume | undefined>;
  getUserResumes(userId: string): Promise<Resume[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return undefined;
    
    return {
      id: user.id,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        }
      })
      .returning();

    if (!user) {
      throw new Error('Failed to create or update user');
    }

    return {
      id: user.id,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Resume operations
  async createResume(userId: string, resume: InsertResume): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values({
      userId,
      title: resume.title,
      data: resume.data,
      templateId: resume.templateId,
      isPublic: resume.isPublic,
    }).returning();

    if (!newResume) {
      throw new Error('Failed to create resume');
    }

    return {
      ...newResume,
      data: newResume.data as Resume['data']
    };
  }

  async updateResume(id: number, userId: string, resume: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updatedResume] = await db.update(resumes)
      .set({
        ...resume,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();

    if (!updatedResume) {
      return undefined;
    }

    return {
      ...updatedResume,
      data: updatedResume.data as Resume['data']
    };
  }

  async deleteResume(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    
    return result.count > 0;
  }

  async getResume(id: number, userId: string): Promise<Resume | undefined> {
    const [resume] = await db.select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .limit(1);

    if (!resume) {
      return undefined;
    }

    return {
      ...resume,
      data: resume.data as Resume['data']
    };
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    const userResumes = await db.select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(resumes.updatedAt);

    return userResumes.map(resume => ({
      ...resume,
      data: resume.data as Resume['data']
    }));
  }
}

// Export convenience functions
export async function getUserById(id: string): Promise<User | undefined> {
  const storage = new DatabaseStorage();
  return storage.getUser(id);
}

export async function createUser(userData: UpsertUser): Promise<User> {
  const storage = new DatabaseStorage();
  return storage.upsertUser(userData);
}

export const storage = new DatabaseStorage();