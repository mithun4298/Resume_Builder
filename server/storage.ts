import {
  users,
  resumes,
  type User,
  type UpsertUser,
  type Resume,
  type InsertResume,
  type ResumeData,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Resume operations
  async createResume(userId: string, resume: InsertResume): Promise<Resume> {
    const [newResume] = await db
      .insert(resumes)
      .values({
        ...resume,
        userId,
      })
      .returning();
    return newResume;
  }

  async updateResume(id: number, userId: string, resume: Partial<InsertResume>): Promise<Resume | undefined> {
    const [updatedResume] = await db
      .update(resumes)
      .set({
        ...resume,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
      .returning();
    return updatedResume;
  }

  async deleteResume(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getResume(id: number, userId: string): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    return resume;
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
  }
}

export const storage = new DatabaseStorage();
