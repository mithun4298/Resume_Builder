import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  onClick?: () => void;
}

export default function FeatureCard({
  icon,
  title,
  description,
  index = 0,
  className = "",
  variant = "default",
  onClick
}: FeatureCardProps) {
  const variants = {
    default: "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl",
    compact: "bg-white p-4 rounded-lg shadow-md hover:shadow-lg",
    detailed: "bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100"
  };

  const iconSizes = {
    default: "mb-4",
    compact: "mb-3",
    detailed: "mb-6"
  };

  const titleSizes = {
    default: "text-xl font-semibold text-slate-900 mb-2",
    compact: "text-lg font-semibold text-slate-900 mb-2",
    detailed: "text-2xl font-bold text-slate-900 mb-3"
  };

  const descriptionSizes = {
    default: "text-slate-600",
    compact: "text-sm text-slate-600",
    detailed: "text-lg text-slate-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`${variants[variant]} transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className={iconSizes[variant]}>{icon}</div>
      <h3 className={titleSizes[variant]}>{title}</h3>
      <p className={descriptionSizes[variant]}>{description}</p>
    </motion.div>
  );
}