/**
 * Migration Tracker Utility
 * Tracks which local entries have been migrated to avoid duplicates
 */

const MIGRATION_TRACKER_KEY = 'insight-journal-migrated-entries';

interface MigratedEntry {
  localId: string;
  cloudId: string;
  migratedAt: string;
  contentHash: string; // Hash of content for verification
}

// Simple hash function for content
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Get migrated entries from localStorage
export function getMigratedEntries(): MigratedEntry[] {
  try {
    const stored = localStorage.getItem(MIGRATION_TRACKER_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading migrated entries:', error);
    return [];
  }
}

// Mark an entry as migrated
export function markEntryAsMigrated(
  localId: string,
  cloudId: string,
  content: string
): void {
  try {
    const migrated = getMigratedEntries();
    const contentHash = simpleHash(content.trim());

    // Remove any existing entry with the same local ID
    const filtered = migrated.filter(entry => entry.localId !== localId);

    // Add the new migration record
    filtered.push({
      localId,
      cloudId,
      migratedAt: new Date().toISOString(),
      contentHash,
    });

    localStorage.setItem(MIGRATION_TRACKER_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error marking entry as migrated:', error);
  }
}

// Check if an entry has been migrated
export function isEntryMigrated(localId: string, content: string): boolean {
  try {
    const migrated = getMigratedEntries();
    const contentHash = simpleHash(content.trim());

    return migrated.some(
      entry => entry.localId === localId && entry.contentHash === contentHash
    );
  } catch (error) {
    console.error('Error checking if entry is migrated:', error);
    return false;
  }
}

// Check if content has been migrated (regardless of local ID)
export function isContentMigrated(content: string): boolean {
  try {
    const migrated = getMigratedEntries();
    const contentHash = simpleHash(content.trim());

    return migrated.some(entry => entry.contentHash === contentHash);
  } catch (error) {
    console.error('Error checking if content is migrated:', error);
    return false;
  }
}

// Clear migration tracker (for testing or reset)
export function clearMigrationTracker(): void {
  try {
    localStorage.removeItem(MIGRATION_TRACKER_KEY);
  } catch (error) {
    console.error('Error clearing migration tracker:', error);
  }
}

// Get cloud ID for a local entry
export function getCloudIdForLocalEntry(localId: string): string | null {
  try {
    const migrated = getMigratedEntries();
    const entry = migrated.find(entry => entry.localId === localId);
    return entry ? entry.cloudId : null;
  } catch (error) {
    console.error('Error getting cloud ID for local entry:', error);
    return null;
  }
}

// Get local ID for a cloud entry
export function getLocalIdForCloudEntry(cloudId: string): string | null {
  try {
    const migrated = getMigratedEntries();
    const entry = migrated.find(entry => entry.cloudId === cloudId);
    return entry ? entry.localId : null;
  } catch (error) {
    console.error('Error getting local ID for cloud entry:', error);
    return null;
  }
}

// Get list of local IDs that have been migrated
export function getMigratedLocalIds(): string[] {
  try {
    const migrated = getMigratedEntries();
    return migrated.map(entry => entry.localId);
  } catch (error) {
    console.error('Error getting migrated local IDs:', error);
    return [];
  }
}

// Check if we can safely clean up local data
export function canCleanupLocalData(): {
  canCleanup: boolean;
  migratedCount: number;
  reason?: string;
} {
  try {
    const migrated = getMigratedEntries();

    if (migrated.length === 0) {
      return {
        canCleanup: false,
        migratedCount: 0,
        reason: 'No migrated entries found',
      };
    }

    // Check if migrations are recent (within last 24 hours)
    const now = new Date().getTime();
    const recentMigrations = migrated.filter(entry => {
      const migrationTime = new Date(entry.migratedAt).getTime();
      return now - migrationTime < 24 * 60 * 60 * 1000; // 24 hours
    });

    if (recentMigrations.length === 0) {
      return {
        canCleanup: false,
        migratedCount: migrated.length,
        reason: 'No recent migrations found. Please re-sync to ensure data safety.',
      };
    }

    return {
      canCleanup: true,
      migratedCount: migrated.length,
    };
  } catch (error) {
    console.error('Error checking cleanup eligibility:', error);
    return {
      canCleanup: false,
      migratedCount: 0,
      reason: 'Error checking migration status',
    };
  }
}

// Get migration statistics
export function getMigrationStats(): {
  totalMigrated: number;
  lastMigrationDate: Date | null;
} {
  try {
    const migrated = getMigratedEntries();
    const lastMigrationDate =
      migrated.length > 0
        ? new Date(
            Math.max(
              ...migrated.map(entry => new Date(entry.migratedAt).getTime())
            )
          )
        : null;

    return {
      totalMigrated: migrated.length,
      lastMigrationDate,
    };
  } catch (error) {
    console.error('Error getting migration stats:', error);
    return {
      totalMigrated: 0,
      lastMigrationDate: null,
    };
  }
}
