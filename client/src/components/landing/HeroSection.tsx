import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedKeywords from "./AnimatedKeywords"; // Fixed import path

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonAction?: () => void;
  secondaryButtonText?: string;
  secondaryButtonAction?: () => void;
  showAnimatedKeywords?: boolean;
  animatedWords?: string[];
  className?: string;
}

// Loading fallback for keywords
const KeywordsLoadingFallback = () => (
  <span className="text-2xl font-bold text-blue-600 animate-pulse">Smart</span>
);

export default function HeroSection({
  title = "Your Next Job Starts Here",
  subtitle = "Beautiful, {keywords} Resumes in Minutes",
  description = "Build a beautiful, professional resume in minutes with AI-powered guidance and modern design.",
  primaryButtonText = "Get Started Free",
  primaryButtonAction = () => (window.location.href = "/api/login"),
  secondaryButtonText,
  secondaryButtonAction,
  showAnimatedKeywords = true,
  animatedWords = ["Smart", "Professional", "Modern", "AI-Powered"],
  className = ""
}: HeroSectionProps) {
  return (
    <section className={`relative flex flex-col items-center justify-center pt-24 pb-24 text-center z-10 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-4"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 drop-shadow-lg tracking-tight mb-2">
          {title}
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.18, duration: 0.8, ease: "easeOut" }}
        className="mb-4"
      >
        <div className="inline-block text-2xl md:text-4xl font-extrabold leading-tight">
          <span
            className="block drop-shadow-xl animate-textcolor"
            style={{
              color: "#f43f5e",
              animation: "textcolor-x 3.5s ease-in-out infinite",
              textShadow: "0 4px 24px rgba(80,0,180,0.18), 0 1px 0 #fff",
              filter: "brightness(1.15) contrast(1.15)",
            }}
          >
            Beautiful,{' '}
            {showAnimatedKeywords ? (
              <Suspense fallback={<KeywordsLoadingFallback />}>
                <AnimatedKeywords 
                  className="inline" 
                  words={animatedWords}
                />
              </Suspense>
            ) : (
              <span className="text-blue-600">Professional</span>
            )}
            {' '}Resumes in Minutes
          </span>
        </div>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-lg md:text-2xl text-slate-700 mb-10 max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          size="lg"
          onClick={primaryButtonAction}
          className="relative bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-lg px-8 py-3 shadow-xl transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 group"
        >
          {primaryButtonText}
          <span className="inline-block ml-3 align-middle">
            <motion.svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block align-middle"
              initial={{ x: 0 }}
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <path
                d="M7 14h14m0 0l-5-5m5 5l-5 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </span>
        </Button>
        
        {secondaryButtonText && (
          <Button
            size="lg"
            variant="outline"
            onClick={secondaryButtonAction}
            className="text-lg px-8 py-3 border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600"
          >
            {secondaryButtonText}
          </Button>
        )}
      </motion.div>
    </section>
  );
}