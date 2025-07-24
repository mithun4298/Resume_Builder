import React, { useState } from 'react';
import { useResumeData } from '@/hooks/useResumeData';

interface TemplateSelectionSectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with subtle colors',
    preview: '/templates/modern-preview.png',
    features: ['Clean layout', 'Professional colors', 'Easy to read'],
    recommended: true
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format preferred by conservative industries',
    preview: '/templates/classic-preview.png',
    features: ['Traditional layout', 'Black & white', 'ATS-friendly'],
    recommended: false
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant with focus on content',
    preview: '/templates/minimalist-preview.png',
    features: ['Minimal design', 'Lots of white space', 'Typography focused'],
    recommended: false
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography',
    preview: '/templates/elegant-preview.png',
    features: ['Sophisticated look', 'Premium fonts', 'Balanced layout'],
    recommended: false
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Eye-catching design for creative professionals',
    preview: '/templates/bold-preview.png',
    features: ['Creative layout', 'Bold typography', 'Color accents'],
    recommended: false
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Efficient layout with sidebar for skills and contact',
    preview: '/templates/two-column-preview.png',
    features: ['Two-column layout', 'Sidebar design', 'Space efficient'],
    recommended: false
  }
];

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
  selectTemplate(templateId); // <-- Correct usage
};

  const selectedTemplateData = TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="template-selection-section p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Template
        </h2>
        <p className="text-gray-600">
          Select a professional template that matches your style
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setPreviewMode('grid')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              previewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setPreviewMode('single')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              previewMode === 'single'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {previewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Recommended Badge */}
              {template.recommended && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gray-100 rounded-t-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-lg mb-2 mx-auto opacity-80"></div>
                    <div className="text-gray-600 font-medium">{template.name}</div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                {/* Features */}
                <div className="space-y-1">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
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
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* Large Preview */}
          {selectedTemplateData && (
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedTemplateData.name} Template
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedTemplateData.description}
                    </p>
                  </div>
                  {selectedTemplateData.recommended && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
              </div>

              {/* Large Preview Area */}
              <div className="aspect-[3/4] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-xl mb-4 mx-auto shadow-lg"></div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedTemplateData.name} Preview
                  </h4>
                  <p className="text-gray-600 max-w-xs">
                    This is how your resume will look with the {selectedTemplateData.name.toLowerCase()} template
                  </p>
                </div>
              </div>

              {/* Template Features */}
              <div className="p-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Template Features:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedTemplateData.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
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
      {selectedTemplateData && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Selected: {selectedTemplateData.name} Template
              </h4>
              <p className="text-sm text-gray-600">
                {selectedTemplateData.description}
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
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Preview Resume →
          </button>
        </div>
      </div>
    </div>
  );
};