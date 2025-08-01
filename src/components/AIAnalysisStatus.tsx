'use client';

import { JournalEntry } from '@/features/journal/types/journal.types';

interface AIAnalysisStatusProps {
  entry: JournalEntry;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export function AIAnalysisStatus({ 
  entry, 
  size = 'md', 
  showText = false,
  onAnalyze,
  isAnalyzing = false
}: AIAnalysisStatusProps) {
  const hasAnalysis = !!entry.aiAnalysis;
  
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
  };

  const iconSize = sizeClasses[size];

  if (isAnalyzing) {
    return (
      <div className={`flex items-center space-x-1 ${showText ? '' : 'justify-center'}`}>
        <div className={`${iconSize} animate-spin`}>
          <svg className="w-full h-full text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        {showText && (
          <span className="text-xs text-blue-600">Analyzing...</span>
        )}
      </div>
    );
  }

  if (hasAnalysis) {
    return (
      <div className={`flex items-center space-x-1 ${showText ? '' : 'justify-center'}`}>
        <div className={`${iconSize} text-green-500`} title="AI Analysis Complete">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        {showText && (
          <span className="text-xs text-green-600">Analyzed</span>
        )}
      </div>
    );
  }

  // No analysis
  return (
    <div className={`flex items-center space-x-1 ${showText ? '' : 'justify-center'}`}>
      {onAnalyze ? (
        <button
          onClick={onAnalyze}
          className={`${iconSize} text-gray-400 hover:text-blue-500 transition-colors cursor-pointer`}
          title="Click to analyze with AI"
        >
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      ) : (
        <div className={`${iconSize} text-gray-400`} title="No AI Analysis">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}
      {showText && (
        <span className="text-xs text-gray-500">
          {onAnalyze ? 'Click to analyze' : 'Not analyzed'}
        </span>
      )}
    </div>
  );
}
