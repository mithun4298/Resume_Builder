import { useState, useCallback, useEffect } from 'react';

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

const STORAGE_KEY = 'resumeData';

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
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setResumeData({ ...initialResumeData, ...parsedData });
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((data: ResumeData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving resume data:', error);
    }
  }, []);

  // Personal Info management
  const updatePersonalInfo = useCallback((updates: Partial<PersonalInfo>) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...updates }
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Summary management
  const updateSummary = useCallback((summary: string) => {
    setResumeData(prev => {
      const newData = { ...prev, summary };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Experience management
  const addExperience = useCallback((experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString()
    };
    setResumeData(prev => {
      const newData = {
        ...prev,
        experiences: [...prev.experiences, newExperience]
      };
      saveToStorage(newData);
      return newData;
    });
    return newExperience.id;
  }, [saveToStorage]);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        experiences: prev.experiences.map(exp =>
          exp.id === id ? { ...exp, ...updates } : exp
        )
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const deleteExperience = useCallback((id: string) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        experiences: prev.experiences.filter(exp => exp.id !== id)
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const reorderExperiences = useCallback((experiences: Experience[]) => {
    setResumeData(prev => {
      const newData = { ...prev, experiences };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Education management
  const addEducation = useCallback((education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...education,
      id: Date.now().toString()
    };
    setResumeData(prev => {
      const newData = {
        ...prev,
        education: [...prev.education, newEducation]
      };
      saveToStorage(newData);
      return newData;
    });
    return newEducation.id;
  }, [saveToStorage]);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        education: prev.education.map(edu =>
          edu.id === id ? { ...edu, ...updates } : edu
        )
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const deleteEducation = useCallback((id: string) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Skills management
  const addSkill = useCallback((skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString()
    };
    setResumeData(prev => {
      const newData = {
        ...prev,
        skills: [...prev.skills, newSkill]
      };
      saveToStorage(newData);
      return newData;
    });
    return newSkill.id;
  }, [saveToStorage]);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.map(skill =>
          skill.id === id ? { ...skill, ...updates } : skill
        )
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const deleteSkill = useCallback((id: string) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.filter(skill => skill.id !== id)
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Projects management
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    setResumeData(prev => {
      const newData = {
        ...prev,
        projects: [...prev.projects, newProject]
      };
      saveToStorage(newData);
      return newData;
    });
    return newProject.id;
  }, [saveToStorage]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        projects: prev.projects.map(project =>
          project.id === id ? { ...project, ...updates } : project
        )
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const deleteProject = useCallback((id: string) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        projects: prev.projects.filter(project => project.id !== id)
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Certifications management
  const addCertification = useCallback((certification: Omit<Certification, 'id'>) => {
    const newCertification: Certification = {
      ...certification,
      id: Date.now().toString()
    };
    setResumeData(prev => {
      const newData = {
        ...prev,
        certifications: [...prev.certifications, newCertification]
      };
      saveToStorage(newData);
      return newData;
    });
    return newCertification.id;
  }, [saveToStorage]);

  const updateCertification = useCallback((id: string, updates: Partial<Certification>) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        certifications: prev.certifications.map(cert =>
          cert.id === id ? { ...cert, ...updates } : cert
        )
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  const deleteCertification = useCallback((id: string) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        certifications: prev.certifications.filter(cert => cert.id !== id)
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Template selection
  const selectTemplate = useCallback((templateId: string) => {
    setResumeData(prev => {
      const newData = { ...prev, selectedTemplate: templateId };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

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
      saveToStorage(newData);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [saveToStorage]);

  // Validate resume data
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

  // Bulk operations
  const bulkAddSkills = useCallback((skills: string[]) => {
    const newSkills: Skill[] = skills.map(skillName => ({
      id: generateId(),
      name: skillName.trim(),
      level: 'Intermediate' as const,
      category: 'Other'
    }));
    
    setResumeData(prev => {
      const newData = {
        ...prev,
        skills: [...prev.skills, ...newSkills]
      };
      saveToStorage(newData);
      return newData;
    });
  }, [generateId, saveToStorage]);

  const bulkDeleteSkills = useCallback((skillIds: string[]) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.filter(skill => !skillIds.includes(skill.id))
      };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

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