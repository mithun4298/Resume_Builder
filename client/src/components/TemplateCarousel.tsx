import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModernTemplate from "./resume-templates/ModernTemplate";
import ClassicTemplate from "./resume-templates/ClassicTemplate";
import MinimalistTemplate from "./resume-templates/MinimalistTemplate";
import ElegantTemplate from "./resume-templates/ElegantTemplate";
import BoldTemplate from "./resume-templates/BoldTemplate";
import { dummyITResumeData } from "./dummyITResumeData";
import styles from "./TemplateCarousel.module.css";

const templates = [
  { key: "modern", name: "Modern", component: ModernTemplate },
  { key: "classic", name: "Classic", component: ClassicTemplate },
  { key: "minimalist", name: "Minimalist", component: MinimalistTemplate },
  { key: "elegant", name: "Elegant", component: ElegantTemplate },
  { key: "bold", name: "Bold", component: BoldTemplate }
];

const VISIBLE_COUNT_DESKTOP = 3;
const VISIBLE_COUNT_MOBILE = 1;
const AUTO_SCROLL_INTERVAL = 2500;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

const TemplateCarousel = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const visibleCount = isMobile ? VISIBLE_COUNT_MOBILE : VISIBLE_COUNT_DESKTOP;
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % templates.length);
      }, AUTO_SCROLL_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const handleSelect = (key: string) => {
    navigate(`/resume-builder?template=${key}`);
  };

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  // For infinite loop effect
  const getVisibleTemplates = () => {
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      const idx = (current + i) % templates.length;
      items.push(templates[idx]);
    }
    return items;
  };

  return (
    <section className={styles.carouselSection} aria-label="Resume Template Carousel">
      <div
        className={styles.carousel}
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Resume template previews"
      >
        {getVisibleTemplates().map((tpl, i) => {
          const TemplateComp = tpl.component;
          // Card width is 210px, A4 width is 794px
          const scale = 210 / 794;
          return (
            <button
              key={tpl.key}
              className={styles.card}
              aria-label={`Preview ${tpl.name} template`}
              onClick={() => handleSelect(tpl.key)}
              tabIndex={0}
            >
              <div className={styles.previewWrapper} style={{ ['--a4-scale' as any]: scale }}>
                <div className={styles.scaledA4Preview}>
                  <TemplateComp resumeData={dummyITResumeData} />
                </div>
              </div>
              <div className={styles.cardLabel}>{tpl.name}</div>
            </button>
          );
        })}
      </div>
      <div className={styles.dots} role="tablist" aria-label="Carousel navigation">
        {templates.map((_, idx) => (
          <button
            key={idx}
            className={current === idx ? styles.dotActive : styles.dot}
            aria-label={`Go to template ${templates[idx].name}`}
            onClick={() => setCurrent(idx)}
            tabIndex={0}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
};

export default TemplateCarousel;
