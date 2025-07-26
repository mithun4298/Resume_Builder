import React from 'react';

interface TemplateWrapperProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export const TemplateWrapper: React.FC<TemplateWrapperProps> = ({
  children,
  accentColor = '#3b82f6',
  className = ''
}) => {
  const style = {
    '--accent-color': accentColor,
  } as React.CSSProperties;

  return (
    <div 
      className={`template-wrapper ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default TemplateWrapper;