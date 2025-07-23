export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Project[];
  certifications: Certification[];
  customSections?: CustomSection[];
  sectionOrder?: SectionKey[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
}

export interface Experience {
  title: string;
  current: boolean;
  company: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
  location?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface CustomSection {
  key: string;
  label: string;
  content: string;
}

export type SectionKey =
  | "personal"
  | "summary"
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "certifications";

export const SECTION_KEYS: SectionKey[] = [
  "personal",
  "summary",
  "experience",
  "skills",
  "education",
  "projects",
  "certifications",
];

export interface DesignSettings {
  template: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
  accentColor: string;
  fontFamily: string;
}

export interface ResumeSettings {
  isPublic: boolean;
  allowComments: boolean;
  showContactInfo?: boolean;
  atsOptimized: boolean;
  fileName: string;
  includeContactInfo: boolean;
}

export interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  atsScore?: {
    score: number;
    feedback: string[];
    suggestions: string[];
  };
  isCalculating?: boolean;
  onExportPdf?: () => void;
  exportPdfPending?: boolean;
}
