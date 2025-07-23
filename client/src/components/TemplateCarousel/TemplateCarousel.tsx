import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ModernTemplate from "../resume-templates/ModernTemplate";
import ClassicTemplate from "../resume-templates/ClassicTemplate";
import MinimalistTemplate from "../resume-templates/MinimalistTemplate";
import ElegantTemplate from "../resume-templates/ElegantTemplate";
import BoldTemplate from "../resume-templates/BoldTemplate";
import TwoColumnTemplate from "../resume-templates/TwoColumnTemplate";
import ExecutiveLuxury from "../resume-templates/ExecutiveLuxury";
import CreativeModern from "../resume-templates/CreativeModern";
import type { ResumeData } from "@shared/schema";

// Import the existing dummy data
import { dummyITResumeData } from "../dummyITResumeData";

const templates = [
  { id: "modern", name: "Modern", component: ModernTemplate },
  { id: "classic", name: "Classic", component: ClassicTemplate },
  { id: "minimalist", name: "Minimalist", component: MinimalistTemplate },
  { id: "elegant", name: "Elegant", component: ElegantTemplate },
  { id: "bold", name: "Bold", component: BoldTemplate },
  { id: "two-column", name: "Two Column", component: TwoColumnTemplate },
  { id: "executive-luxury", name: "Executive Luxury", component: ExecutiveLuxury },
  { id: "creative-modern", name: "Creative Modern", component: CreativeModern },
];

type TemplateCarouselProps = {
  onSelectTemplate?: (templateId: string) => void;
};

// Updated Preview wrapper with proper CSS reset
const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'white',
      overflow: 'hidden',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '794px', // A4 width in pixels
        height: '1123px', // A4 height in pixels
        transformOrigin: 'top left',
        transform: 'scale(0.28)', // Scale to fit the card
        background: 'white',
        overflow: 'hidden',
      }}
      className="template-preview-container"
    >
      <div 
        style={{ 
          width: '100%', 
          height: '100%',
          // Reset all inherited styles to allow template styles to take precedence
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
          textAlign: 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const TemplateCarousel = ({ onSelectTemplate = () => {} }: TemplateCarouselProps) => {
  const [, navigate] = useLocation();
  const [api, setApi] = useState<any>();
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (key: string) => {
    navigate(`/resume-builder?template=${key}`);
    onSelectTemplate(key);
  };

  // Auto-scroll functionality (right to left)
  useEffect(() => {
    if (!api || !isAutoScrolling) return;

    intervalRef.current = setInterval(() => {
      // Check if we're at the end, if so, go to start
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0); // Go back to start for continuous loop
      }
    }, 3000); // 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, isAutoScrolling]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const TemplatePreview: React.FC<{ template: { id: string; name: string; component: React.FC<{ resumeData: ResumeData }> } }> = ({ template }) => {
    const TemplateComponent = template.component;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">{template.name}</h3>
          <PreviewWrapper>
            <TemplateComponent resumeData={dummyITResumeData} />
          </PreviewWrapper>
        </div>
        <button 
          className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition-colors"
          onClick={() => handleSelect(template.id)}
        >
          Select Template
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Add global CSS styles using a style tag */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .template-preview-container * {
            box-sizing: border-box !important;
          }
          .template-preview-container .no-print {
            display: none !important;
          }
        `
      }} />
      
      <section className="w-full max-w-7xl mx-auto py-16 px-4 bg-transparent">
        {/* Carousel Container */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel 
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-3">
              {templates.map((template, index) => (
                <CarouselItem 
                  key={template.id} 
                  className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="flex justify-center">
                    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-400 w-full max-w-56 transition-all duration-300 hover:-translate-y-1 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      {/* Preview Container - A4 aspect ratio */}
                      <div className="w-full aspect-[210/297] p-2 flex items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 group-hover:border-gray-300 transition-colors relative min-h-[120px]">
                        <PreviewWrapper>
                          <template.component resumeData={dummyITResumeData} />
                        </PreviewWrapper>
                      </div>
                      {/* Template Name */}
                      <div className="p-2 text-center">
                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Professional template
                        </p>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      {/* Selection indicator */}
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {/* Select Button */}
                      <button
                        onClick={() => handleSelect(template.id)}
                        className="w-full bg-blue-500 text-white py-1 text-sm hover:bg-blue-600 transition-colors rounded-b-xl"
                      >
                        Select Template
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md">
                View All Templates
              </button>
            </div>
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-600 hover:text-gray-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </CarouselNext>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-600 hover:text-gray-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-7 7 7 7" />
                </svg>
              </span>
            </CarouselPrevious>
          </Carousel>
        </div>
      </section>

    
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            { label: "Templates", value: "10+" },
            { label: "Industries", value: "25+" },
            { label: "ATS Tested", value: "100%" },
            { label: "Customizable", value: "Fully" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
    </>
  );
};

export default TemplateCarousel;
export { TemplateCarousel }; 