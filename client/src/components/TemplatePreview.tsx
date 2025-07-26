import React from 'react';
import { TemplateConfig } from '@/data/templateData';
import { TEMPLATE_REGISTRY } from '@/components/resume-templates';
import { ResumeData } from '@/types/resume';

interface TemplatePreviewProps {
  config: TemplateConfig;
  data?: ResumeData;
  scale?: number;
  className?: string;
  showPlaceholder?: boolean;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  config,
  data,
  scale = 0.5,
  className = '',
  showPlaceholder = true
}) => {
  const TemplateComponent = TEMPLATE_REGISTRY[config.id];

  // Default sample data for preview
  const defaultSampleData: ResumeData = {
    personalInfo: {
      firstName: 'Alex',
      lastName: 'Johnson',
      title: 'Product Manager',
      email: 'alex.johnson@email.com',
      phone: '(555) 987-6543',
      location: 'New York, NY',
      website: 'alexjohnson.com',
      linkedin: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson'
    },
    summary: 'Results-driven product manager with 7+ years of experience leading cross-functional teams and delivering innovative solutions that drive business growth.',
    experience: [
      {
        id: '1',
        title: 'Senior Product Manager',
        company: 'Innovation Labs',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        location: 'New York, NY',
        description: 'Lead product strategy and development for B2B SaaS platform',
        bullets: [
          'Increased user engagement by 45% through data-driven feature development',
          'Managed product roadmap for $10M+ revenue product line',
          'Led cross-functional team of 12 engineers and designers'
        ]
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'Tech Solutions Inc.',
        startDate: '2019',
        endDate: '2021',
        current: false,
        location: 'San Francisco, CA',
        description: 'Managed product lifecycle for mobile applications',
        bullets: [
          'Launched 3 mobile apps with 100k+ downloads each',
          'Improved user retention by 30% through UX optimization'
        ]
      }
    ],
    skills: {
      technical: ['Product Strategy', 'Data Analysis', 'Agile/Scrum', 'SQL', 'Figma', 'Jira'],
      soft: ['Leadership', 'Strategic Thinking', 'Communication', 'Problem Solving', 'Team Management']
    },
    education: [
      {
        id: '1',
        degree: 'MBA, Business Administration',
        school: 'Stanford Graduate School of Business',
        startDate: '2016',
        endDate: '2018',
        location: 'Stanford, CA',
        gpa: '3.8'
      },
      {
        id: '2',
        degree: 'BS, Computer Science',
        school: 'University of California, Berkeley',
        startDate: '2012',
        endDate: '2016',
        location: 'Berkeley, CA',
        gpa: '3.7'
      }
    ],
    projects: [
      {
        id: '1',
        name: 'Customer Analytics Platform',
        description: 'Led development of analytics platform serving 50k+ users',
        technologies: ['Product Strategy', 'User Research', 'Analytics'],
        url: 'https://company.com/analytics',
        startDate: '2022',
        endDate: '2023'
      },
      {
        id: '2',
        name: 'Mobile App Redesign',
        description: 'Complete UX overhaul resulting in 40% increase in user satisfaction',
        technologies: ['UX Design', 'User Testing', 'Prototyping'],
        startDate: '2021',
        endDate: '2022'
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'Certified Product Manager',
        issuer: 'Product Management Institute',
        date: '2020',
        url: 'https://pmi.org/certifications'
      }
    ],
    languages: [
      {
        id: '1',
        name: 'English',
        level: 'Native'
      },
      {
        id: '2',
        name: 'Spanish',
        level: 'Conversational'
      }
    ]
  };

  const previewData = data || defaultSampleData;

  if (!TemplateComponent) {
    if (!showPlaceholder) return null;
    
    return (
      <div className={`w-full h-full bg-gray-100 flex items-center justify-center rounded-lg ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2 mx-auto"></div>
          <span className="text-gray-500 text-sm">{config.name}</span>
          <p className="text-xs text-gray-400 mt-1">Template not available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div className="w-[210mm] h-[297mm] bg-white shadow-sm">
        <TemplateComponent 
          data={previewData} 
          accentColor={config.accentColor}
        />
      </div>
    </div>
  );
};

export default TemplatePreview;