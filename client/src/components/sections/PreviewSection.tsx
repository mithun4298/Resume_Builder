import React, { useState } from 'react';
import { useResumeData } from '../../hooks/useResumeData';
import { downloadResumePDF } from '../ResumePDF';
import { cn } from '@/lib/utils';

interface PreviewSectionProps {
  onPrevious: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  onPrevious
}) => {
  const { resumeData } = useResumeData();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const templates = [
    { id: 'modern', name: 'Modern', preview: '📄' },
    { id: 'classic', name: 'Classic', preview: '📋' },
    { id: 'creative', name: 'Creative', preview: '🎨' },
    { id: 'minimal', name: 'Minimal', preview: '📃' }
  ];

// Update the handleDownloadPDF function:

const handleDownloadPDF = async () => {
  setIsGeneratingPDF(true);
  try {
    await downloadResumePDF(resumeData, selectedTemplate);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    setIsGeneratingPDF(false);
  }
};

  const handleShareResume = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume',
          text: 'Check out my professional resume',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 6;

    if (resumeData.personalInfo.firstName && resumeData.personalInfo.lastName && resumeData.personalInfo.email) completed++;
    if (resumeData.summary) completed++;
    if (resumeData.experiences.length > 0) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.certifications.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  // Add this function to get preview styles:

const getPreviewStyles = (template: string) => {
  const baseClasses = "bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto";
  
  const templateClasses = {
    modern: `${baseClasses} border-blue-200`,
    classic: `${baseClasses} border-gray-800`,
    creative: `${baseClasses} border-purple-200 bg-purple-50`,
    minimal: `${baseClasses} border-gray-100`,
  };
  
  return templateClasses[selectedTemplate] || templateClasses.modern;
};

const getHeaderStyles = (template: string) => {
  const templateStyles = {
    modern: "text-center bg-blue-600 text-white p-4 rounded-t-lg -m-6 mb-4",
    classic: "text-center border-b-4 border-black pb-4",
    creative: "text-center bg-purple-600 text-white p-4 rounded-t-lg -m-6 mb-4",
    minimal: "text-left border-b border-gray-300 pb-4",
  };
  
  return templateStyles[template] || templateStyles.modern;
};

const getSectionTitleStyles = (template: string) => {
  const templateStyles = {
    modern: "text-lg font-semibold text-blue-600 mb-2 border-b-2 border-blue-500 pb-1",
    classic: "text-lg font-semibold text-black mb-2 border-b border-black pb-1 uppercase tracking-wide",
    creative: "text-lg font-semibold text-purple-600 mb-2 bg-purple-100 px-2 py-1 rounded",
    minimal: "text-sm font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1",
  };
  
  return templateStyles[template] || templateStyles.modern;
};

const getSkillTagStyles = (template: string) => {
  const templateStyles = {
    modern: "px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded",
    classic: "px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded",
    creative: "px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded",
    minimal: "px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded",
  };
  
  return templateStyles[template] || templateStyles.modern;
};

const getExperienceBorderStyles = (template: string) => {
  const templateStyles = {
    modern: "border-l-2 border-blue-200 pl-4",
    classic: "border-l-2 border-black pl-4",
    creative: "border-l-4 border-purple-400 pl-4",
    minimal: "border-l border-gray-300 pl-4",
  };
  
  return templateStyles[template] || templateStyles.modern;
};

  return (
    <div className="preview-section space-y-6 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview</h2>
        <p className="text-gray-600">Review your resume and download when ready</p>
      </div>

      {/* Completion Status */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Completion Status</h3>
          <span className="text-2xl font-bold text-blue-600">{getCompletionPercentage()}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>

        <div className="space-y-2 text-sm">
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.personalInfo.firstName && resumeData.personalInfo.email ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData.personalInfo.firstName && resumeData.personalInfo.email ? "✅" : "⭕"}</span>
            <span>Personal Information</span>
          </div>
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.summary ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData .summary ? "✅" : "⭕"}</span>
            <span>Professional Summary</span>
          </div>
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.experiences.length > 0 ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData.experiences.length > 0 ? "✅" : "⭕"}</span>
            <span>Work Experience</span>
          </div>
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.education.length > 0 ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData.education.length > 0 ? "✅" : "⭕"}</span>
            <span>Education</span>
          </div>
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.skills.length > 0 ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData.skills.length > 0 ? "✅" : "⭕"}</span>
            <span>Skills</span>
          </div>
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.certifications.length > 0 ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData.certifications.length > 0 ? "✅" : "⭕"}</span>
            <span>Certifications</span>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={cn(
                "p-4 border-2 rounded-xl text-center transition-all duration-200",
                selectedTemplate === template.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="text-3xl mb-2">{template.preview}</div>
              <div className="text-sm font-medium text-gray-900">{template.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Template Info */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-4 h-4 rounded-full",
            selectedTemplate === 'modern' && "bg-blue-500",
            selectedTemplate === 'classic' && "bg-gray-800", 
            selectedTemplate === 'creative' && "bg-purple-500",
            selectedTemplate === 'minimal' && "bg-gray-400"
          )}></div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template Selected
            </h4>
            <p className="text-sm text-gray-600">
              {selectedTemplate === 'modern' && 'Clean, professional design with blue accents'}
              {selectedTemplate === 'classic' && 'Traditional black and white layout'}
              {selectedTemplate === 'creative' && 'Colorful design with purple highlights'}
              {selectedTemplate === 'minimal' && 'Simple, clean layout with minimal styling'}
            </p>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className={getPreviewStyles(selectedTemplate)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h3>
        
        {/* Mock Resume Preview */}
          <div className="space-y-4">
            {/* Header */}
            <div className={getHeaderStyles(selectedTemplate)}>
              <h1 className={cn(
                "text-2xl font-bold",
                selectedTemplate === 'modern' || selectedTemplate === 'creative' ? "text-white" : "text-gray-900"
              )}>
                {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
              </h1>
              <div className={cn(
                "flex flex-wrap justify-center gap-4 mt-2 text-sm",
                selectedTemplate === 'modern' || selectedTemplate === 'creative' ? "text-white" : "text-gray-600"
              )}>
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div>
                <h2 className={getSectionTitleStyles(selectedTemplate)}>Professional Summary</h2>
                <p className="text-gray-700 text-sm leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experiences.length > 0 && (
              <div>
                <h2 className={getSectionTitleStyles(selectedTemplate)}>Work Experience</h2>
                <div className="space-y-3">
                  {resumeData.experiences.slice(0, 2).map((exp) => (
                    <div key={exp.id} className={getExperienceBorderStyles(selectedTemplate)}>
                      <h3 className="font-medium text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-1">{exp.description.substring(0, 100)}...</p>
                      )}
                    </div>
                  ))}
                  {resumeData.experiences.length > 2 && (
                    <p className="text-sm text-gray-500 italic">+ {resumeData.experiences.length - 2} more positions</p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h2 className={getSectionTitleStyles(selectedTemplate)}>Education</h2>
                <div className="space-y-2">
                  {resumeData.education.slice(0, 2).map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution} • {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div>
                <h2 className={getSectionTitleStyles(selectedTemplate)}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.slice(0, 8).map((skill) => (
                    <span
                      key={skill.id}
                      className={getSkillTagStyles(selectedTemplate)}
                    >
                      {skill.name}
                    </span>
                  ))}
                  {resumeData.skills.length > 8 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                      +{resumeData.skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <div>
                <h2 className={getSectionTitleStyles(selectedTemplate)}>Certifications</h2>
                <div className="space-y-2">
                  {resumeData.certifications.slice(0, 3).map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                  {resumeData.certifications.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      +{resumeData.certifications.length - 3} more certifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Resume</h3>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isGeneratingPDF
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isGeneratingPDF ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating PDF...</span>
            </div>
          ) : (
            "📄 Download PDF"
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onPrevious}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleShareResume}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Share Resume
        </button>
      </div>
    </div>
  );
};