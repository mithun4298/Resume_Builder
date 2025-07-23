import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { dummyITResumeData } from "../dummyITResumeData";

type TemplateCarouselProps = {
  onSelectTemplate?: (templateId: string) => void;
};

// Mock templates data - you should replace this with your actual templates
const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    component: ({ resumeData }: { resumeData: any }) => (
      <div className="bg-white p-4 text-xs h-full overflow-hidden">
        <div className="border-b-2 border-gray-200 pb-2 mb-3">
          <h1 className="font-bold text-sm text-gray-900">{resumeData.personalInfo?.name || "John Doe"}</h1>
          <p className="text-gray-600 text-xs">{resumeData.personalInfo?.title || "Software Engineer"}</p>
          <p className="text-gray-500 text-xs mt-1">john.doe@email.com | (555) 123-4567</p>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-xs text-gray-800 mb-1">EXPERIENCE</h3>
            <div className="space-y-1">
              <div>
                <p className="font-medium text-gray-900 text-xs">Senior Developer</p>
                <p className="text-gray-600 text-xs">Tech Corp • 2020 - Present</p>
                <p className="text-gray-700 text-xs mt-1">Led development of web applications using React and Node.js</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-xs">Full Stack Developer</p>
                <p className="text-gray-600 text-xs">StartupCo • 2018 - 2020</p>
                <p className="text-gray-700 text-xs mt-1">Built scalable web applications and APIs</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-xs text-gray-800 mb-1">SKILLS</h3>
            <div className="flex flex-wrap gap-1">
              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">React</span>
              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">TypeScript</span>
              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">Node.js</span>
              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">Python</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-xs text-gray-800 mb-1">EDUCATION</h3>
            <div>
              <p className="font-medium text-gray-900 text-xs">Computer Science, BS</p>
              <p className="text-gray-600 text-xs">University of Technology • 2018</p>
              <p className="text-gray-500 text-xs">GPA: 3.8/4.0</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "classic",
    name: "Classic",
    component: ({ resumeData }: { resumeData: any }) => (
      <div className="bg-white p-4 text-xs h-full overflow-hidden">
        <div className="text-center border-b-2 border-gray-300 pb-3 mb-3">
          <h1 className="font-bold text-sm text-gray-900">{resumeData.personalInfo?.name || "Jane Smith"}</h1>
          <p className="text-gray-600 text-xs">{resumeData.personalInfo?.title || "Product Manager"}</p>
          <p className="text-gray-500 text-xs mt-1">jane.smith@email.com | (555) 987-6543 | LinkedIn: /in/janesmith</p>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-xs text-gray-800 mb-1 uppercase tracking-wide">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed text-xs">Experienced product manager with 5+ years of experience in driving product strategy and cross-functional team leadership.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xs text-gray-800 mb-1 uppercase tracking-wide">Experience</h3>
            <div className="space-y-1">
              <div>
                <p className="font-medium text-gray-900 text-xs">Senior Product Manager</p>
                <p className="text-gray-600 text-xs">Innovation Labs | 2021 - Present</p>
                <p className="text-gray-700 text-xs">Led product development for mobile applications</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-xs">Product Manager</p>
                <p className="text-gray-600 text-xs">TechStart | 2019 - 2021</p>
                <p className="text-gray-700 text-xs">Managed product roadmap and user research</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-xs text-gray-800 mb-1 uppercase tracking-wide">Education</h3>
            <div>
              <p className="font-medium text-gray-900 text-xs">MBA, Business Administration</p>
              <p className="text-gray-600 text-xs">Business School | 2019</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "creative",
    name: "Creative",
    component: ({ resumeData }: { resumeData: any }) => (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 text-xs h-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg mb-3 shadow-lg">
          <h1 className="font-bold text-sm">{resumeData.personalInfo?.name || "Alex Johnson"}</h1>
          <p className="text-blue-100 text-xs">{resumeData.personalInfo?.title || "UI/UX Designer"}</p>
          <p className="text-blue-200 text-xs mt-1">alex.johnson@email.com | Portfolio: alexdesigns.com</p>
        </div>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <h3 className="font-semibold text-xs text-blue-600 mb-1 flex items-center">
              <span className="w-1 h-1 bg-blue-600 rounded-full mr-1"></span>
              PORTFOLIO HIGHLIGHTS
            </h3>
            <p className="text-gray-700 text-xs">Creative designs and user experiences for mobile and web applications with focus on user-centered design.</p>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <h3 className="font-semibold text-xs text-purple-600 mb-1 flex items-center">
              <span className="w-1 h-1 bg-purple-600 rounded-full mr-1"></span>
              DESIGN TOOLS
            </h3>
            <div className="flex flex-wrap gap-1">
              <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">Figma</span>
              <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">Adobe XD</span>
              <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">Sketch</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <h3 className="font-semibold text-xs text-blue-600 mb-1 flex items-center">
              <span className="w-1 h-1 bg-blue-600 rounded-full mr-1"></span>
              EXPERIENCE
            </h3>
            <div className="space-y-1">
              <div>
                <p className="font-medium text-gray-900 text-xs">Senior UX Designer</p>
                <p className="text-gray-600 text-xs">Creative Agency | 2020 - Present</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-xs">UI Designer</p>
                <p className="text-gray-600 text-xs">Design Studio | 2018 - 2020</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <h3 className="font-semibold text-xs text-purple-600 mb-1 flex items-center">
              <span className="w-1 h-1 bg-purple-600 rounded-full mr-1"></span>
              EDUCATION
            </h3>
            <p className="font-medium text-gray-900 text-xs">Design, BFA</p>
            <p className="text-gray-600 text-xs">Art Institute | 2018</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "minimal",
    name: "Minimal",
    component: ({ resumeData }: { resumeData: any }) => (
      <div className="bg-white p-4 text-xs h-full overflow-hidden">
        <div className="mb-4">
          <h1 className="font-light text-sm text-gray-900 mb-1">{resumeData.personalInfo?.name || "Sam Wilson"}</h1>
          <p className="text-gray-500 text-xs mb-1">{resumeData.personalInfo?.title || "Data Scientist"}</p>
          <p className="text-gray-400 text-xs">sam.wilson@email.com | (555) 456-7890</p>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-xs text-gray-900 mb-1 uppercase tracking-widest">EXPERIENCE</h3>
            <div className="h-px bg-gray-200 mb-2"></div>
            <div className="space-y-1">
              <div>
                <p className="font-medium text-gray-900 text-xs">Lead Data Scientist</p>
                <p className="text-gray-600 text-xs">Data Corp • 2021 - Present</p>
                <p className="text-gray-700 text-xs">Advanced analytics and machine learning model development</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-xs text-gray-900 mb-1 uppercase tracking-widest">SKILLS</h3>
            <div className="h-px bg-gray-200 mb-2"></div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-700">Python</span>
              <span className="text-gray-700">Machine Learning</span>
              <span className="text-gray-700">SQL</span>
              <span className="text-gray-700">TensorFlow</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-xs text-gray-900 mb-1 uppercase tracking-widest">EDUCATION</h3>
            <div className="h-px bg-gray-200 mb-2"></div>
            <div>
              <p className="font-medium text-gray-900 text-xs">MS Data Science</p>
              <p className="text-gray-600 text-xs">Tech University • 2020</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

// Improved PreviewWrapper that fills the entire card
const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'white',
      overflow: 'hidden',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="template-preview-container"
    >
      {children}
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
          .template-preview-container {
            font-size: 12px !important;
            line-height: 1.4 !important;
          }
          .template-preview-container h1,
          .template-preview-container h2,
          .template-preview-container h3 {
            font-size: 14px !important;
            margin: 4px 0 !important;
          }
          .template-preview-container p {
            font-size: 10px !important;
            margin: 2px 0 !important;
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
                    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-400 w-full max-w-64 transition-all duration-300 hover:-translate-y-1 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      {/* Preview Container - Improved aspect ratio and sizing */}
                      <div className="w-full h-80 p-3 flex items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 group-hover:border-gray-300 transition-colors relative">
                        <PreviewWrapper>
                          <template.component resumeData={dummyITResumeData} />
                        </PreviewWrapper>
                      </div>
                      {/* Template Name */}
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Professional template
                        </p>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      {/* Selection indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {/* Select Button */}
                      <button
                        onClick={() => handleSelect(template.id)}
                        className="w-full bg-blue-500 text-white py-3 text-base font-medium hover:bg-blue-600 transition-colors rounded-b-xl"
                      >
                        Select Template
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center mt-8">
              <button className="bg-blue-500 text-white px-6 py-2 text-base rounded-lg hover:bg-blue-600 transition-colors">
                View All Templates
              </button>
            </div>
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg">
              <span className="text-gray-600 hover:text-gray-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </CarouselNext>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg">
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