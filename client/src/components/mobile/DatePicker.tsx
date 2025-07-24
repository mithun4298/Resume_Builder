import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  minDate?: string;
  maxDate?: string;
  allowFuture?: boolean;
  showCurrentOption?: boolean;
  currentLabel?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  required = false,
  error,
  helpText,
  minDate,
  maxDate,
  allowFuture = true,
  showCurrentOption = false,
  currentLabel = "Present"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isCurrent, setIsCurrent] = useState(value === 'current');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i + (allowFuture ? 10 : 0));

  useEffect(() => {
    if (value && value !== 'current') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedMonth(date.getMonth());
        setSelectedYear(date.getFullYear());
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDisplayValue = (dateValue: string) => {
    if (dateValue === 'current') return currentLabel;
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleDateSelect = () => {
    if (isCurrent) {
      onChange('current');
    } else {
      const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
      onChange(dateString);
    }
    setIsOpen(false);
  };

  const handleCurrentToggle = () => {
    setIsCurrent(!isCurrent);
    if (!isCurrent) {
      onChange('current');
      setIsOpen(false);
    }
  };

  const isDateValid = () => {
    if (isCurrent) return true;
    const selectedDate = new Date(selectedYear, selectedMonth, 1);
    const now = new Date();
    if (minDate && selectedDate < new Date(minDate)) return false;
    if (maxDate && selectedDate > new Date(maxDate)) return false;
    if (!allowFuture && selectedDate > now) return false;
    return true;
  };

  return (
    <div className="date-picker space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Date Input Button */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-3 text-left border-2 rounded-xl transition-all duration-200",
            "flex items-center justify-between",
            error
              ? "border-red-300 bg-red-50"
              : isOpen
              ? "border-blue-500 bg-white"
              : "border-gray-200 bg-gray-50",
            "focus:outline-none focus:ring-0"
          )}
        >
          <span className={cn(
            "text-base",
            value ? "text-gray-900" : "text-gray-400"
          )}>
            {formatDisplayValue(value) || placeholder}
          </span>
          <svg 
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Current Option */}
            {showCurrentOption && (
              <div className="p-4 border-b border-gray-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={handleCurrentToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {currentLabel}
                  </span>
                </label>
              </div>
            )}

            {/* Date Selectors */}
            {!isCurrent && (
              <div className="p-4 space-y-4">
                {/* Month Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDateSelect}
                    disabled={!isDateValid()}
                    className={cn(
                      "flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                      isDateValid()
                        ? "text-white bg-blue-600 hover:bg-blue-700"
                        : "text-gray-400 bg-gray-200 cursor-not-allowed"
                    )}
                  >
                    Select
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          {isCurrent
            ? "Current date is selected."
            : `Selected date: ${months[selectedMonth]} ${selectedYear}`}
        </div>
      </div>  
      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>} 
      <div className="mt-2 text-xs text-gray-500">
        {helpText}
      </div>

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        {helpText}
      </div>
    </div>
  );
};
