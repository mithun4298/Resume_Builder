import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ModernTemplate from "./resume-templates/ModernTemplate";
import ClassicTemplate from "./resume-templates/ClassicTemplate";
import MinimalistTemplate from "./resume-templates/MinimalistTemplate";
import ElegantTemplate from "./resume-templates/ElegantTemplate";
import BoldTemplate from "./resume-templates/BoldTemplate";
import TwoColumnTemplate from "./resume-templates/TwoColumnTemplate";

// Dummy data for preview
const dummyITResumeData: {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    bullets: string[];
  }[];
  skills: {
    technical: string[];
    soft: string[];
  };
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    url: string;
  }[];
  sectionOrder: (
    | "personal"
    | "summary"
    | "experience"
    | "skills"
    | "education"
    | "projects"
    | "certifications"
  )[];
} = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.dev"
  },
  summary: "Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      bullets: [
        "Led development of microservices architecture serving 1M+ users",
        "Improved application performance by 40% through optimization",
        "Mentored 3 junior developers and conducted code reviews"
      ]
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      startDate: "2020-06",
      endDate: "2021-12",
      current: false,
      bullets: [
        "Built responsive web applications using React and TypeScript",
        "Implemented CI/CD pipelines reducing deployment time by 60%"
      ]
    }
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker"],
    soft: ["Leadership", "Problem Solving", "Communication", "Team Collaboration"]
  },
  education: [
    {
      institution: "University of California",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
      gpa: "3.8"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      url: "https://github.com/johndoe/ecommerce"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-03",
      url: "https://aws.amazon.com/certification/"
    }
  ],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "skills",
    "education",
    "projects",
    "certifications"
  ],
};

const templates = [
  { id: "modern", name: "Modern", component: ModernTemplate },
  { id: "classic", name: "Classic", component: ClassicTemplate },
  { id: "minimalist", name: "Minimalist", component: MinimalistTemplate },
  { id: "elegant", name: "Elegant", component: ElegantTemplate },
  { id: "bold", name: "Bold", component: BoldTemplate },
  { id: "two-column", name: "Two Column", component: TwoColumnTemplate },
];

type TemplateCarouselProps = {
  onSelectTemplate?: (templateId: string) => void;
};

const TemplateCarousel = ({ onSelectTemplate = () => {} }: TemplateCarouselProps) => {
  const navigate = useNavigate();
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

  // Preview wrapper: Properly constrain and scale the resume templates
  const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        width: '100%',
        height: '110%',
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
      >
        {children}
      </div>
    </div>
  );

  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-4 bg-transparent">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Choose Your Perfect Resume Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional templates designed to get you hired faster
        </p>
      </div>

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
                  <button
                    onClick={() => handleSelect(template.id)}
                    className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-400 w-full max-w-72 transition-all duration-300 hover:-translate-y-2 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {/* Preview Container - A4 aspect ratio */}
                    <div className="w-full aspect-[270/297] p-3 flex items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 group-hover:border-gray-300 transition-colors relative">
                      <div className="w-full h-full max-w-[220px] max-h-[310px] mx-auto">
                        <PreviewWrapper>
                          <template.component resumeData={dummyITResumeData} />
                        </PreviewWrapper>
                      </div>
                      
                      {/* Subtle overlay for better visual hierarchy */}
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none" /> */}
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
                    <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Buttons */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/95 hover:bg-white border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/95 hover:bg-white border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12" />
        </Carousel>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {templates.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>    
      
      {/* Download Button */} 
      <div className="mt-8 text-center">
        <button 
          onClick={() => handleSelect(templates[0].id)} 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Download Selected Template
        </button>
      </div>
    </section>
  );
};

export default TemplateCarousel;