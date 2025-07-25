
import React from 'react';
import { TouchFormField } from '@/components/mobile/TouchFormField';
import { useResumeData } from '@/hooks/useResumeData';

interface PersonalInfoSectionProps {
  onNext: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ onNext }) => {
  const { resumeData, updatePersonalInfo } = useResumeData();
  const { personalInfo } = resumeData;

  // Check if required fields are completed
  const isCompleted = () => {
    return !!(
      personalInfo.firstName?.trim() &&
      personalInfo.lastName?.trim() &&
      personalInfo.email?.trim() &&
      personalInfo.phone?.trim()
    );
  };

  const handleNext = () => {
    if (isCompleted()) {
      onNext();
    } else {
      alert('Please fill in all required fields before continuing.');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 text-sm">
          Let's start with your basic contact information
        </p>
      </div>
      
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchFormField
          label="First Name"
          value={personalInfo.firstName || ''}
          onChange={(value) => updatePersonalInfo({ firstName: value })}
          required
          placeholder="Enter your first name"
          maxLength={50}
        />
        
        <TouchFormField
          label="Last Name"
          value={personalInfo.lastName || ''}
          onChange={(value) => updatePersonalInfo({ lastName: value })}
          required
          placeholder="Enter your last name"
          maxLength={50}
        />
      </div>
      
      {/* Contact Fields */}
      <TouchFormField
        label="Email Address"
        value={personalInfo.email || ''}
        onChange={(value) => updatePersonalInfo({ email: value })}
        type="email"
        required
        placeholder="your.email@example.com"
      />
      
      <TouchFormField
        label="Phone Number"
        value={personalInfo.phone || ''}
        onChange={(value) => updatePersonalInfo({ phone: value })}
        type="tel"
        placeholder="+1 (555) 123-4567"
      />
      
      <TouchFormField
        label="Professional Title"
        value={personalInfo.title || ''}
        onChange={(value) => updatePersonalInfo({ title: value })}
        placeholder="e.g., Software Engineer, Marketing Manager"
        maxLength={100}
      />
      
      <TouchFormField
        label="Location"
        value={personalInfo.location || ''}
        onChange={(value) => updatePersonalInfo({ location: value })}
        placeholder="City, State"
        maxLength={100}
      />
      
      {/* Optional Fields */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Optional Links
        </h3>
        
        <div className="space-y-4">
          <TouchFormField
            label="Website"
            value={personalInfo.website || ''}
            onChange={(value) => updatePersonalInfo({ website: value })}
            type="url"
            placeholder="https://yourwebsite.com"
          />
          
          <TouchFormField
            label="LinkedIn"
            value={personalInfo.linkedin || ''}
            onChange={(value) => updatePersonalInfo({ linkedin: value })}
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
          />
          
          <TouchFormField
            label="GitHub"
            value={personalInfo.github || ''}
            onChange={(value) => updatePersonalInfo({ github: value })}
            type="url"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>

      {/* Completion Status */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isCompleted() ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-sm font-medium">
            {isCompleted() ? '✅ Section Complete' : '⏳ Fill required fields to complete'}
          </span>
        </div>
        {!isCompleted() && (
          <p className="text-xs text-gray-600 mt-2">
            Required: First Name, Last Name, Email, Phone Number
          </p>
        )}
      </div>

      {/* Navigation Button */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <button
          onClick={handleNext}
          disabled={!isCompleted()}
          className={`w-full py-4 px-6 font-semibold rounded-xl transition-all duration-200 ${
            isCompleted()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isCompleted() ? 'Continue to Summary →' : 'Complete Required Fields'}
        </button>
      </div>
    </div>
  );
};