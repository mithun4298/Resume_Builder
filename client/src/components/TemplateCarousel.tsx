import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  preview: string;
  features: string[];
  popular?: boolean;
  new?: boolean;
}

interface TemplateCarouselProps {
  templates?: Template[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function TemplateCarousel({
  templates = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ""
}: TemplateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (templates && templates.length > 0 && currentIndex >= templates.length) {
      setCurrentIndex(0);
    }
  }, [templates, currentIndex]);

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

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Template Preview */}
          <div className="relative bg-gray-50 flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-sm"
              >
                <img
                  src={currentTemplate.preview}
                  alt={`${currentTemplate.name} Preview`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                {/* Overlay with action buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 
                  transition-all duration-300 rounded-lg flex 
                  items-center justify-center opacity-0 hover:opacity-100"
                >
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
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
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                    {currentTemplate.category}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {currentTemplate.name}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {currentTemplate.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplate.features?.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    Use This Template
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
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