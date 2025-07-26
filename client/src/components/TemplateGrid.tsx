import React from 'react';
import { TemplateConfig } from '@/data/templateData';
import { TemplatePreview } from './TemplatePreview';
import { Star, Check } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface TemplateGridProps {
  templates: TemplateConfig[];
  selectedTemplate?: string;
  onTemplateSelect: (templateId: string) => void;
  previewData?: ResumeData;
  columns?: number;
  showFeatures?: boolean;
  className?: string;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  previewData,
  columns = 2,
  showFeatures = true,
  className = ''
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6 ${className}`}>
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onTemplateSelect(template.id)}
          className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
            selectedTemplate === template.id
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Selection indicator */}
          {selectedTemplate === template.id && (
            <div className="absolute top-3 left-3 z-10">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Recommended Badge */}
          {template.recommended && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Recommended
              </span>
            </div>
          )}

          {/* Template Preview */}
          <div className="aspect-[3/4] bg-gray-50 rounded-t-xl overflow-hidden">
            <TemplatePreview
              config={template}
              data={previewData}
              scale={0.3}
              className="w-full h-full"
            />
          </div>

          {/* Template Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: template.accentColor + '20', 
                  color: template.accentColor 
                }}
              >
                {template.category}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {template.description}
            </p>

            {/* Suitable For */}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Perfect for:</p>
              <div className="flex flex-wrap gap-1">
                {template.suitableFor.slice(0, 3).map((role, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {role}
                  </span>
                ))}
                {template.suitableFor.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    +{template.suitableFor.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            {/* Features */}
            {showFeatures && (
              <div className="space-y-1">
                {template.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
                {template.features.length > 3 && (
                  <p className="text-xs text-gray-400 ml-5">
                    +{template.features.length - 3} more features
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-blue-600 bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default TemplateGrid;