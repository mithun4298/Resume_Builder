
import React from 'react';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { useLocation } from 'wouter';

export const ResumeBuilderPage: React.FC = () => {
  const [location] = useLocation();
  
  // Extract resume ID from query parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const resumeId = urlParams.get('id');

  return (
    <div className="min-h-screen bg-blue-50">
      <ResumeBuilder resumeId={resumeId} />
    </div>
  );
};

export default ResumeBuilderPage;