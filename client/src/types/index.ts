export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  [key: string]: any;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  sectionOrder: SectionType[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export type SectionType = "personal" | "summary" | "experience" | "skills" | "education" | "certifications" | "projects";

export interface TemplateProps {
  data: ResumeData;
  scale?: number;
}