import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  index?: number;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  rating = 5,
  avatar,
  index = 0,
  className = "",
  variant = "default"
}: TestimonialCardProps) {
  const variants = {
    default: "bg-white p-6 rounded-xl shadow-lg",
    compact: "bg-white p-4 rounded-lg shadow-md",
    featured: "bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl border border-blue-100"
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`${variants[variant]} transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="h-8 w-8 text-blue-500 opacity-50" />
      </div>

      {/* Rating */}
      {rating && (
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <p className="text-slate-700 mb-6 leading-relaxed italic">
        "{content}"
      </p>

      {/* Author Info */}
      <div className="flex items-center">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-4">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Name and Role */}
        <div>
          <h4 className="font-semibold text-slate-900">{name}</h4>
          <p className="text-sm text-slate-600">
            {role}
            {company && (
              <>
                {" at "}
                <span className="font-medium text-blue-600">{company}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}