import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Download, Star, Check } from "lucide-react";
import { useLocation } from "wouter"; // ADD THIS IMPORT
import { TEMPLATE_CONFIGS, TemplateConfig } from "@/data/templateData";
import { TEMPLATE_REGISTRY } from "@/components/resume-templates";

interface TemplateCarouselProps {
  templates?: TemplateConfig[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  onTemplateSelect?: (templateId: string) => void;
  onPreviewTemplate?: (templateId: string) => void;
  selectedTemplate?: string;
  showActions?: boolean;
}

export default function TemplateCarousel({
  templates = TEMPLATE_CONFIGS,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
  onTemplateSelect,
  onPreviewTemplate,
  selectedTemplate,
  showActions = true
}: TemplateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, navigate] = useLocation(); // ADD THIS HOOK

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !templates || templates.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % templates.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, templates?.length]);

  const goToPrevious = () => {
    if (!templates || templates.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const goToNext = () => {
    if (!templates || templates.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  };

  const goToSlide = (index: number) => {
    if (!templates || templates.length === 0) return;
    setCurrentIndex(index);
  };

  // UPDATE THIS FUNCTION TO INCLUDE NAVIGATION
  const handleTemplateSelect = (templateId: string) => {
    console.log('Navigating to resume builder with template:', templateId);

    // Call the callback if provided
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }

    // Navigate to resume builder with template parameter
    navigate(`/resume-builder?template=${templateId}`);
  };

  // ADD THIS FUNCTION FOR PREVIEW
  const handlePreviewTemplate = (templateId: string) => {
    console.log('Preview clicked for template:', templateId);

    if (onPreviewTemplate) {
      onPreviewTemplate(templateId);
    } else {
      // Default preview behavior - could open in modal or navigate to preview page
      navigate(`/resume-builder?template=${templateId}&preview=true`);
    }
  };

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (templates && templates.length > 0 && currentIndex >= templates.length) {
      setCurrentIndex(0);
    }
  }, [templates, currentIndex]);

  const renderTemplatePreview = (config: TemplateConfig) => {
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
        firstName: 'Mithun',
        lastName: 'Kumar',
        title: 'Product Manager',
        email: 'mithun.kumar@email.com',
        phone: '(555) 987-6543',
        location: 'New York, NY',
        website: 'mithunkumar.com'
      },
      summary: 'Results-driven product manager with 7+ years of experience leading cross-functional teams and delivering innovative solutions.',
      experience: [
        {
          id: '1',
          title: 'Senior Product Manager',
          company: 'Innovation Labs',
          startDate: '2021',
          endDate: 'Present',
          current: true,
          location: 'New York, NY',
          description: 'Lead product strategy and development for B2B SaaS platform',
          bullets: [
            'Increased user engagement by 45% through data-driven feature development',
            'Managed product roadmap for $10M+ revenue product line'
          ],
          dates: '2021 - Present'
        }
      ],
      skills: {
        technical: ['Product Strategy', 'Data Analysis', 'Agile/Scrum', 'SQL'],
        soft: ['Leadership', 'Strategic Thinking', 'Communication', 'Problem Solving']
      },
      education: [
        {
          id: '1',
          degree: 'MBA, Business Administration',
          school: 'Business School',
          startDate: '2016',
          endDate: '2018',
          dates: '2016 - 2018'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'Customer Analytics Platform',
          title: 'Lead Developer',
          description: 'Led development of analytics platform serving 50k+ users',
          technologies: ['Product Strategy', 'User Research', 'Analytics'],
          url: 'https://company.com/analytics'
        }
      ]
    };

    return (
      <div className="w-full h-full flex flex-col items-center justify-center overflow-auto">
        <div className="bg-white shadow-sm rounded-lg max-w-full max-h-[90vh] flex items-center justify-center">
          <div className="w-[210mm] h-[297mm] mx-auto">
            <TemplateComponent data={sampleData} accentColor={config.accentColor} />
          </div>
        </div>
      </div>
    );
  };

  if (!templates || templates.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <p className="text-gray-500">No templates available</p>
      </div>
    );
  }

  const currentTemplate = templates[currentIndex];

  if (!currentTemplate) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <p className="text-gray-500">Template not found</p>
      </div>
    );
  }

  const isSelected = selectedTemplate === currentTemplate.id;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-y-auto">
          {/* Template Preview */}
          <div className="relative bg-gray-50 flex flex-col items-center justify-center p-8 min-h-[90vh]">
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-4 left-4 z-10">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            {/* Recommended badge */}
            {currentTemplate.recommended && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Recommended
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-sm"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {renderTemplatePreview(currentTemplate)}
                </div>
                
                {/* Overlay with action buttons */}
                {showActions && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 
                    transition-all duration-300 rounded-lg flex 
                    items-center justify-center opacity-0 hover:opacity-100"
                  >
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handlePreviewTemplate(currentTemplate.id)} // UPDATE THIS
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleTemplateSelect(currentTemplate.id)} // THIS IS CORRECT
                        className={isSelected ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Use Template
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Template Info */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span 
                      className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                      style={{ 
                        backgroundColor: currentTemplate.accentColor + '20', 
                        color: currentTemplate.accentColor 
                      }}
                    >
                      {currentTemplate.category}
                    </span>
                    {currentTemplate.recommended && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                              <Star className="w-3 h-3" />
                        Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {currentTemplate.name}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {currentTemplate.description}
                  </p>
                </div>

                {/* Suitable For */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Perfect for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplate.suitableFor.map((role, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                  <div className="space-y-2">
                    {currentTemplate.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {showActions && (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => handleTemplateSelect(currentTemplate.id)} // UPDATE THIS
                      variant={isSelected ? 'default' : 'secondary'}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Use Template
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handlePreviewTemplate(currentTemplate.id)} // UPDATE THIS
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation arrows */}
        {templates.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 
                bg-white bg-opacity-80 hover:bg-opacity-100 
                rounded-full p-2 shadow-md transition-all duration-200
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous template"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
                bg-white bg-opacity-80 hover:bg-opacity-100 
                rounded-full p-2 shadow-md transition-all duration-200
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next template"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {templates.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                index === currentIndex
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to template ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}  