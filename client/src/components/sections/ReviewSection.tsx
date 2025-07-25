import React, { useState } from 'react';
import { useResumeData } from '@/hooks/useResumeData';

interface ReviewSectionProps {
  onNext: () => void;
  onPrevious: () => void;
  onEdit: (section: string) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  onNext,
  onPrevious,
  onEdit
}) => {
  const { resumeData } = useResumeData();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getSectionStatus = (section: string) => {
    switch (section) {
      case 'personal':
        // Check if required personal info fields are filled
        return (
          resumeData.personalInfo.firstName?.trim() &&
          resumeData.personalInfo.lastName?.trim() &&
          resumeData.personalInfo.email?.trim() &&
          resumeData.personalInfo.phone?.trim()
        ) ? 'complete' : 'incomplete';
        
      case 'summary':
        // Check if summary exists and has minimum word count
        const summaryText = resumeData.summary?.trim() || '';
        const wordCount = summaryText.split(/\s+/).filter(word => word.length > 0).length;
        return summaryText && wordCount >= 20 ? 'complete' : 'incomplete';
        
      case 'experience':
        return resumeData.experiences && resumeData.experiences.length > 0 ? 'complete' : 'incomplete';
        
      case 'education':
        return resumeData.education && resumeData.education.length > 0 ? 'complete' : 'incomplete';
        
      case 'skills':
        return resumeData.skills && resumeData.skills.length >= 3 ? 'complete' : 'incomplete';
        
      case 'template':
        return resumeData.selectedTemplate ? 'complete' : 'incomplete';
        
      default:
        return 'incomplete';
    }
  };

  const completionPercentage = () => {
    const sections = ['personal', 'summary', 'experience', 'education', 'skills', 'template'];
    const completedSections = sections.filter(section => getSectionStatus(section) === 'complete');
    return Math.round((completedSections.length / sections.length) * 100);
  };

  const sections = [
    {
      id: 'personal',
      name: 'Personal Information',
      description: `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}, ${resumeData.personalInfo.email}, ${resumeData.personalInfo.phone}`,
      icon: '👤'
    },
    {
      id: 'summary',
      name: 'Professional Summary',
      description: resumeData.summary ? 
        `${resumeData.summary.substring(0, 60)}...` : 
        'No summary added',
      icon: '📝'
    },
    {
      id: 'experience',
      name: 'Work Experience',
      description: `${resumeData.experiences.length} position${resumeData.experiences.length !== 1 ? 's' : ''} added`,
      icon: '💼'
    },
    {
      id: 'education',
      name: 'Education',
      description: `${resumeData.education.length} education${resumeData.education.length !== 1 ? 's' : ''} added`,
      icon: '🎓'
    },
    {
      id: 'skills',
      name: 'Skills',
      description: `${resumeData.skills.length} skill${resumeData.skills.length !== 1 ? 's' : ''} added`,
      icon: '⚡'
    },
    {
      id: 'template',
      name: 'Template',
      description: resumeData.selectedTemplate ? 
        `${.charAt(0).toUpperCase() + resumeData.selectedTemplate.slice(1)} template selected` :
        'No template selected',
      icon: '🎨'
    }
  ];

  return (
    <div className="review-section p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Resume
        </h2>
        <p className="text-gray-600">
          Check all sections and make final adjustments
        </p>
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resume Completion</h3>
          <span className="text-2xl font-bold text-blue-600">{completionPercentage()}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage()}%` }}
          />
        </div>

        {completionPercentage() === 100 ? (
          <div className="flex items-center text-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Your resume is complete and ready to download!</span>
          </div>
        ) : (
          <p className="text-gray-600">
            Complete all sections to unlock PDF download
          </p>
        )}
      </div>

      {/* Section Review */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Section Review</h3>
        
        {sections.map((section) => {
          const status = getSectionStatus(section.id);
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{section.name}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {status === 'complete' ? (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414L11.414 10l1.293 1.293a1 1 0 01-1.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10 7.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  <button
                    onClick={() => onEdit(section.id)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resume Preview */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="w-16 h-20 bg-white rounded-lg mx-auto mb-3 shadow-sm border border-gray-200"></div>
          <p className="text-gray-600 text-sm">
            Preview will show your formatted resume here
          </p>
          <button
            onClick={() => window.open('/preview', '_blank')}
            className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
          >
            Open Full Preview
          </button>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF || completionPercentage() !== 100}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              completionPercentage() === 100 
                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">PDF Download</h4>
                <p className="text-sm text-gray-600">
                  {isGeneratingPDF ? 'Generating...' : 'Ready to print and share'}
                </p>
              </div>
            </div>
          </button>

          <button
            disabled={completionPercentage() !== 100}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              completionPercentage() === 100 
                ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Word Document</h4>
                <p className="text-sm text-gray-600">Easy to edit and customize</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Tips for Success */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Tips for Success</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Before Applying:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Tailor your resume for each job</li>
              <li>• Use keywords from job descriptions</li>
              <li>• Proofread for spelling and grammar</li>
              <li>• Save in multiple formats (PDF, Word)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">After Download:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Test PDF formatting on different devices</li>
              <li>• Keep your resume updated regularly</li>
              <li>• Create versions for different industries</li>
              <li>• Get feedback from professionals</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <button
            onClick={onPrevious}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            ← Previous
          </button>
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF || completionPercentage() !== 100}
            className={`flex-1 py-4 px-6 font-semibold rounded-xl transition-all duration-200 ${
              completionPercentage() === 100
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
              '📄 Download Resume'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};