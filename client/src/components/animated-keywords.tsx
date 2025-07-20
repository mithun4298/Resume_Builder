import React, { useEffect, useState } from "react";

interface AnimatedKeywordsProps {
  className?: string;
  words?: string[];
}

const defaultWords = [
  "AI",
  "Assistance",
  "Beautiful",
  "Modern",
  "Effortless",
  "Smart",
  "Fast",
  "Creative"
];

export default function AnimatedKeywords({ className = "", words }: AnimatedKeywordsProps) {
  const keywords = words && words.length > 0 ? words : defaultWords;
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setFade(false), 1800);
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % keywords.length);
        setFade(false);
      }, 300);
    }, 2200);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [keywords]);

  return (
    <span
      className={`inline-block transition-all duration-300 ease-in-out ${fade ? 'opacity-100 scale-105' : 'opacity-0 scale-95'} text-primary ${className}`}
      aria-live="polite"
    >
      {keywords[index]}
    </span>
  );
}
