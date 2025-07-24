import React, { useState } from 'react';
import { useResumeData } from '../../hooks/useResumeData';
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

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Simulate PDF generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a download link
      const link = document.createElement('a');
      link.href = '#'; // Replace with actual PDF URL
      link.download = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
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
    let total = 5;

    if (resumeData.personalInfo.firstName && resumeData.personalInfo.lastName && resumeData.personalInfo.email) completed++;
    if (resumeData.summary) completed++;
    if (resumeData.experiences.length > 0) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;

    return Math.round((completed / total) * 100);
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

      {/* Resume Preview */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h3>
        
        {/* Mock Resume Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="text-center border-b border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
            </h1>
            {/* {resumeData.personalInfo.title && (
              <p className="text-lg text-gray-600 mt-1">{resumeData.personalInfo.title}</p>
            )} */}
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
              {/* {resumeData.personalInfo.city && resumeData.personalInfo.state && (
                <span>{resumeData.}, {resumeData.personalInfo.state}</span>
              )} */}
            </div>
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{resumeData  .summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experiences.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Work Experience</h2>
              <div className="space-y-3">
                {resumeData.experiences.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
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
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
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
        </div>
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
          onClick={handleDownloadPDF}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
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