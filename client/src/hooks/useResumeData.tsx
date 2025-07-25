import React, { useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  expiryDate?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  selectedTemplate: string;
}

// Create the context type
type ResumeDataContextType = {
  // State
  resumeData: ResumeData;
  isLoading: boolean;
  lastSaved: Date | null;
  
  // Personal Info
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  
  // Summary
  updateSummary: (summary: string) => void;
  
  // Experience
  addExperience: (experience: Omit<Experience, 'id'>) => string;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;
  
  // Education
  addEducation: (education: Omit<Education, 'id'>) => string;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => string;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  bulkAddSkills: (skills: string[]) => void;
  bulkDeleteSkills: (skillIds: string[]) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Certifications
  addCertification: (certification: Omit<Certification, 'id'>) => string;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  
  // Template
  selectTemplate: (templateId: string) => void;
  
  // Data Management
  clearResumeData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  
  // Validation & Stats
  validateResumeData: () => { isValid: boolean; errors: string[] };
  getCompletionPercentage: () => number;
  getResumeStats: () => any;
  
  // Settings
  enableAutoSave: (enabled?: boolean) => void;
  
  // Utilities
  generateId: () => string;
};

// Create the context
const ResumeDataContext = createContext<ResumeDataContextType | null>(null);

const STORAGE_KEY = 'resume-builder-data';

const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  selectedTemplate: 'modern'
};

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialResumeData;
    } catch {
      return initialResumeData;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save to localStorage whenever resumeData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    setLastSaved(new Date());
  }, [resumeData]);

  // Load data from localStorage on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const updatePersonalInfo = useCallback((updates: Partial<PersonalInfo>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates }
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResumeData(prev => ({
      ...prev,
      summary
    }));
  }, []);

  // Experience management
  const addExperience = useCallback((experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
    return newExperience.id;
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  }, []);

  const reorderExperiences = useCallback((experiences: Experience[]) => {
    setResumeData(prev => ({
      ...prev,
      experiences
    }));
  }, []);

  // Education management
  const addEducation = useCallback((education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...education,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    return newEducation.id;
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  }, []);

  // Skills management
  const addSkill = useCallback((skillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now().toString() + Math.random(),
      category: 'Technical'
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    return newSkill.id;
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, ...updates } : skill
      )
    }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  }, []);

  const bulkAddSkills = useCallback((skillNames: string[]) => {
    const newSkills: Skill[] = skillNames.map(name => ({
      id: Date.now().toString() + Math.random(),
      name,
      level: 'Intermediate' as const,
      category: 'Technical'
    }));
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, ...newSkills]
    }));
  }, []);

  const bulkDeleteSkills = useCallback((skillIds: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => !skillIds.includes(skill.id))
    }));
  }, []);

  // Projects management
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    return newProject.id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  }, []);

  // Certifications management
  const addCertification = useCallback((certification: Omit<Certification, 'id'>) => {
    const newCertification: Certification = {
      ...certification,
      id: Date.now().toString()
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
    return newCertification.id;
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<Certification>) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, ...updates } : cert
      )
    }));
  }, []);

  const deleteCertification = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  }, []);

  // Template selection
  const selectTemplate = useCallback((templateId: string) => {
    setResumeData(prev => ({
      ...prev,
      selectedTemplate: templateId
    }));
  }, []);

  // Clear all data
  const clearResumeData = useCallback(() => {
    setResumeData(initialResumeData);
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved(null);
  }, []);

  // Export data
  const exportData = useCallback(() => {
    return JSON.stringify(resumeData, null, 2);
  }, [resumeData]);

  // Import data
  const importData = useCallback((jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      const newData = { ...initialResumeData, ...parsedData };
      setResumeData(newData);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, []);

  // Validate resume data
  const validateResumeData = useCallback(() => {
    const errors: string[] = [];
    
    // Validate personal info
    if (!resumeData.personalInfo.firstName.trim()) {
      errors.push('First name is required.');
    }
    if (!resumeData.personalInfo.lastName.trim()) {
      errors.push('Last name is required.');
    }
    if (!resumeData.personalInfo.email.trim()) {
      errors.push('Email is required.');
    }
    if (!resumeData.personalInfo.phone.trim()) {
      errors.push('Phone number is required.');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (resumeData.personalInfo.email && !emailRegex.test(resumeData.personalInfo.email)) {
      errors.push('Please enter a valid email address.');
    }
    
    // Validate experiences
    resumeData.experiences.forEach((exp, index) => {
      if (!exp.title.trim()) {
        errors.push(`Experience ${index + 1}: Job title is required.`);
      }
      if (!exp.company.trim()) {
        errors.push(`Experience ${index + 1}: Company name is required.`);
      }
      if (!exp.startDate) {
        errors.push(`Experience ${index + 1}: Start date is required.`);
      }
    });
    
    // Validate education
    resumeData.education.forEach((edu, index) => {
      if (!edu.institution.trim()) {
        errors.push(`Education ${index + 1}: Institution name is required.`);
      }
      if (!edu.degree.trim()) {
        errors.push(`Education ${index + 1}: Degree is required.`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [resumeData]);

  // Get completion percentage
  const getCompletionPercentage = useCallback(() => {
    let completed = 0;
    let total = 0;
    
    // Personal info (40% weight)
    const personalInfoFields = ['firstName', 'lastName', 'email', 'phone', 'title'];
    personalInfoFields.forEach(field => {
      total++;
      if (resumeData.personalInfo[field as keyof PersonalInfo]?.trim()) {
        completed++;
      }
    });
    
    // Summary (10% weight)
    total++;
    if (resumeData.personalInfo.summary?.trim()) {
      completed++;
    }
    
    // Experience (25% weight)
    total++;
    if (resumeData.experiences.length > 0) {
      completed++;
    }
    
    // Education (15% weight)
    total++;
    if (resumeData.education.length > 0) {
      completed++;
    }
    
    // Skills (10% weight)
    total++;
    if (resumeData.skills.length > 0) {
      completed++;
    }
    
    return Math.round((completed / total) * 100);
  }, [resumeData]);

  // Get resume stats
  const getResumeStats = useCallback(() => {
    const wordCount = (text: string) => {
      return text.split(/\s+/).filter(word => word.length > 0).length;
    };
    
    const summaryWordCount = wordCount(resumeData.personalInfo.summary || '');
    const experienceWordCount = resumeData.experiences.reduce((total, exp) => {
      return total + exp.bullets.reduce((bulletTotal, bullet) => bulletTotal + wordCount(bullet), 0);
    }, 0);
    
    return {
      totalExperiences: resumeData.experiences.length,
      totalEducation: resumeData.education.length,
      totalSkills: resumeData.skills.length,
      totalProjects: resumeData.projects.length,
      totalCertifications: resumeData.certifications.length,
      summaryWordCount,
      experienceWordCount,
      totalWordCount: summaryWordCount + experienceWordCount,
      completionPercentage: getCompletionPercentage()
    };
  }, [resumeData, getCompletionPercentage]);

  // Auto-save functionality
  const enableAutoSave = useCallback((enabled: boolean = true) => {
    // This could be extended to implement periodic auto-saving
    // For now, we save on every change, so this is more of a placeholder
    console.log(`Auto-save ${enabled ? 'enabled' : 'disabled'}`);
  }, []);

  // Utility function to generate a unique ID
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  return {
    // State
    resumeData,
    isLoading,
    lastSaved,
    
    // Personal Info
    updatePersonalInfo,
    
    // Summary
    updateSummary,
    
    // Experience
    addExperience,
    updateExperience,
    deleteExperience,
    reorderExperiences,
    
    // Education
    addEducation,
    updateEducation,
    deleteEducation,
    
    // Skills
    addSkill,
    updateSkill,
    deleteSkill,
    bulkAddSkills,
    bulkDeleteSkills,
    
    // Projects
    addProject,
    updateProject,
    deleteProject,
    
    // Certifications
    addCertification,
    updateCertification,
    deleteCertification,
    
    // Template
    selectTemplate,
    
    // Data Management
    clearResumeData,
    exportData,
    importData,
    
    // Validation & Stats
    validateResumeData,
    getCompletionPercentage,
    getResumeStats,
    
    // Settings
    enableAutoSave,
    
    // Utilities
    generateId
  };
}

export function useResumeDataContext() {
  const context = useContext(ResumeDataContext);
  if (context === undefined) {
    throw new Error('useResumeDataContext must be used within a ResumeDataProvider');
  }
  return context;
}

// Provider component
export function ResumeDataProvider({ children }: { children: ReactNode }) {
  const resumeDataHook = useResumeData();
  
  return (
    <ResumeDataContext.Provider value={resumeDataHook}>
      {children}
    </ResumeDataContext.Provider>
  );
}