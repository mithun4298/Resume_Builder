import React from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  sectionId?: string;
  className?: string;
  gridCols?: "1" | "2" | "3";
  backgroundColor?: string;
  showAllTestimonials?: boolean;
  maxTestimonials?: number;
}

export default function TestimonialsSection({
  title = "What Our Users Say",
  subtitle = "Join thousands of professionals who have successfully landed their dream jobs using our platform.",
  testimonials,
  sectionId = "testimonials",
  className = "",
  gridCols = "3",
  backgroundColor = "bg-gray-50",
  showAllTestimonials = false,
  maxTestimonials = 6
}: TestimonialsSectionProps) {
  const gridClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  };

  const displayedTestimonials = showAllTestimonials 
    ? testimonials 
    : testimonials.slice(0, maxTestimonials);

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
        
        <div className={`grid ${gridClasses[gridCols]} gap-8`}>
          {displayedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              rating={testimonial.rating}
              avatar={testimonial.avatar}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}