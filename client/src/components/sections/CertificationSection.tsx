import React, { useState, useEffect } from 'react';
import { useResumeData } from '@/hooks/useResumeData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface CertificationSectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({ onNext, onPrevious }) => {
  const { resumeData, addCertification, updateCertification, deleteCertification, enableAutoSave } = useResumeData();
  const [certifications, setCertifications] = useState<Certification[]>(resumeData.certifications || []);

  // Sync local state with resumeData.certifications
  useEffect(() => {
    setCertifications(resumeData.certifications || []);
  }, [resumeData.certifications]);

  // Enable autosave when certifications change
  useEffect(() => {
    enableAutoSave(true);
  }, [certifications, enableAutoSave]);

  return (
    <div className="certification-section space-y-6 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Certifications</h2>
        <p className="text-gray-600">
          Add your professional certifications and licenses
        </p>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map((certification, index) => (
          <Card key={certification.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Certification {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCertification(certification.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Certification Name */}
              <div className="space-y-2">
                <Label htmlFor={`cert-name-${certification.id}`}>
                  Certification Name *
                </Label>
                <Input
                  id={`cert-name-${certification.id}`}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  value={certification.name}
                  onChange={(e) => updateCertification(certification.id, { name: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Issuing Organization */}
              <div className="space-y-2">
                <Label htmlFor={`cert-issuer-${certification.id}`}>
                  Issuing Organization *
                </Label>
                <Input
                  id={`cert-issuer-${certification.id}`}
                  placeholder="e.g., Amazon Web Services"
                  value={certification.issuer}
                  onChange={(e) => updateCertification(certification.id, { issuer: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Date and URL Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor={`cert-date-${certification.id}`}>
                    Date Obtained *
                  </Label>
                  <Input
                    id={`cert-date-${certification.id}`}
                    type="month"
                    value={certification.date}
                    onChange={(e) => updateCertification(certification.id, { date: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Certification URL */}
                <div className="space-y-2">
                  <Label htmlFor={`cert-url-${certification.id}`}>
                    Verification URL (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id={`cert-url-${certification.id}`}
                      type="url"
                      placeholder="https://..."
                      value={certification.url || ''}
                      onChange={(e) => updateCertification(certification.id, { url: e.target.value })}
                      className="w-full pr-10"
                    />
                    {certification.url && (
                      <a
                        href={certification.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Validation Messages */}
              {(!certification.name.trim() || !certification.issuer.trim() || !certification.date.trim()) && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  Please fill in all required fields (marked with *)
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Certification Button */}
      <div className="text-center">
        <Button
          onClick={() => addCertification({ name: '', issuer: '', date: '', url: '' })}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {/* Tips Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Certification Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include industry-relevant certifications that match your target role</li>
            <li>• List certifications in reverse chronological order (newest first)</li>
            <li>• Include verification URLs when available to build credibility</li>
            <li>• Focus on current, non-expired certifications</li>
            <li>• Consider adding certification numbers if they're publicly verifiable</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex-1 py-4 px-6"
          >
            ← Previous
          </Button>
          <Button
            onClick={() => {
              // Validate certifications before proceeding
              const validCertifications = certifications.filter(cert => 
                cert.name.trim() && cert.issuer.trim() && cert.date.trim()
              );
              if (validCertifications.length !== certifications.length) {
                validCertifications.forEach(cert => {
                  updateCertification(cert.id, cert);
                });
              }
              onNext();
            }}
            className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};
