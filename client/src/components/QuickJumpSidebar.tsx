
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface QuickJumpSidebarProps {
  steps: Array<{
    key: string;
    label: string;
    icon: string;
  }>;
  currentStep: string;
  onStepClick: (step: string) => void;
  completedSteps: string[];
}

export default function QuickJumpSidebar({
  steps,
  currentStep,
  onStepClick,
  completedSteps
}: QuickJumpSidebarProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-64 max-h-[80vh] overflow-y-auto backdrop-blur-sm bg-white/95">
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Navigation</h4>
        
        {/* Progress Summary */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">{completedSteps.length}/{steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = completedSteps.includes(step.key);

          return (
            <button
              key={step.key}
              onClick={() => onStepClick(step.key)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 group",
                isActive && "bg-blue-50 border border-blue-200 shadow-sm",
                !isActive && "hover:bg-gray-50 border border-transparent"
              )}
            >
              {/* Step Number/Status */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                isActive && "bg-blue-600 text-white scale-110",
                isCompleted && !isActive && "bg-green-500 text-white",
                !isActive && !isCompleted && "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
              )}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm">{step.icon}</span>
                  <span className={cn(
                    "text-sm font-medium truncate",
                    isActive && "text-blue-700",
                    isCompleted && !isActive && "text-green-700",
                    !isActive && !isCompleted && "text-gray-900"
                  )}>
                    {step.label}
                  </span>
                </div>
                <div className={cn(
                  "text-xs transition-colors duration-200",
                  isActive && "text-blue-600",
                  isCompleted && !isActive && "text-green-600",
                  !isActive && !isCompleted && "text-gray-500"
                )}>
                  {isActive && "Current"}
                  {isCompleted && !isActive && "✓ Done"}
                  {!isActive && !isCompleted && "Pending"}
                </div>
              </div>

              {/* Action Indicator */}
              <div className="flex-shrink-0">
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                )}
                {isCompleted && !isActive && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {!isCompleted && !isActive && (
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Click any step to jump there
        </div>
      </div>
    </div>
  );
}