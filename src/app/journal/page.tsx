'use client';

import { useState } from 'react';
import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';
import { JournalList } from '@/features/journal/components/JournalList';
import { useJournalStore } from '@/shared/store/journalStore';
import { useCloudJournal } from '@/hooks/useCloudJournal';
import { useSession } from 'next-auth/react';
import { JournalEntry } from '@/features/journal/types/journal.types';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { DataMigration } from '@/components/DataMigration';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { OfflineStatusBadge } from '@/components/OfflineStatusIndicator';

export default function JournalPage() {
  const { data: session } = useSession();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // 📱 Local storage (MVP fallback for non-authenticated users)
  const {
    entries: localEntries,
    currentEntry,
    setCurrentEntry,
    deleteEntry: deleteLocalEntry,
    isLoading: localIsLoading,
  } = useJournalStore();

  // ☁️ Cloud storage (Epic 3: Primary storage for authenticated users)
  const {
    entries: cloudEntries,
    isLoading: cloudIsLoading,
    deleteEntry: deleteCloudEntry,
  } = useCloudJournal();

  // 🎯 Epic 3 Complete: Cloud-First Data Strategy
  // Authenticated users → Supabase cloud storage
  // Non-authenticated users → localStorage (MVP fallback)
  const useCloud = !!session?.user;
  const entries = useCloud ? cloudEntries : localEntries;
  const isLoading = useCloud ? cloudIsLoading : localIsLoading;

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    entry: JournalEntry | null;
  }>({
    isOpen: false,
    entry: null,
  });

  const handleEntryClick = (entry: JournalEntry) => {
    setCurrentEntry(entry);
  };

  const handleCreateFirst = () => {
    // Focus on the editor to start writing
    setCurrentEntry(null);
  };

  const handleCreateNew = () => {
    // Clear current entry to start a new one
    setCurrentEntry(null);
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    setDeleteDialog({
      isOpen: true,
      entry,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.entry) return;

    const entryTitle = deleteDialog.entry.title || 'Untitled Entry';

    try {
      if (useCloud) {
        const success = await deleteCloudEntry(deleteDialog.entry.id);
        if (success) {
          showSuccess(
            'Entry Deleted',
            `"${entryTitle}" has been deleted successfully.`
          );
        } else {
          showError(
            'Delete Failed',
            'Failed to delete the entry. Please try again.'
          );
          return; // Don't close dialog on failure
        }
      } else {
        await deleteLocalEntry(deleteDialog.entry.id);
        showSuccess(
          'Entry Deleted',
          `"${entryTitle}" has been deleted successfully.`
        );
      }

      // If we're deleting the currently selected entry, clear the selection
      if (currentEntry?.id === deleteDialog.entry.id) {
        setCurrentEntry(null);
      }

      // Close the dialog
      setDeleteDialog({
        isOpen: false,
        entry: null,
      });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      showError('Delete Failed', 'An error occurred while deleting the entry.');
      // Keep dialog open on error
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      entry: null,
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
      {/* 🎨 Dynamic Background Effects */}
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse delay-2000'></div>

        {/* Subtle grid pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
      </div>

      <div className='relative z-10 w-full px-6 py-8'>
        {/* 🌟 Enhanced Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <div className='w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                  <div className='w-8 h-8 relative'>
                    <div className='absolute inset-0 bg-white rounded-full opacity-90'></div>
                    <div className='absolute top-1 left-1 w-2 h-2 bg-violet-600 rounded-full'></div>
                    <div className='absolute top-2 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full'></div>
                    <div className='absolute bottom-1 left-2 w-1 h-1 bg-violet-600 rounded-full'></div>
                  </div>
                </div>
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping'></div>
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                  我的思维空间
                </h1>
                <p className='text-violet-300 text-sm font-medium'>记录・思考・成长</p>
              </div>
            </div>

            {/* Story 3.7: Enhanced Offline Status Badge */}
            {session?.user && (
              <div className='flex items-center space-x-4'>
                <OfflineStatusBadge />
                <div className='text-right'>
                  <div className='text-sm text-gray-300'>
                    {entries.length} 篇日记
                  </div>
                  <div className='text-xs text-violet-300'>
                    持续记录 {Math.ceil(entries.length / 7)} 周
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Migration Component */}
        <DataMigration />

        {/* 🎯 Revolutionary Layout: Full-Width Side-by-Side Design */}
        <div className='grid lg:grid-cols-12 gap-8 min-h-[calc(100vh-200px)]'>

          {/* Left: Journal Entries List (Enhanced) - More space on large screens */}
          <div className='lg:col-span-4 xl:col-span-3'>
            <div className='sticky top-8'>
              <JournalList
                entries={entries}
                selectedEntryId={currentEntry?.id}
                onEntryClick={handleEntryClick}
                onDeleteEntry={handleDeleteEntry}
                onCreateFirst={handleCreateFirst}
                onCreateNew={handleCreateNew}
                className='h-[calc(100vh-250px)] overflow-hidden'
              />
            </div>
          </div>

          {/* Right: Editor Section (Enhanced) - Flexible width */}
          <div className='lg:col-span-8 xl:col-span-9'>
            <div className='bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-xl border border-violet-500/20 rounded-3xl shadow-2xl shadow-violet-500/10 overflow-hidden'>

              {/* Editor Header */}
              <div className='border-b border-violet-500/20 p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center'>
                      <span className='text-white text-lg'>
                        {currentEntry ? '✏️' : '✨'}
                      </span>
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-white'>
                        {currentEntry ? '编辑思绪' : '新的开始'}
                      </h2>
                      <p className='text-violet-300 text-sm'>
                        {currentEntry ? '继续你的思考' : '让想法自由流淌'}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced New Entry Button */}
                  {entries.length > 0 && (
                    <button
                      onClick={handleCreateNew}
                      className={`
                        group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                        ${
                          currentEntry
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-lg hover:shadow-violet-500/25 hover:scale-105'
                            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        }
                      `}
                      disabled={!currentEntry}
                      title={
                        currentEntry
                          ? '开始新的思考'
                          : '正在创建新日记'
                      }
                    >
                      <div className='absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div className='relative flex items-center space-x-2'>
                        <div className='w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300'>
                          <svg
                            className='w-3 h-3'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 4v16m8-8H4'
                            />
                          </svg>
                        </div>
                        <span>新的开始</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Editor Content Area */}
              <div className='p-6'>
                {/* Entry Metadata */}
                <div className='mb-6'>
                  <div className='flex items-center space-x-4 text-sm'>
                    <div className='flex items-center space-x-2 text-violet-300'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      <span>
                        {currentEntry
                          ? new Date(currentEntry.createdAt).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              weekday: 'long',
                            })
                          : new Date().toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              weekday: 'long',
                            })}
                      </span>
                    </div>

                    {currentEntry && (
                      <div className='flex items-center space-x-2 text-gray-400'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                        </svg>
                        <span>
                          最后编辑: {new Date(currentEntry.updatedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Markdown Editor */}
                <div className='bg-slate-800/30 rounded-2xl border border-violet-500/10 overflow-hidden'>
                  <MarkdownEditor />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title='Delete Journal Entry'
        message={`Are you sure you want to delete "${
          deleteDialog.entry?.title || 'Untitled Entry'
        }"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        confirmVariant='danger'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
