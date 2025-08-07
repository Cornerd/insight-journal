/**
 * Journal List Component
 * Displays a list of journal entries with sorting and filtering
 */

'use client';

import { useState, useMemo } from 'react';
import { JournalEntry } from '../types/journal.types';
import { JournalCard } from './JournalCard';
import { EmptyState } from './EmptyState';

interface JournalListProps {
  entries: JournalEntry[];
  selectedEntryId?: string | null;
  onEntryClick: (entry: JournalEntry) => void;
  onDeleteEntry?: (entry: JournalEntry) => void;
  onCreateFirst?: () => void;
  onCreateNew?: () => void;
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'title' | 'updated';

export function JournalList({
  entries,
  selectedEntryId,
  onEntryClick,
  onDeleteEntry,
  onCreateFirst,
  onCreateNew,
  className = '',
}: JournalListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort entries based on selected option
  const sortedEntries = useMemo(() => {
    const entriesCopy = [...entries];

    switch (sortBy) {
      case 'newest':
        return entriesCopy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return entriesCopy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'title':
        return entriesCopy.sort((a, b) => {
          const titleA = (a.title || 'Untitled Entry').toLowerCase();
          const titleB = (b.title || 'Untitled Entry').toLowerCase();
          return titleA.localeCompare(titleB);
        });
      case 'updated':
        return entriesCopy.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      default:
        return entriesCopy;
    }
  }, [entries, sortBy]);

  // If no entries, show empty state
  if (entries.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <EmptyState onCreateFirst={onCreateFirst} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 🌟 Enhanced Header */}
      <div className='bg-gradient-to-r from-slate-800/50 to-purple-900/30 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-6 shadow-2xl shadow-violet-500/10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-4'>
            <div className='w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center'>
              <span className='text-white text-lg'>📚</span>
            </div>
            <div>
              <h2 className='text-xl font-bold text-white'>
                思绪记录
              </h2>
              <p className='text-violet-300 text-sm'>
                {entries.length} 篇记录 · 持续 {Math.ceil(entries.length / 7)} 周
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            {/* Enhanced New Entry Button */}
            {onCreateNew && (
              <button
                onClick={onCreateNew}
                className='group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105'
                title='开始新的思考'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <div className='relative flex items-center space-x-2'>
                  <div className='w-4 h-4 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300'>
                    <svg
                      className='w-2.5 h-2.5'
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
                  <span className='text-sm'>新记录</span>
                </div>
              </button>
          )}

            {/* Enhanced Sort Dropdown */}
            <div className='relative'>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className='appearance-none bg-slate-700/50 border border-violet-500/30 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer hover:bg-slate-700/70 transition-colors'
              >
                <option value='newest'>最新优先</option>
                <option value='oldest'>最早优先</option>
                <option value='title'>按标题</option>
                <option value='updated'>最近更新</option>
              </select>
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                <svg className='w-4 h-4 text-violet-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Enhanced Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className='p-2 bg-slate-700/50 border border-violet-500/30 rounded-xl text-violet-300 hover:text-white hover:bg-slate-700/70 transition-all duration-200 hover:scale-105'
              title={isCollapsed ? '展开列表' : '收起列表'}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 15l7-7 7 7'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-3 gap-4 pt-4 border-t border-violet-500/20'>
          <div className='text-center'>
            <div className='text-lg font-bold text-white'>
              {entries.filter(e => e.aiAnalysis?.sentiment === 'positive').length}
            </div>
            <div className='text-xs text-emerald-300'>积极记录</div>
          </div>
          <div className='text-center'>
            <div className='text-lg font-bold text-white'>
              {entries.filter(e => e.aiAnalysis).length}
            </div>
            <div className='text-xs text-violet-300'>已分析</div>
          </div>
          <div className='text-center'>
            <div className='text-lg font-bold text-white'>
              {Math.ceil(entries.length / 30)}
            </div>
            <div className='text-xs text-pink-300'>月份</div>
          </div>
        </div>
      </div>

      {/* 🎨 Enhanced Entries List */}
      {!isCollapsed && (
        <div className='space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500/30 scrollbar-track-transparent'>
          {sortedEntries.map(entry => (
            <div key={entry.id} className='transform transition-all duration-200 hover:scale-[1.02]'>
              <JournalCard
                entry={entry}
                isSelected={entry.id === selectedEntryId}
                onClick={() => onEntryClick?.(entry)}
                onDelete={onDeleteEntry}
                className='bg-gradient-to-r from-slate-800/30 to-purple-900/20 backdrop-blur-sm border border-violet-500/20 hover:border-violet-400/40 shadow-lg hover:shadow-violet-500/10'
              />
            </div>
          ))}
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className='bg-gradient-to-r from-slate-800/30 to-purple-900/20 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-4 text-center'>
          <div className='text-violet-300 text-sm'>
            列表已收起 · {entries.length} 篇记录
          </div>
        </div>
      )}
    </div>
  );
}
