export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  dates: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  dates: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skills {
  leadership?: string[];
  strategic?: string[];
  technical?: string[];
  soft?: string[];
  primary?: string[];
  secondary?: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: Skills;
  achievements?: string[];
  certifications?: Array<{
    id: string;
    name: string;
    issuer?: string;
    date?: string;
    url?: string;
    description?: string;
    dates?: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    technologies?: string[];
    url?: string;
    dates?: string;
  }>;
}

export interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
  scale?: number;
}