import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ActionSheetAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'primary';
  disabled?: boolean;
  onClick: () => void;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actions: ActionSheetAction[];
  cancelLabel?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  actions,
  cancelLabel = "Cancel"
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      const focusableElements = sheetRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const getActionVariantStyles = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-red-600 hover:bg-red-50';
      case 'primary':
        return 'text-blue-600 hover:bg-blue-50 font-semibold';
      default:
        return 'text-gray-900 hover:bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        className={`w-full max-w-md bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b border-gray-200">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="py-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              disabled={action.disabled}
              className={`w-full px-6 py-4 text-left flex items-center space-x-3 transition-colors duration-200 ${
                action.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : getActionVariantStyles(action.variant)
              }`}
            >
              {action.icon && (
                <div className="w-5 h-5 flex-shrink-0">
                  {action.icon}
                </div>
              )}
              <span className="flex-grow text-base">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 text-center text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-b-3xl"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};