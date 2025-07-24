/**
 * Confirm Dialog Component
 * A reusable confirmation dialog with keyboard support and accessibility
 */

'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      } else if (event.key === 'Enter' && !isLoading) {
        event.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel, isLoading]);

  // Focus management
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmButtonStyles = {
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onCancel}
        aria-hidden='true'
      />

      {/* Dialog */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div
          ref={dialogRef}
          className='
            relative w-full max-w-md transform overflow-hidden rounded-lg 
            bg-white dark:bg-gray-800 shadow-xl transition-all
            border border-gray-200 dark:border-gray-700
          '
          role='dialog'
          aria-modal='true'
          aria-labelledby='dialog-title'
          aria-describedby='dialog-description'
        >
          {/* Header */}
          <div className='px-6 pt-6 pb-4'>
            <div className='flex items-center'>
              {/* Icon based on variant */}
              <div
                className={`
                flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full
                ${
                  confirmVariant === 'danger'
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : confirmVariant === 'warning'
                      ? 'bg-amber-100 dark:bg-amber-900/20'
                      : 'bg-blue-100 dark:bg-blue-900/20'
                }
              `}
              >
                {confirmVariant === 'danger' ? (
                  <svg
                    className='w-6 h-6 text-red-600 dark:text-red-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                ) : confirmVariant === 'warning' ? (
                  <svg
                    className='w-6 h-6 text-amber-600 dark:text-amber-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-6 h-6 text-blue-600 dark:text-blue-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                )}
              </div>

              <div className='ml-4'>
                <h3
                  id='dialog-title'
                  className='text-lg font-medium text-gray-900 dark:text-gray-100'
                >
                  {title}
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='px-6 pb-6'>
            <p
              id='dialog-description'
              className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'
            >
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className='px-6 py-4 bg-gray-50 dark:bg-gray-750 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isLoading}
              className='
                w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                hover:bg-gray-50 dark:hover:bg-gray-600
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                transition-colors duration-200
              '
            >
              {cancelText}
            </button>

            <button
              ref={confirmButtonRef}
              type='button'
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                transition-colors duration-200
                ${confirmButtonStyles[confirmVariant]}
              `}
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Loading...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
