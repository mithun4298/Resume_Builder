import { pgTable, varchar, timestamp, jsonb, index, serial, boolean, } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export const sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, (table) => [index("IDX_session_expire").on(table.expire)]);
export const users = pgTable("users", {
    id: varchar("id").primaryKey().notNull(),
    email: varchar("email").unique(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    profileImageUrl: varchar("profile_image_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export const resumes = pgTable("resumes", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    title: varchar("title").notNull(),
    data: jsonb("data").notNull(),
    templateId: varchar("template_id").notNull().default("modern"),
    isPublic: boolean("is_public").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertResumeSchema = createInsertSchema(resumes);
export const selectResumeSchema = createSelectSchema(resumes);
export const resumeSchema = z.object({
    personalInfo: z.object({
        firstName: z.string(),
        lastName: z.string(),
        title: z.string(),
        email: z.string().email(),
        phone: z.string(),
        location: z.string().optional(),
        website: z.string().optional(),
    }),
    summary: z.string(),
    experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        current: z.boolean().default(false),
        bullets: z.array(z.string()),
    })),
    education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        gpa: z.string().optional(),
    })),
    skills: z.object({
        technical: z.array(z.string()),
        soft: z.array(z.string()),
    }),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        url: z.string().optional(),
    })),
    certifications: z.array(z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string(),
        url: z.string().optional(),
    })),
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
//# sourceMappingURL=schema.js.map