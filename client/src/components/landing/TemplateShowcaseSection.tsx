import React, { Suspense } from "react";
import { motion } from "framer-motion";
import TemplateCarousel from "../TemplateCarousel"; // Fixed import path

interface TemplateShowcaseSectionProps {
  title?: string;
  subtitle?: string;
  sectionId?: string;
  className?: string;
  backgroundColor?: string;
}

// Loading fallback for template carousel
const TemplateLoadingFallback = () => (
  <div className="text-center py-12">
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
);

export default function TemplateShowcaseSection({
  title = "Beautiful Templates That Stand Out",
  subtitle = "Choose from our collection of professionally designed, ATS-optimized templates.",
  sectionId = "templates",
  className = "",
  backgroundColor = "bg-white"
}: TemplateShowcaseSectionProps) {
  return (
    <section 
      id={sectionId}
      className={`py-24 ${backgroundColor} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
        
        <Suspense fallback={<TemplateLoadingFallback />}>
          <TemplateCarousel />
        </Suspense>
      </div>
    </section>
  );
}