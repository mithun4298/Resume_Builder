import React, { useState } from 'react';
import { useResumeData } from '@/hooks/useResumeData';
import { cn } from '@/lib/utils';

interface SummarySectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  onNext,
  onPrevious
}) => {
  const { resumeData, updateSummary } = useResumeData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const summaryTemplates = [
    "Experienced [Your Role] with [X] years of expertise in [Your Field]. Proven track record of [Key Achievement]. Skilled in [Key Skills] with a passion for [Your Interest/Goal].",
    "Results-driven [Your Role] specializing in [Your Specialty]. Successfully [Key Achievement] and demonstrated expertise in [Key Skills]. Seeking to leverage [Your Strength] in [Target Role/Industry].",
    "Dynamic [Your Role] with strong background in [Your Field]. Known for [Key Strength] and [Another Strength]. Committed to [Your Goal/Value] and experienced in [Relevant Skills/Technologies]."
  ];

  const handleSummaryChange = (value: string) => {
    console.log('Summary changing to:', value);
    updateSummary(value); // Use the correct method
  };

  const currentSummary = resumeData.summary || '';

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    // Simulate AI generation - replace with actual AI service call
    setTimeout(() => {
      setSuggestions([
        "Experienced software developer with 5+ years of expertise in full-stack development. Proven track record of delivering scalable web applications. Skilled in React, Node.js, and cloud technologies with a passion for creating user-centric solutions.",
        "Results-driven marketing professional specializing in digital campaigns. Successfully increased brand engagement by 150% and demonstrated expertise in social media strategy. Seeking to leverage analytical skills in growth marketing role.",
        "Dynamic project manager with strong background in agile methodologies. Known for cross-functional collaboration and stakeholder management. Committed to delivering projects on time and experienced in team leadership and process optimization."
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleUseSuggestion = (suggestion: string) => {
    handleSummaryChange(suggestion);
    setSuggestions([]);
  };

  const wordCount = currentSummary?.split(/\s+/).filter(word => word.length > 0).length || 0;
  const recommendedWordCount = { min: 20, max: 150 };

  const getWordCountColor = () => {
    if (wordCount < recommendedWordCount.min) return 'text-orange-600';
    if (wordCount > recommendedWordCount.max) return 'text-red-600';
    return 'text-green-600';
  };

  // Check if section is completed
  const isCompleted = currentSummary.trim().length > 0 && wordCount >= recommendedWordCount.min;

  return (
    <div className="summary-section space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
        <p className="text-gray-600">Write a compelling summary that highlights your key strengths</p>
      </div>

      {/* Summary Input */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary *
          </label>
          <textarea
            value={currentSummary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
            placeholder="Write a brief summary of your professional background, key skills, and career objectives. This should be 2-3 sentences that capture your value proposition."
          />
          <p className="text-sm text-gray-500">
            This appears at the top of your resume and is often the first thing employers read.
          </p>
        </div>

        {/* Word Count */}
        <div className="flex justify-between items-center text-sm">
          <span className={cn("font-medium", getWordCountColor())}>
            {wordCount} words
          </span>
          <span className="text-gray-500">
            Recommended: {recommendedWordCount.min}-{recommendedWordCount.max} words
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              wordCount < recommendedWordCount.min ? "bg-orange-500" :
              wordCount > recommendedWordCount.max ? "bg-red-500" : "bg-green-500"
            )}
            style={{
              width: `${Math.min(100, (wordCount / recommendedWordCount.max) * 100)}%`
            }}
          />
        </div>
      </div>

      {/* Completion Status */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-sm font-medium">
            {isCompleted
              ? '✅ Section Complete'
              : `⏳ Add ${recommendedWordCount.min - wordCount} more words to complete`}
          </span>
        </div>
        {!isCompleted && (
          <p className="text-xs text-gray-600 mt-2">
            Minimum {recommendedWordCount.min} words required. You have {wordCount} words.
          </p>
        )}
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110-2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 space-y-3"
              >
                <p className="text-gray-700 text-sm leading-relaxed">{suggestion}</p>
                <button
                  onClick={() => handleUseSuggestion(suggestion)}
                  className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Use This Summary
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Summary Templates</h3>
        <div className="space-y-3">
          {summaryTemplates.map((template, index) => (
            <div
              key={index}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3"
            >
              <p className="text-gray-700 text-sm leading-relaxed">{template}</p>
              <button
                onClick={() => handleUseSuggestion(template)}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Use This Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-green-50 p-4 rounded-xl">
        <h4 className="font-semibold text-green-900 mb-2">✍️ Writing Tips</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Start with your job title and years of experience</li>
          <li>• Highlight your most relevant skills and achievements</li>
          <li>• Use action words and quantify results when possible</li>
          <li>• Tailor your summary to the specific job you're applying for</li>
          <li>• Keep it concise but impactful (2-3 sentences)</li>
          <li>• Avoid using "I" - write in third person</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <button
            onClick={onPrevious}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};
