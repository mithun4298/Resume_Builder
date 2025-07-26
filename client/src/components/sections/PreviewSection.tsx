import React, { useState } from 'react';
import { ModernTemplatePreview } from '../preview-templates/ModernTemplatePreview';
import { ClassicTemplatePreview } from '../preview-templates/ClassicTemplatePreview';
import { CreativeTemplatePreview } from '../preview-templates/CreativeTemplatePreview';
import { MinimalTemplatePreview } from '../preview-templates/MinimalTemplatePreview';
import { useResumeData } from '../../hooks/useResumeData';
import { downloadResumePDF } from '../ResumePDF';
import { cn } from '@/lib/utils';

interface PreviewSectionProps {
  onPrevious: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  onPrevious
}) => {
  const { resumeData, selectTemplate } = useResumeData();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // Use global selectedTemplate
  const selectedTemplate = resumeData.selectedTemplate || 'modern';

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
    let total = 7;

    if (resumeData.personalInfo.firstName && resumeData.personalInfo.lastName && resumeData.personalInfo.email) completed++;
    if (resumeData.summary) completed++;
    if (resumeData.experiences.length > 0) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.certifications.length > 0) completed++;
    if (
      resumeData.projects &&
      resumeData.projects.length > 0 &&
      resumeData.projects.every(proj =>
        proj.name && proj.name.trim() &&
        proj.description && proj.description.trim()
      )
    ) completed++;

    return Math.round((completed / total) * 100);
  };

  // Add this function to get preview styles:

// ...existing code...

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
          <div className={cn(
            "flex items-center space-x-2",
            resumeData.projects && resumeData.projects.length > 0 && resumeData.projects.every(proj => proj.name && proj.name.trim() && proj.description && proj.description.trim()) ? "text-green-600" : "text-gray-500"
          )}>
            <span>{resumeData.projects && resumeData.projects.length > 0 && resumeData.projects.every(proj => proj.name && proj.name.trim() && proj.description && proj.description.trim()) ? "✅" : "⭕"}</span>
            <span>Projects</span>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => selectTemplate(template.id)}
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
      <div>
        {selectedTemplate === 'modern' && <ModernTemplatePreview resumeData={resumeData} />}
        {selectedTemplate === 'classic' && <ClassicTemplatePreview resumeData={resumeData} />}
        {selectedTemplate === 'creative' && <CreativeTemplatePreview resumeData={resumeData} />}
        {selectedTemplate === 'minimal' && <MinimalTemplatePreview resumeData={resumeData} />}
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
}