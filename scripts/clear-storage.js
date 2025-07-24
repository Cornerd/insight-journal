/**
 * Clear localStorage for development
 * Useful when data format changes cause issues
 */

console.log('🧹 Clearing localStorage for development...');

// Keys to clear
const keysToRemove = [
  'journal-store',
  'insight-journal-data',
  'journal-editor-storage',
];

keysToRemove.forEach(key => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
    console.log(`✓ Cleared: ${key}`);
  }
});

console.log('✅ localStorage cleared successfully!');
console.log('💡 Refresh the page to start with clean data.');
