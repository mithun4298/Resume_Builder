import React, { useState } from 'react';
import { useResumeData } from '@/hooks/useResumeData';
import { TEMPLATE_CONFIGS, TemplateConfig } from '@/data/templateData';
import { TEMPLATE_REGISTRY } from '@/components/resume-templates';
import { Button } from '@/components/ui/button';
import { Eye, Check, Grid, Monitor, Star, ArrowLeft, ArrowRight } from 'lucide-react';

interface TemplateSelectionSectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const TemplateSelectionSection: React.FC<TemplateSelectionSectionProps> = ({
  onNext,
  onPrevious
}) => {
  const { resumeData, selectTemplate } = useResumeData();
  const [selectedTemplate, setSelectedTemplate] = useState(
    resumeData.selectedTemplate || 'modern'
  );
  const [previewMode, setPreviewMode] = useState<'grid' | 'single'>('grid');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    selectTemplate(templateId);
  };

  const selectedTemplateConfig = TEMPLATE_CONFIGS.find(t => t.id === selectedTemplate);

  const renderTemplatePreview = (config: TemplateConfig, isLarge = false) => {
    const TemplateComponent = TEMPLATE_REGISTRY[config.id];
    
    if (!TemplateComponent) {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2 mx-auto"></div>
            <span className="text-gray-500 text-sm">{config.name}</span>
          </div>
        </div>
      );
    }

    // Sample data for preview
    const sampleData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Engineer',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        website: 'johndoe.dev'
      },
      summary: 'Experienced software engineer with 5+ years of experience in full-stack development and team leadership.',
      experience: [
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          startDate: '2020',
          endDate: 'Present',
          current: true,
          location: 'San Francisco, CA',
          description: 'Led development of web applications using React and Node.js',
          bullets: [
            'Built scalable web applications serving 100k+ users',
            'Mentored junior developers and improved team productivity by 30%'
          ]
        }
      ],
      skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'Python'],
        soft: ['Leadership', 'Communication', 'Problem Solving']
      },
      education: [
        {
          id: '1',
          degree: 'Computer Science, BS',
          school: 'University of Technology',
          startDate: '2014',
          endDate: '2018'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          url: 'https://github.com/johndoe/ecommerce'
        }
      ]
    };

    const scale = isLarge ? 'scale-75' : 'scale-50';
    
    return (
      <div className={`w-full h-full ${scale} origin-top-left transform overflow-hidden`}>
        <div className="w-[210mm] h-[297mm] bg-white shadow-sm">
          <TemplateComponent data={sampleData} accentColor={config.accentColor} />
        </div>
      </div>
    );
  };

  return (
    <div className="template-selection-section p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Your Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a professional template that matches your style and industry. 
          All templates are ATS-friendly and optimized for modern hiring systems.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setPreviewMode('grid')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
              previewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setPreviewMode('single')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
              previewMode === 'single'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Live Preview
          </button>
        </div>
      </div>

      {previewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_CONFIGS.map((config) => (
            <div
              key={config.id}
              onClick={() => handleTemplateSelect(config.id)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-lg group ${
                selectedTemplate === config.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Recommended Badge */}
              {config.recommended && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Recommended
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              {selectedTemplate === config.id && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gray-50 rounded-t-xl overflow-hidden">
                {renderTemplatePreview(config)}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{config.name}</h3>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: config.accentColor + '20', color: config.accentColor }}
                  >
                    {config.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                
                {/* Suitable For */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Best for:</p>
                  <div className="flex flex-wrap gap-1">
                    {config.suitableFor.slice(0, 2).map((role, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {role}
                      </span>
                    ))}
                    {config.suitableFor.length > 2 && (
                      <span className="text-xs text-gray-500">+{config.suitableFor.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {config.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <Check className="w-3 h-3 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single Preview Mode */
        <div className="space-y-6">
          {/* Template Selector */}
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {TEMPLATE_CONFIGS.map((config) => (
              <button
                key={config.id}
                onClick={() => handleTemplateSelect(config.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedTemplate === config.id
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedTemplate === config.id ? { backgroundColor: config.accentColor } : {}}
              >
                {config.recommended && <Star className="w-3 h-3" />}
                {config.name}
              </button>
            ))}
          </div>

          {/* Large Preview */}
          {selectedTemplateConfig && (
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedTemplateConfig.name}
                      </h3>
                      {selectedTemplateConfig.recommended && (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {selectedTemplateConfig.description}
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Large Preview Area */}
              <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center">
                {renderTemplatePreview(selectedTemplateConfig, true)}
              </div>

              {/* Template Features */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Template Features:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedTemplateConfig.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Template Tips */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2">🎨 Template Selection Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Modern</strong> works well for tech and creative roles</li>
          <li>• <strong>Classic</strong> is perfect for traditional industries like finance or law</li>
          <li>• <strong>Minimalist</strong> emphasizes content over design</li>
          <li>• <strong>Two Column</strong> maximizes space utilization</li>
          <li>• Consider your industry and company culture when choosing</li>
        </ul>
      </div>

      {/* Selected Template Summary */}
      {selectedTemplateConfig && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Selected: {selectedTemplateConfig.name} Template
              </h4>
              <p className="text-sm text-gray-600">
                {selectedTemplateConfig.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <button
            onClick={onPrevious}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Preview Resume
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};