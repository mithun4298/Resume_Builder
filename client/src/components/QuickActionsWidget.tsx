
import React, { useState, useRef, useEffect } from "react";
import { Plus, FileText, Users, X, Zap } from "lucide-react";

interface QuickActionsWidgetProps {
  onCreateResume: () => void;
  onBrowseTemplates: () => void;
  onAIAssistant: () => void;
}

interface QuickActionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

export default function QuickActionsWidget({
  onCreateResume,
  onBrowseTemplates,
  onAIAssistant
}: QuickActionsWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const quickActions: QuickActionItem[] = [
    {
      icon: <Plus className="w-5 h-5" />,
      title: "Create Resume",
      description: "Start building a new resume from scratch",
      onClick: () => {
        onCreateResume();
        setIsOpen(false);
      },
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Browse Templates",
      description: "Explore our collection of professional templates",
      onClick: () => {
        onBrowseTemplates();
        setIsOpen(false);
      },
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "AI Assistant",
      description: "Get help writing compelling content",
      onClick: () => {
        onAIAssistant();
        setIsOpen(false);
      },
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out
            flex items-center justify-center text-white font-medium
            hover:shadow-xl hover:scale-105 active:scale-95
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
          aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <Zap className="w-6 h-6 transition-transform duration-200" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border
              transform transition-all duration-300 ease-out
              ${isOpen 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-4 scale-95'
              }
            `}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500 mt-1">Choose an action to get started</p>
            </div>

            {/* Actions List */}
            <div className="p-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="w-full p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      text-white transition-all duration-200 group-hover:scale-105
                      ${action.color}
                    `}>
                      {action.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {action.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <p className="text-xs text-gray-500 text-center">
                💡 Tip: Press <kbd className="px-1 py-0.5 bg-white rounded text-xs border">Esc</kbd> to close
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}