import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  backgroundGradient?: string;
  textColor?: string;
  buttonVariant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function CTASection({
  title = "Ready to Build Your Perfect Resume?",
  description = "Join thousands of job seekers who have successfully landed their dream jobs with our AI-powered resume builder.",
  buttonText = "Start Building Now",
  onButtonClick = () => (window.location.href = "/api/login"),
  backgroundGradient = "bg-gradient-to-r from-blue-600 to-indigo-600",
  textColor = "text-white",
  buttonVariant = "secondary",
  className = ""
}: CTASectionProps) {
  const buttonClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white",
    secondary: "bg-white text-blue-600 hover:bg-gray-100",
    outline: "border-2 border-white text-white hover:bg-white hover:text-blue-600"
  };

  return (
    <section className={`py-24 ${backgroundGradient} ${className}`}>
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl md:text-5xl font-bold ${textColor} mb-6`}>
            {title}
          </h2>
          <p className={`text-xl ${textColor === 'text-white' ? 'text-blue-100' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
            {description}
          </p>
          <Button
            size="lg"
            onClick={onButtonClick}
            className={`${buttonClasses[buttonVariant]} text-lg px-8 py-3 shadow-xl transition-transform duration-200 hover:scale-105`}
          >
            {buttonText}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}