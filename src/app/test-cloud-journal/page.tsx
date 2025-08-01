'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCloudJournal } from '@/hooks/useCloudJournal';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function TestCloudJournalPage() {
  const { data: session, status } = useSession();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const {
    entries,
    entriesWithAnalysis,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries,
    createAIAnalysis,
    clearError,
  } = useCloudJournal();

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleCreateEntry = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please enter both title and content');
      return;
    }

    const entry = await createEntry(newTitle, newContent);
    if (entry) {
      setNewTitle('');
      setNewContent('');
      showSuccess(
        'Entry Created',
        `"${newTitle}" has been created successfully.`
      );
    } else {
      showError(
        'Create Failed',
        'Failed to create the entry. Please try again.'
      );
    }
  };

  const handleUpdateEntry = async (id: string) => {
    const entry = await updateEntry(id, {
      title: editTitle,
      content: editContent,
    });
    if (entry) {
      setEditingId(null);
      setEditTitle('');
      setEditContent('');
      showSuccess(
        'Entry Updated',
        `"${editTitle}" has been updated successfully.`
      );
    } else {
      showError(
        'Update Failed',
        'Failed to update the entry. Please try again.'
      );
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const entryToDelete = entries.find(e => e.id === id);
    const entryTitle = entryToDelete?.title || 'Untitled Entry';

    if (confirm('Are you sure you want to delete this entry?')) {
      const success = await deleteEntry(id);
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
      }
    }
  };

  const handleCreateAIAnalysis = async (entryId: string) => {
    const analysis = await createAIAnalysis(
      entryId,
      'This is a test AI summary of the journal entry.',
      { joy: 0.7, neutral: 0.3, excitement: 0.5 },
      {
        categories: ['reflection', 'gratitude'],
        actions: ['continue journaling'],
      },
      'test-model-v1'
    );
    if (analysis) {
      showSuccess(
        'AI Analysis Created',
        'AI analysis has been generated successfully.'
      );
    } else {
      showError(
        'Analysis Failed',
        'Failed to create AI analysis. Please try again.'
      );
    }
  };

  const startEdit = (entry: any) => {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold mb-4'>Cloud Journal Test</h1>
          <p className='mb-4 text-gray-600'>
            Please sign in to test cloud journal functionality.
          </p>
          <button
            onClick={() => signIn()}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>Cloud Journal Test</h1>
            <div className='flex items-center space-x-4'>
              <span
                className={`px-2 py-1 rounded text-sm ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
              <button
                onClick={() => signOut()}
                className='bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 cursor-pointer'
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='bg-blue-50 p-4 rounded'>
              <h3 className='font-semibold text-blue-800'>Total Entries</h3>
              <p className='text-2xl font-bold text-blue-600'>
                {entries.length}
              </p>
            </div>
            <div className='bg-green-50 p-4 rounded'>
              <h3 className='font-semibold text-green-800'>With Analysis</h3>
              <p className='text-2xl font-bold text-green-600'>
                {entriesWithAnalysis.filter(e => e.summary).length}
              </p>
            </div>
            <div className='bg-purple-50 p-4 rounded'>
              <h3 className='font-semibold text-purple-800'>Last Sync</h3>
              <p className='text-sm text-purple-600'>
                {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
              </p>
            </div>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded p-4 mb-4'>
              <div className='flex justify-between items-center'>
                <p className='text-red-800'>{error}</p>
                <button
                  onClick={clearError}
                  className='text-red-600 hover:text-red-800 cursor-pointer'
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className='flex space-x-2 mb-6'>
            <button
              onClick={refreshEntries}
              disabled={isLoading}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Create New Entry */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-bold mb-4'>Create New Entry</h2>
          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Entry title...'
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded'
            />
            <textarea
              placeholder='Entry content...'
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={4}
              className='w-full p-3 border border-gray-300 rounded'
            />
            <button
              onClick={handleCreateEntry}
              disabled={isLoading}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              Create Entry
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className='space-y-4'>
          {entries.map(entry => (
            <div key={entry.id} className='bg-white rounded-lg shadow-md p-6'>
              {editingId === entry.id ? (
                <div className='space-y-4'>
                  <input
                    type='text'
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className='w-full p-3 border border-gray-300 rounded'
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={4}
                    className='w-full p-3 border border-gray-300 rounded'
                  />
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleUpdateEntry(entry.id)}
                      className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer'
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className='bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 cursor-pointer'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-lg font-semibold'>{entry.title}</h3>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => startEdit(entry)}
                        className='text-blue-600 hover:text-blue-800 text-sm cursor-pointer'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCreateAIAnalysis(entry.id)}
                        className='text-green-600 hover:text-green-800 text-sm cursor-pointer'
                      >
                        AI Analysis
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className='text-red-600 hover:text-red-800 text-sm cursor-pointer'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className='text-gray-700 mb-2'>{entry.content}</p>
                  <p className='text-xs text-gray-500'>
                    Created: {new Date(entry.created_at).toLocaleString()}
                  </p>

                  {/* Show AI analysis if available */}
                  {entriesWithAnalysis.find(
                    e => e.id === entry.id && e.summary
                  ) && (
                    <div className='mt-4 p-3 bg-blue-50 rounded'>
                      <h4 className='font-semibold text-blue-800 mb-2'>
                        AI Analysis
                      </h4>
                      <p className='text-blue-700 text-sm'>
                        {
                          entriesWithAnalysis.find(e => e.id === entry.id)
                            ?.summary
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {entries.length === 0 && !isLoading && (
          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <p className='text-gray-500'>
              No journal entries yet. Create your first entry above!
            </p>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
