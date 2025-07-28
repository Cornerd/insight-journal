/**
 * AI Debug Panel Component
 * Shows current AI analysis state for debugging
 */

'use client';

import React from 'react';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { useJournalStore } from '@/shared/store/journalStore';

export function AIDebugPanel() {
  const {
    isLoading: isAnalyzing,
    error: analysisError,
    errorType: analysisErrorType,
    analysis,
  } = useAIAnalysis();

  const { currentEntry } = useJournalStore();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔍 AI Debug Panel</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Current Entry:</strong> {currentEntry?.id || 'None'}
        </div>
        
        <div>
          <strong>Is Analyzing:</strong> {isAnalyzing ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Analysis Error:</strong> {analysisError || 'None'}
        </div>
        
        <div>
          <strong>Error Type:</strong> {analysisErrorType || 'None'}
        </div>
        
        <div>
          <strong>Analysis State:</strong> {analysis ? '✅ Has Analysis' : '❌ No Analysis'}
        </div>
        
        {analysis && (
          <div className="mt-2 p-2 bg-gray-800 rounded">
            <div><strong>Summary:</strong> {analysis.summary ? '✅' : '❌'}</div>
            <div><strong>Emotions:</strong> {analysis.emotions?.length || 0}</div>
            <div><strong>Suggestions:</strong> {analysis.suggestions?.length || 0}</div>
            <div><strong>Model:</strong> {analysis.model}</div>
            <div><strong>Type:</strong> {analysis.type}</div>
          </div>
        )}
        
        {currentEntry?.aiAnalysis && (
          <div className="mt-2 p-2 bg-green-800 rounded">
            <div><strong>Cached Analysis:</strong> ✅ Available</div>
            <div><strong>Cached Type:</strong> {currentEntry.aiAnalysis.type}</div>
            <div><strong>Cached Model:</strong> {currentEntry.aiAnalysis.model}</div>
          </div>
        )}
        
        <div className="mt-2">
          <strong>Display Condition:</strong> {
            (analysis || isAnalyzing || analysisError) ? '✅ Should Show' : '❌ Should Hide'
          }
        </div>
      </div>
    </div>
  );
}
