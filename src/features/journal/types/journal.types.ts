/**
 * Journal Entry Types
 * Defines the data structures for journal entries and storage
 */

/**
 * Sentiment Analysis Types
 */
export type SentimentType = 'positive' | 'neutral' | 'negative' | 'mixed';

/**
 * Emotion Tag with Intensity
 */
export interface EmotionTag {
  /** Emotion name (e.g., 'joy', 'sadness', 'anxiety') */
  name: string;

  /** Emotion intensity from 0.0 to 1.0 */
  intensity: number;

  /** Emoji representation */
  emoji: string;

  /** Emotion category for grouping */
  category: 'positive' | 'negative' | 'neutral';
}

/**
 * AI-Generated Suggestion
 */
export interface Suggestion {
  /** Unique identifier for the suggestion */
  id: string;

  /** Suggestion category */
  category:
    | 'wellness'
    | 'productivity'
    | 'reflection'
    | 'mindfulness'
    | 'social'
    | 'physical';

  /** Suggestion title */
  title: string;

  /** Detailed suggestion description */
  description: string;

  /** Whether this suggestion is actionable */
  actionable: boolean;

  /** Priority level */
  priority: 'low' | 'medium' | 'high';

  /** Icon or emoji for visual representation */
  icon: string;
}

/**
 * AI Analysis Result
 * Contains AI-generated insights about a journal entry
 */
export interface AIAnalysis {
  /** AI-generated summary of the entry */
  summary: string;

  /** Overall sentiment analysis */
  sentiment?: SentimentType;

  /** Detected emotions with intensity scores */
  emotions?: EmotionTag[];

  /** AI-generated personalized suggestions */
  suggestions?: Suggestion[];

  /** Confidence score for the analysis (0.0 to 1.0) */
  confidence?: number;

  /** When the analysis was generated */
  generatedAt: Date;

  /** OpenAI model used for analysis */
  model: string;

  /** Token usage statistics */
  tokenUsage?: {
    /** Tokens used in the prompt */
    prompt: number;
    /** Tokens used in the completion */
    completion: number;
    /** Total tokens used */
    total: number;
  };

  /** Analysis type (for future expansion) */
  type: 'summary' | 'emotion' | 'full' | 'suggestions';

  /** Analysis version (for prompt evolution tracking) */
  version: string;
}

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

  /** AI-generated analysis of the entry */
  aiAnalysis?: AIAnalysis;
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

  /** Updated AI analysis */
  aiAnalysis?: AIAnalysis;
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
