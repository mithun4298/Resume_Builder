import type { ResumeData } from "@/types/resume";

export const createDefaultResumeData = (): ResumeData => ({
  personalInfo: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: { 
    technical: [], 
    soft: [] 
  },
  projects: [],
  certifications: [],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "skills",
    "education",
    "projects"
  ],
});

export const defaultSectionOrder = [
  "personal",
  "summary",
  "experience",
  "skills",
  "education",
  "projects"
] as const;

export const defaultResumeSettings = {
  templateId: "modern",
  isPublic: false,
} as const;

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};