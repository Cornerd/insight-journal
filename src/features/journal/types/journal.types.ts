/**
 * Journal Entry Types
 * Defines the data structures for journal entries and storage
 */

export interface JournalEntry {
  /** Unique identifier generated using nanoid */
  id: string;

  /** Markdown content from the editor */
  content: string;

  /** Creation timestamp */
  createdAt: Date;

  /** Last modification timestamp */
  updatedAt: Date;

  /** Optional title (derived from first line or manually set) */
  title?: string;
}

/**
 * Storage format for localStorage
 * Includes versioning for future data migrations
 */
export interface StorageData {
  /** Data format version for migrations */
  version: string;

  /** Array of journal entries */
  entries: JournalEntry[];

  /** Metadata about the storage */
  metadata: {
    /** Last sync timestamp */
    lastSync: Date;

    /** Total number of entries ever created */
    totalEntries: number;
  };
}

/**
 * Create Journal Entry Input
 * Used when creating new entries
 */
export interface CreateJournalEntryInput {
  /** Markdown content */
  content: string;

  /** Optional title */
  title?: string;
}

/**
 * Update Journal Entry Input
 * Used when updating existing entries
 */
export interface UpdateJournalEntryInput {
  /** Entry ID to update */
  id: string;

  /** Updated content */
  content?: string;

  /** Updated title */
  title?: string;
}

/**
 * Storage Service Error Types
 */
export enum StorageErrorType {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  STORAGE_DISABLED = 'STORAGE_DISABLED',
  INVALID_DATA = 'INVALID_DATA',
  ENTRY_NOT_FOUND = 'ENTRY_NOT_FOUND',
  SERIALIZATION_ERROR = 'SERIALIZATION_ERROR',
}

/**
 * Storage Service Error
 */
export class StorageError extends Error {
  constructor(
    public type: StorageErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Storage Service Result
 * Wraps operations that might fail
 */
export type StorageResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: StorageError;
    };

/**
 * Journal Store State
 */
export interface JournalState {
  /** All journal entries */
  entries: JournalEntry[];

  /** Currently selected/editing entry */
  currentEntry: JournalEntry | null;

  /** Loading state for async operations */
  isLoading: boolean;

  /** Error state */
  error: string | null;

  /** Last save timestamp */
  lastSaved: Date | null;
}

/**
 * Journal Store Actions
 */
export interface JournalActions {
  /** Add a new journal entry */
  addEntry: (
    input: CreateJournalEntryInput
  ) => Promise<StorageResult<JournalEntry>>;

  /** Update an existing journal entry */
  updateEntry: (
    input: UpdateJournalEntryInput
  ) => Promise<StorageResult<JournalEntry>>;

  /** Delete a journal entry */
  deleteEntry: (id: string) => Promise<StorageResult<void>>;

  /** Set the current entry being edited */
  setCurrentEntry: (entry: JournalEntry | null) => void;

  /** Load all entries from storage */
  loadEntries: () => Promise<StorageResult<JournalEntry[]>>;

  /** Clear all entries (with confirmation) */
  clearAllEntries: () => Promise<StorageResult<void>>;

  /** Clear error state */
  clearError: () => void;
}

/**
 * Combined Journal Store Type
 */
export type JournalStore = JournalState & JournalActions;
