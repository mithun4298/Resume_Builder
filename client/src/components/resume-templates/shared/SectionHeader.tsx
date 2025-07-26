import React from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  variant?: 'modern' | 'classic' | 'creative' | 'minimal' | 'executive';
  accentColor?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  variant = 'modern', 
  accentColor,
  className = '' 
}) => {
  const style = accentColor ? { '--accent-color': accentColor } as React.CSSProperties : {};

  return (
    <h3 
      className={`${styles.sectionHeader} ${styles[variant]} ${className}`}
      style={style}
    >
      {title}
    </h3>
  );
};

export default SectionHeader;