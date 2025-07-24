import React from 'react';
import { TouchFormField } from '../mobile/TouchFormField';
import { useResumeData } from '@/hooks/useResumeData';

interface PersonalInfoSectionProps {
  onNext: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  onNext
}) => {
  const { resumeData, updatePersonalInfo } = useResumeData();

  const handleFieldChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const isFormValid = () => {
    const { personalInfo } = resumeData;
    return personalInfo.firstName && 
           personalInfo.lastName && 
           personalInfo.email && 
           personalInfo.phone;
  };

  return (
    <div className="personal-info-section space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic contact information</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchFormField
            label="First Name"
            value={resumeData.personalInfo.firstName || ''}
            onChange={(value) => handleFieldChange('firstName', value)}
            placeholder="John"
            required
          />
          <TouchFormField
            label="Last Name"
            value={resumeData.personalInfo.lastName || ''}
            onChange={(value) => handleFieldChange('lastName', value)}
            placeholder="Doe"
            required
          />
        </div>

        <TouchFormField
          label="Email Address"
          value={resumeData.personalInfo.email || ''}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="john.doe@email.com"
          type="email"
          required
        />

        <TouchFormField
          label="Phone Number"
          value={resumeData.personalInfo.phone || ''}
          onChange={(value) => handleFieldChange('phone', value)}
          placeholder="+1 (555) 123-4567"
          type="tel"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchFormField
            label="City"
            value={resumeData.personalInfo.city || ''}
            onChange={(value) => handleFieldChange('city', value)}
            placeholder="New York"
          />
          <TouchFormField
            label="State/Province"
            value={resumeData.personalInfo.state || ''}
            onChange={(value) => handleFieldChange('state', value)}
            placeholder="NY"
          />
        </div>

        <TouchFormField
          label="Professional Title"
          value={resumeData.personalInfo.title || ''}
          onChange={(value) => handleFieldChange('title', value)}
          placeholder="Software Engineer"
          helpText="This will appear below your name on the resume"
        />

        <TouchFormField
          label="LinkedIn Profile"
          value={resumeData.personalInfo.linkedin || ''}
          onChange={(value) => handleFieldChange('linkedin', value)}
          placeholder="linkedin.com/in/johndoe"
          type="url"
        />

        <TouchFormField
          label="Portfolio/Website"
          value={resumeData.personalInfo.website || ''}
          onChange={(value) => handleFieldChange('website', value)}
          placeholder="johndoe.com"
          type="url"
        />
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Personal Info Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use a professional email address</li>
          <li>• Include your city and state for location context</li>
          <li>• Add your LinkedIn profile to increase credibility</li>
          <li>• Include a portfolio website if you have one</li>
          <li>• Make sure your phone number is current</li>
        </ul>
      </div>

      {/* Navigation Button */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};