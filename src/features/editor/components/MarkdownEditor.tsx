'use client';

import { useEffect, useState, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useJournalStore } from '../../../shared/store/journalStore';
// import { useCloudJournalStore } from '../../../shared/store/cloudJournalStore';
import { useSession } from 'next-auth/react';
import { AIAnalysis } from '../../journal/types/journal.types';
import {
  useAIAnalysis,
  isContentSuitableForAnalysis,
} from '../../ai-insights/hooks/useAIAnalysis';
import { AIAnalysisCard } from '../../ai-insights/components/AIAnalysisCard';
import { AIDebugPanel } from '../../ai-insights/components/AIDebugPanel';
// import { OfflineIndicator } from '../../../components/ui/OfflineIndicator';

interface MarkdownEditorProps {
  placeholder?: string;
}

// Helper function to safely access aiAnalysis from different entry types
function getAIAnalysis(entry: unknown): AIAnalysis | null {
  if (
    entry &&
    typeof entry === 'object' &&
    entry !== null &&
    'aiAnalysis' in entry
  ) {
    const aiAnalysis = (entry as { aiAnalysis: unknown }).aiAnalysis;
    // Check if it's a valid AIAnalysis object
    if (
      aiAnalysis &&
      typeof aiAnalysis === 'object' &&
      'summary' in aiAnalysis
    ) {
      return aiAnalysis as AIAnalysis;
    }
  }
  return null;
}

export function MarkdownEditor({
  placeholder = 'Start writing your thoughts...',
}: MarkdownEditorProps) {
  // Session for cloud storage
  const { data: session } = useSession();

  // Local journal store (fallback and cache)
  const {
    currentEntry: localCurrentEntry,
    isLoading: localIsLoading,
    error: localError,
    lastSaved: localLastSaved,
    addEntry: addLocalEntry,
    updateEntry: updateLocalEntry,
    loadEntries: loadLocalEntries,
    clearError: clearLocalError,
  } = useJournalStore();

  // Cloud journal store (temporarily disabled)
  // const {
  //   currentEntry: cloudCurrentEntry,
  //   isLoading: cloudIsLoading,
  //   isCreating: cloudIsCreating,
  //   isUpdating: cloudIsUpdating,
  //   error: cloudError,
  //   lastSyncTime,
  //   createEntry: createCloudEntry,
  //   updateEntry: updateCloudEntry,
  //   loadEntries: loadCloudEntries,
  //   setCurrentEntry: setCloudCurrentEntry,
  //   clearError: clearCloudError,
  // } = useCloudJournalStore();

  // Temporarily use only local storage to fix content display issues
  const currentEntry = localCurrentEntry;
  const isLoading = localIsLoading;
  const error = localError;
  const lastSaved = localLastSaved;

  // Debug logging removed

  // Get AI analysis safely from current entry
  const currentEntryAI = getAIAnalysis(currentEntry);

  // Debug logging removed to prevent infinite loops

  // Debug logging removed to prevent infinite loops

  // Local state for editor
  const [content, setContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // AI analysis hook
  const {
    isLoading: isAnalyzing,
    error: analysisError,
    errorType: analysisErrorType,
    analysis,
    analyzeEntry,
    clearError: clearAnalysisError,
    clearAnalysis,
  } = useAIAnalysis();

  const [editorHeight, setEditorHeight] = useState(400);
  const [previewMode, setPreviewMode] = useState<'edit' | 'live' | 'preview'>(
    'edit'
  );

  // Load entries on component mount - temporarily only local storage
  useEffect(() => {
    loadLocalEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync content with current entry
  useEffect(() => {
    if (currentEntry) {
      setContent(currentEntry.content || '');
      setHasUnsavedChanges(false);
      // Clear previous analysis when switching entries
      clearAnalysis();
    } else {
      setContent('');
      setHasUnsavedChanges(false);
      clearAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntry]);

  // Handle content changes
  const handleContentChange = useCallback((value: string = '') => {
    setContent(value);
    setHasUnsavedChanges(true);
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!content.trim()) return;

    try {
      let savedEntryId: string;

      // Temporarily use only local storage
      if (currentEntry) {
        // Update existing entry
        await updateLocalEntry({
          id: currentEntry.id,
          content,
        });
        savedEntryId = currentEntry.id;
      } else {
        // Create new entry
        const result = await addLocalEntry({
          content,
        });
        if (result.success) {
          savedEntryId = result.data.id;
        } else {
          throw new Error(result.error.message);
        }
      }

      setHasUnsavedChanges(false);

      // Trigger AI analysis if content is suitable
      if (isContentSuitableForAnalysis(content)) {
        try {
          console.log('Triggering AI analysis for entry:', savedEntryId);
          const aiAnalysis = await analyzeEntry(content, savedEntryId, 'full');
          if (aiAnalysis) {
            console.log('AI analysis completed, updating entry');
            // Update local entry with AI analysis
            await updateLocalEntry({
              id: savedEntryId,
              aiAnalysis,
            });
          }
        } catch (analysisError) {
          console.warn('AI analysis failed:', analysisError);
          // Don't throw - save was successful, analysis is optional
        }
      } else {
        console.log('Content not suitable for AI analysis');
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, currentEntry, session?.user]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (hasUnsavedChanges && content.trim()) {
      await handleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges, content]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        autoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (hasUnsavedChanges) {
          handleSave();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleResize = () => {
      setEditorHeight(window.innerWidth < 768 ? 300 : 400);
    };

    handleResize(); // Set initial height
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='space-y-4'>
      {/* Mode Toggle Buttons */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            View Mode:
          </span>
          <div className='flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden'>
            {[
              { mode: 'edit' as const, label: '✏️ Edit', title: 'Edit Mode' },
              {
                mode: 'live' as const,
                label: '👁️ Live',
                title: 'Live Preview',
              },
              {
                mode: 'preview' as const,
                label: '📖 Preview',
                title: 'Preview Only',
              },
            ].map(({ mode, label, title }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                title={title}
                className={`
                  px-3 py-1 text-xs font-medium cursor-pointer transition-colors duration-200
                  ${
                    previewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400'>
          <span>{content.length} characters</span>
          {hasUnsavedChanges && (
            <span className='flex items-center text-amber-600 dark:text-amber-400'>
              <span className='w-2 h-2 bg-amber-500 rounded-full mr-1 animate-pulse' />
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className='relative'>
        <MDEditor
          value={content}
          onChange={handleContentChange}
          preview={previewMode}
          hideToolbar={false}
          visibleDragbar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 16,
              lineHeight: 1.6,
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              minHeight: '200px',
            },
          }}
          height={editorHeight}
          data-color-mode='light'
          previewOptions={{
            rehypePlugins: [],
          }}
        />
      </div>

      {/* Save Button and Status */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${
                isLoading
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : !hasUnsavedChanges
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer'
              }
            `}
          >
            {isLoading ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
                <span>Saving...</span>
              </div>
            ) : !hasUnsavedChanges ? (
              '✅ Saved'
            ) : (
              '💾 Save Entry'
            )}
          </button>

          {/* Cloud sync status - temporarily disabled while using local storage only */}
          {/* {session?.user && <OfflineIndicator className='mr-2' />} */}

          {lastSaved && (
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {session?.user ? 'Last synced' : 'Last saved'}:{' '}
              {(() => {
                try {
                  const date =
                    lastSaved instanceof Date ? lastSaved : new Date(lastSaved);
                  return date.toLocaleTimeString();
                } catch (error) {
                  console.error(
                    'Error formatting lastSaved date:',
                    error,
                    lastSaved
                  );
                  return 'Unknown time';
                }
              })()}
            </span>
          )}

          {/* Error Display */}
          {error && (
            <div className='flex items-center space-x-2 text-red-600 dark:text-red-400'>
              <span className='text-sm'>❌ {error}</span>
              <button
                onClick={clearLocalError}
                className='text-xs underline hover:no-underline cursor-pointer'
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Display */}
      {(() => {
        const shouldShow =
          analysis || isAnalyzing || analysisError || !!currentEntryAI;
        // Debug logging removed for production
        return shouldShow;
      })() && (
        <div className='my-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              🤖 AI Analysis Results
            </h3>
            {currentEntry && !isAnalyzing && (
              <button
                onClick={() => {
                  // Force re-analysis by clearing cache first
                  clearAnalysis();
                  analyzeEntry(content, currentEntry.id, 'full');
                }}
                className='px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer'
                title='Re-analyze with current content'
              >
                🔄 Re-analyze
              </button>
            )}
          </div>
          <AIAnalysisCard
            analysis={analysis || currentEntryAI || null}
            isLoading={isAnalyzing}
            error={analysisError}
            errorType={analysisErrorType}
            onRetry={() => {
              if (currentEntry) {
                analyzeEntry(content, currentEntry.id, 'full');
              }
            }}
            onClearError={clearAnalysisError}
            className='mb-6'
          />
        </div>
      )}

      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && <AIDebugPanel />}

      {/* Markdown Help */}
      <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
            Markdown Quick Reference
          </h3>
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            💡 Press{' '}
            <kbd className='px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs'>
              Ctrl+S
            </kbd>{' '}
            to save
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-gray-300'>
          <div>
            <strong>**Bold**</strong> → <strong>Bold</strong>
          </div>
          <div>
            <em>*Italic*</em> → <em>Italic</em>
          </div>
          <div>
            # Heading → <strong>Heading</strong>
          </div>
          <div>- List item → • List item</div>
          <div>
            [Link](url) →{' '}
            <span className='text-blue-600 dark:text-blue-400 underline'>
              Link
            </span>
          </div>
          <div>
            `Code` →{' '}
            <code className='bg-gray-200 dark:bg-gray-600 px-1 rounded'>
              Code
            </code>
          </div>
          <div>
            &gt; Quote → <em>Quote</em>
          </div>
          <div>
            --- → <hr className='border-gray-300 dark:border-gray-600 my-1' />
          </div>
        </div>
      </div>
    </div>
  );
}
