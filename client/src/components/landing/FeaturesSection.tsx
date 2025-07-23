import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  sectionId?: string;
  className?: string;
  backgroundColor?: string;
  gridCols?: "2" | "3" | "4";
  cardVariant?: "default" | "compact" | "detailed";
}

export default function FeaturesSection({
  title = "Everything You Need to Land Your Dream Job",
  subtitle = "Our AI-powered platform combines cutting-edge technology with beautiful design to create resumes that get results.",
  features,
  sectionId = "features",
  className = "",
  backgroundColor = "bg-white/50",
  gridCols = "4",
  cardVariant = "default"
}: FeaturesSectionProps) {
  const gridClasses = {
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <section id={sectionId} className={`py-24 ${backgroundColor} ${className}`}>
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
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              variant={cardVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}