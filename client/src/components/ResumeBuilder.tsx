import React, { useState } from 'react';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { SummarySection } from './sections/SummarySection';
import { PreviewSection } from './sections/PreviewSection';
import { useResumeData } from '../hooks/useResumeData';
import { cn } from '@/lib/utils';

type ResumeStep = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'preview';

const RESUME_STEPS: { key: ResumeStep; label: string; icon: string }[] = [
  { key: 'personal', label: 'Personal Info', icon: '👤' },
  { key: 'summary', label: 'Summary', icon: '📝' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'skills', label: 'Skills', icon: '⚡' },
  { key: 'preview', label: 'Preview', icon: '👁️' }
];

export const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ResumeStep>('personal');
  const { 
    resumeData, 
    addExperience, 
    updateExperience, 
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill
  } = useResumeData();

  const getCurrentStepIndex = () => {
    return RESUME_STEPS.findIndex(step => step.key === currentStep);
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < RESUME_STEPS.length - 1) {
      setCurrentStep(RESUME_STEPS[currentIndex + 1].key);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(RESUME_STEPS[currentIndex - 1].key);
    }
  };

  const handleStepClick = (step: ResumeStep) => {
    setCurrentStep(step);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoSection onNext={handleNext} />;
      case 'summary':
        return <SummarySection onNext={handleNext} onPrevious={handlePrevious} />;
      case 'experience':
        return (
          <ExperienceSection
            experiences={resumeData.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onDelete={deleteExperience}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'education':
        return (
          <EducationSection
            education={resumeData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onDelete={deleteEducation}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            skills={resumeData.skills}
            onAdd={addSkill}
            onUpdate={updateSkill}
            onDelete={deleteSkill}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'preview':
        return <PreviewSection onPrevious={handlePrevious} />;
      default:
        return <PersonalInfoSection onNext={handleNext} />;
    }
  };

  return (
    <div className="resume-builder min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">Create your professional resume step by step</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {getCurrentStepIndex() + 1} of {RESUME_STEPS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {RESUME_STEPS.map((step, index) => {
              const isActive = step.key === currentStep;
              const isCompleted = index < getCurrentStepIndex();
              const isClickable = index <= getCurrentStepIndex();

              return (
                <button
                  key={step.key}
                  onClick={() => isClickable && handleStepClick(step.key)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap",
                    isActive && "bg-blue-600 text-white",
                    isCompleted && !isActive && "bg-green-100 text-green-700 hover:bg-green-200",
                    !isActive && !isCompleted && isClickable && "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    !isClickable && "bg-gray-50 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span>{step.label}</span>
                  {isCompleted && !isActive && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress Line */}
          <div className="h-1 bg-gray-200 relative mt-2">
            <div className="absolute left-0 top-0 h-full bg-blue-600" style={{ width: `${(getCurrentStepIndex() / (RESUME_STEPS.length - 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl mt-8 px-4">
        {renderCurrentStep()}
      </div>

      {/* Quick Navigation (Desktop) */}
      <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2">
        <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Jump</h4>
          {RESUME_STEPS.map((step, index) => (
            <button
              key={step.key}
              onClick={() => setCurrentStep(step.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                currentStep === step.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {index + 1}. {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Section Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 'personal'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 'personal'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {RESUME_STEPS.find(step => step.key === currentStep)?.label}
            </div>
            <div className="text-xs text-gray-500">
              {getCurrentStepIndex() + 1} of {RESUME_STEPS.length}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep === 'preview'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 'preview'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>Next</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};