/**
 * Local Storage Service for Journal Entries
 * Handles all localStorage operations with error handling and data validation
 */

import { nanoid } from 'nanoid';
import {
  JournalEntry,
  StorageData,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  StorageError,
  StorageErrorType,
  StorageResult,
} from '../types/journal.types';

// Storage configuration
const STORAGE_KEY = 'insight-journal-data';
const STORAGE_VERSION = '1.0.0';

/**
 * Check if localStorage is available and enabled
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Serialize data for storage
 */
function serializeData(data: StorageData): string {
  try {
    return JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
  } catch (error) {
    throw new StorageError(
      StorageErrorType.SERIALIZATION_ERROR,
      'Failed to serialize data for storage',
      error as Error
    );
  }
}

/**
 * Deserialize data from storage
 */
function deserializeData(data: string): StorageData {
  try {
    const parsed = JSON.parse(data, (key, value) => {
      // Convert ISO strings back to Date objects
      if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
      ) {
        return new Date(value);
      }
      return value;
    });

    // Validate the structure
    if (!parsed.version || !Array.isArray(parsed.entries)) {
      throw new Error('Invalid storage data structure');
    }

    return parsed as StorageData;
  } catch (error) {
    throw new StorageError(
      StorageErrorType.INVALID_DATA,
      'Failed to deserialize storage data',
      error as Error
    );
  }
}

/**
 * Get initial storage data structure
 */
function getInitialStorageData(): StorageData {
  return {
    version: STORAGE_VERSION,
    entries: [],
    metadata: {
      lastSync: new Date(),
      totalEntries: 0,
    },
  };
}

/**
 * Load data from localStorage
 */
function loadStorageData(): StorageResult<StorageData> {
  try {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: new StorageError(
          StorageErrorType.STORAGE_DISABLED,
          'localStorage is not available or disabled'
        ),
      };
    }

    const rawData = localStorage.getItem(STORAGE_KEY);

    if (!rawData) {
      // Return initial data if nothing is stored
      return {
        success: true,
        data: getInitialStorageData(),
      };
    }

    const data = deserializeData(rawData);

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof StorageError) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: new StorageError(
        StorageErrorType.INVALID_DATA,
        'Failed to load data from storage',
        error as Error
      ),
    };
  }
}

/**
 * Save data to localStorage
 */
function saveStorageData(data: StorageData): StorageResult<void> {
  try {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: new StorageError(
          StorageErrorType.STORAGE_DISABLED,
          'localStorage is not available or disabled'
        ),
      };
    }

    const serializedData = serializeData(data);

    try {
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      // Check if it's a quota exceeded error
      if (error instanceof DOMException && error.code === 22) {
        return {
          success: false,
          error: new StorageError(
            StorageErrorType.QUOTA_EXCEEDED,
            'Storage quota exceeded. Please delete some entries to free up space.',
            error
          ),
        };
      }
      throw error;
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof StorageError) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: new StorageError(
        StorageErrorType.SERIALIZATION_ERROR,
        'Failed to save data to storage',
        error as Error
      ),
    };
  }
}

/**
 * Generate a title from content (first line or first 50 characters)
 */
function generateTitle(content: string): string {
  if (!content.trim()) {
    return 'Untitled Entry';
  }

  // Try to get the first line
  const firstLine = content.split('\n')[0].trim();

  if (firstLine) {
    // Remove markdown formatting for title
    const cleanTitle = firstLine
      .replace(/^#+\s*/, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code
      .trim();

    return cleanTitle.length > 50
      ? cleanTitle.substring(0, 47) + '...'
      : cleanTitle;
  }

  // Fallback to first 50 characters
  return content.length > 50 ? content.substring(0, 47) + '...' : content;
}

/**
 * Storage Service API
 */
export const storageService = {
  /**
   * Get all journal entries
   */
  async getEntries(): Promise<StorageResult<JournalEntry[]>> {
    const result = loadStorageData();

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data.entries,
    };
  },

  /**
   * Get a specific journal entry by ID
   */
  async getEntry(id: string): Promise<StorageResult<JournalEntry>> {
    const result = loadStorageData();

    if (!result.success) {
      return result;
    }

    const entry = result.data.entries.find(e => e.id === id);

    if (!entry) {
      return {
        success: false,
        error: new StorageError(
          StorageErrorType.ENTRY_NOT_FOUND,
          `Journal entry with ID ${id} not found`
        ),
      };
    }

    return {
      success: true,
      data: entry,
    };
  },

  /**
   * Save a new journal entry
   */
  async saveEntry(
    input: CreateJournalEntryInput
  ): Promise<StorageResult<JournalEntry>> {
    const loadResult = loadStorageData();

    if (!loadResult.success) {
      return loadResult;
    }

    const now = new Date();
    const newEntry: JournalEntry = {
      id: nanoid(),
      content: input.content,
      title: input.title || generateTitle(input.content),
      createdAt: now,
      updatedAt: now,
    };

    const updatedData: StorageData = {
      ...loadResult.data,
      entries: [...loadResult.data.entries, newEntry],
      metadata: {
        ...loadResult.data.metadata,
        lastSync: now,
        totalEntries: loadResult.data.metadata.totalEntries + 1,
      },
    };

    const saveResult = saveStorageData(updatedData);

    if (!saveResult.success) {
      return saveResult;
    }

    return {
      success: true,
      data: newEntry,
    };
  },

  /**
   * Update an existing journal entry
   */
  async updateEntry(
    input: UpdateJournalEntryInput
  ): Promise<StorageResult<JournalEntry>> {
    const loadResult = loadStorageData();

    if (!loadResult.success) {
      return loadResult;
    }

    const entryIndex = loadResult.data.entries.findIndex(
      e => e.id === input.id
    );

    if (entryIndex === -1) {
      return {
        success: false,
        error: new StorageError(
          StorageErrorType.ENTRY_NOT_FOUND,
          `Journal entry with ID ${input.id} not found`
        ),
      };
    }

    const existingEntry = loadResult.data.entries[entryIndex];
    const now = new Date();

    const updatedEntry: JournalEntry = {
      ...existingEntry,
      content: input.content ?? existingEntry.content,
      title:
        input.title ??
        (input.content ? generateTitle(input.content) : existingEntry.title),
      updatedAt: now,
    };

    const updatedEntries = [...loadResult.data.entries];
    updatedEntries[entryIndex] = updatedEntry;

    const updatedData: StorageData = {
      ...loadResult.data,
      entries: updatedEntries,
      metadata: {
        ...loadResult.data.metadata,
        lastSync: now,
      },
    };

    const saveResult = saveStorageData(updatedData);

    if (!saveResult.success) {
      return saveResult;
    }

    return {
      success: true,
      data: updatedEntry,
    };
  },

  /**
   * Delete a journal entry
   */
  async deleteEntry(id: string): Promise<StorageResult<void>> {
    const loadResult = loadStorageData();

    if (!loadResult.success) {
      return loadResult;
    }

    const entryExists = loadResult.data.entries.some(e => e.id === id);

    if (!entryExists) {
      return {
        success: false,
        error: new StorageError(
          StorageErrorType.ENTRY_NOT_FOUND,
          `Journal entry with ID ${id} not found`
        ),
      };
    }

    const updatedData: StorageData = {
      ...loadResult.data,
      entries: loadResult.data.entries.filter(e => e.id !== id),
      metadata: {
        ...loadResult.data.metadata,
        lastSync: new Date(),
      },
    };

    return saveStorageData(updatedData);
  },

  /**
   * Clear all journal entries
   */
  async clearAllEntries(): Promise<StorageResult<void>> {
    const initialData = getInitialStorageData();
    return saveStorageData(initialData);
  },

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<
    StorageResult<{ totalEntries: number; lastSync: Date }>
  > {
    const result = loadStorageData();

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        totalEntries: result.data.entries.length,
        lastSync: result.data.metadata.lastSync,
      },
    };
  },
};
