import React from 'react';
import { cn } from '@/lib/utils';
import { SectionKey } from '@/types/resume';

interface MobileNavigationProps {
  currentSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  completedSections: Set<SectionKey>;
}

const sections = [
  { key: 'personal' as SectionKey, label: 'Personal', icon: '👤' },
  { key: 'summary' as SectionKey, label: 'Summary', icon: '📝' },
  { key: 'experience' as SectionKey, label: 'Work', icon: '💼' },
  { key: 'education' as SectionKey, label: 'Education', icon: '🎓' },
  { key: 'skills' as SectionKey, label: 'Skills', icon: '⚡' },
  { key: 'projects' as SectionKey, label: 'Projects', icon: '🚀' },
  { key: 'certifications' as SectionKey, label: 'Certs', icon: '🏆' },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentSection,
  onSectionChange,
  completedSections
}) => {
  return (
    <nav className="mobile-navigation">
      {/* Top Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {completedSections.size} of {sections.length} completed
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((completedSections.size / sections.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-1 px-4 py-2 min-w-max">
          {sections.map((section) => {
            const isActive = currentSection === section.key;
            const isCompleted = completedSections.has(section.key);
            
            return (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={cn(
                  "flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200",
                  "min-w-[64px] text-xs font-medium whitespace-nowrap",
                  
                  // Active state
                  isActive && "bg-blue-100 text-blue-700",
                  
                  // Completed state
                  isCompleted && !isActive && "bg-green-50 text-green-700",
                  
                  // Default state
                  !isActive && !isCompleted && "text-gray-600 hover:bg-gray-50"
                )}
              >
                <span className="text-lg mb-1">
                  {isCompleted ? '✅' : section.icon}
                </span>
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};