import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedKeywordsProps {
  words: string[];
  className?: string;
  interval?: number;
  animationDuration?: number;
}

export default function AnimatedKeywords({
  words,
  className = "",
  interval = 2000,
  animationDuration = 0.5
}: AnimatedKeywordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  if (words.length === 0) {
    return <span className={className}>Smart</span>;
  }

  if (words.length === 1) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: animationDuration }}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}