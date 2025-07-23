import React from "react";
import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  sectionId?: string;
  className?: string;
  backgroundColor?: string;
  gridCols?: "2" | "3" | "4";
}

export default function StatsSection({
  title = "Trusted by Professionals Worldwide",
  subtitle = "Join thousands of job seekers who have successfully built their careers with our platform.",
  stats,
  sectionId = "stats",
  className = "",
  backgroundColor = "bg-white",
  gridCols = "4"
}: StatsSectionProps) {
  const gridClasses = {
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <section 
      id={sectionId} 
      className={`py-24 ${backgroundColor} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {title && (
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        
        <div className={`grid ${gridClasses[gridCols]} gap-8`}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {stat.icon && (
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
              )}
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-slate-900 mb-2">
                {stat.label}
              </div>
              {stat.description && (
                <p className="text-slate-600">
                  {stat.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}