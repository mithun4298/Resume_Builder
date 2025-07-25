import React from 'react';
// Removed self-import of TouchFormField to fix duplicate declaration error
import { useResumeData } from '@/hooks/useResumeData';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
// Removed PersonalInfoEditor from this file to avoid duplicate TouchFormField usage and declaration

interface TouchFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  icon?: React.ReactNode;
  helpText?: string;
  error?: string;
}

export const TouchFormField: React.FC<TouchFormFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  multiline = false,
  rows = 3,
  maxLength,
  suggestions = [],
  onSuggestionSelect,
  icon,
  helpText,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
  );

  useEffect(() => {
    setShowSuggestions(isFocused && filteredSuggestions.length > 0);
  }, [isFocused, filteredSuggestions.length]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const InputComponent = multiline || type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="touch-form-field space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <div
          className={`relative flex items-center border-2 rounded-xl transition-all duration-200 ${
            error
              ? 'border-red-300 bg-red-50'
              : isFocused
              ? 'border-blue-500 bg-white'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 text-gray-400">
              {icon}
            </div>
          )}

          {/* Input/Textarea */}
          <InputComponent
            ref={inputRef as any}
            type={multiline ? undefined : type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow suggestion clicks
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            maxLength={maxLength}
            className={cn(
              "w-full bg-transparent border-0 outline-none resize-none",
              "px-4 py-3 text-base",
              icon ? "pl-10" : "",
              multiline ? "min-h-[80px]" : "h-12",
              "placeholder:text-gray-400",
              "focus:ring-0"
            )}
          />

          {/* Character Count */}
          {maxLength && (
            <div className="absolute right-3 bottom-2 text-xs text-gray-400">
              {value.length}/{maxLength}
            </div>
          )}

          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="text-gray-900">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Help Text */}
        {helpText && (
          <p className="mt-2 text-sm text-gray-500 flex items-start space-x-1">
            <svg className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{helpText}</span>
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-start space-x-1">
            <svg className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
};