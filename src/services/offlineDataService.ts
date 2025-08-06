/**
 * Offline Data Service
 * Manages offline data storage and synchronization
 * 
 * Story 3.7: Implement Offline Data Synchronization
 * Handles offline-first data strategy for authenticated users
 */

import { JournalEntry } from '@/features/journal/types/journal.types';
import { AIAnalysis } from '@/features/journal/types/journal.types';

interface OfflineJournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  lastSyncAttempt?: string;
  aiAnalysis?: AIAnalysis;
}

interface OfflineSyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

const OFFLINE_STORAGE_KEY = 'insight-journal-offline-data';
const MAX_RETRY_COUNT = 3;

class OfflineDataService {
  /**
   * Save journal entry for offline sync
   * AC 3.7.2: New entries saved to localStorage when offline
   */
  saveOfflineEntry(
    title: string,
    content: string,
    userId: string,
    aiAnalysis?: AIAnalysis
  ): OfflineJournalEntry {
    const entry: OfflineJournalEntry = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      syncStatus: 'pending',
      retryCount: 0,
      aiAnalysis,
    };

    const offlineData = this.getOfflineData();
    offlineData.push(entry);
    this.saveOfflineData(offlineData);

    console.log('📱 Entry saved offline:', entry.id);
    return entry;
  }

  /**
   * Get all pending offline entries for a user
   * AC 3.7.4: System detects local storage entries for sync
   */
  getPendingEntries(userId: string): OfflineJournalEntry[] {
    const offlineData = this.getOfflineData();
    return offlineData.filter(
      entry => entry.userId === userId && entry.syncStatus === 'pending'
    );
  }

  /**
   * Get all offline entries for a user (any status)
   */
  getAllOfflineEntries(userId: string): OfflineJournalEntry[] {
    const offlineData = this.getOfflineData();
    return offlineData.filter(entry => entry.userId === userId);
  }

  /**
   * Sync all pending entries to cloud
   * AC 3.7.5: Upload entries to Supabase and associate with user
   */
  async syncPendingEntries(userId: string): Promise<OfflineSyncResult> {
    const pendingEntries = this.getPendingEntries(userId);
    
    if (pendingEntries.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        failedCount: 0,
        errors: [],
      };
    }

    console.log(`🔄 Starting sync of ${pendingEntries.length} offline entries`);

    let syncedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const entry of pendingEntries) {
      try {
        // Mark as syncing
        this.updateEntryStatus(entry.id, 'syncing');

        // Sync journal entry
        const response = await fetch('/api/journal/entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: entry.title,
            content: entry.content,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to sync entry');
        }

        const cloudEntryId = result.data.id;

        // Sync AI analysis if exists
        if (entry.aiAnalysis) {
          try {
            await this.syncAIAnalysis(cloudEntryId, entry.aiAnalysis);
          } catch (aiError) {
            console.warn('Failed to sync AI analysis:', aiError);
            // Don't fail the entire sync for AI analysis errors
          }
        }

        // Mark as synced and remove from offline storage
        this.removeOfflineEntry(entry.id);
        syncedCount++;

        console.log(`✅ Synced offline entry: ${entry.title}`);

      } catch (error) {
        console.error(`❌ Failed to sync entry ${entry.id}:`, error);
        
        // Update retry count and status
        const updatedEntry = {
          ...entry,
          retryCount: entry.retryCount + 1,
          lastSyncAttempt: new Date().toISOString(),
          syncStatus: entry.retryCount >= MAX_RETRY_COUNT ? 'failed' : 'pending',
        } as OfflineJournalEntry;

        this.updateOfflineEntry(updatedEntry);
        
        failedCount++;
        errors.push(`${entry.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const result = {
      success: failedCount === 0,
      syncedCount,
      failedCount,
      errors,
    };

    console.log(`🔄 Sync completed:`, result);
    return result;
  }

  /**
   * Sync AI analysis to cloud
   */
  private async syncAIAnalysis(entryId: string, analysis: AIAnalysis): Promise<void> {
    const response = await fetch('/api/journal/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entryId,
        summary: analysis.summary,
        emotions: analysis.emotions,
        suggestions: analysis.suggestions,
        model: analysis.model,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync AI analysis: ${response.statusText}`);
    }
  }

  /**
   * Clear synced entries from offline storage
   * AC 3.7.6: Clean up local storage after successful sync
   */
  clearSyncedEntries(userId: string): void {
    const offlineData = this.getOfflineData();
    const filteredData = offlineData.filter(
      entry => !(entry.userId === userId && entry.syncStatus === 'synced')
    );
    this.saveOfflineData(filteredData);
  }

  /**
   * Get offline data from localStorage
   */
  private getOfflineData(): OfflineJournalEntry[] {
    try {
      const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return [];
    }
  }

  /**
   * Save offline data to localStorage
   */
  private saveOfflineData(data: OfflineJournalEntry[]): void {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  /**
   * Update entry status
   */
  private updateEntryStatus(entryId: string, status: OfflineJournalEntry['syncStatus']): void {
    const offlineData = this.getOfflineData();
    const entryIndex = offlineData.findIndex(entry => entry.id === entryId);
    
    if (entryIndex >= 0) {
      offlineData[entryIndex].syncStatus = status;
      this.saveOfflineData(offlineData);
    }
  }

  /**
   * Update offline entry
   */
  private updateOfflineEntry(updatedEntry: OfflineJournalEntry): void {
    const offlineData = this.getOfflineData();
    const entryIndex = offlineData.findIndex(entry => entry.id === updatedEntry.id);
    
    if (entryIndex >= 0) {
      offlineData[entryIndex] = updatedEntry;
      this.saveOfflineData(offlineData);
    }
  }

  /**
   * Remove entry from offline storage
   */
  private removeOfflineEntry(entryId: string): void {
    const offlineData = this.getOfflineData();
    const filteredData = offlineData.filter(entry => entry.id !== entryId);
    this.saveOfflineData(filteredData);
  }
}

export const offlineDataService = new OfflineDataService();
