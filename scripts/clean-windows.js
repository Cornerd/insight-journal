const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Windows-specific cleanup script for Next.js development
 * Handles permission issues with .next directory and trace files
 * Also kills conflicting Node.js processes
 */

function killNodeProcesses() {
  try {
    console.log('🔪 Killing existing Node.js processes...');

    // Kill all node.exe processes (be careful with this!)
    execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
    console.log('✓ Killed Node.js processes');

    // Wait a moment for processes to fully terminate
    setTimeout(() => {}, 1000);
  } catch (error) {
    console.log('ℹ️ No Node.js processes to kill or access denied');
  }
}

function forceDeleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      // Try to change permissions first
      try {
        fs.chmodSync(filePath, 0o666);
      } catch (e) {
        console.log(`Permission change failed for ${filePath}:`, e.message);
      }

      // Try to delete the file
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted: ${filePath}`);
    }
  } catch (error) {
    console.log(`✗ Failed to delete ${filePath}:`, error.message);

    // Try using Windows command line as fallback
    try {
      execSync(`del /f /q "${filePath.replace(/\//g, '\\')}"`, {
        stdio: 'ignore',
      });
      console.log(`✓ Force deleted via cmd: ${filePath}`);
    } catch (cmdError) {
      console.log(`✗ CMD delete also failed for ${filePath}`);
    }
  }
}

function forceDeleteDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      // Try Node.js method first
      fs.rmSync(dirPath, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
      console.log(`✓ Deleted directory: ${dirPath}`);
    }
  } catch (error) {
    console.log(`✗ Failed to delete ${dirPath}:`, error.message);

    // Try Windows command line as fallback
    try {
      execSync(`rmdir /s /q "${dirPath.replace(/\//g, '\\')}"`, {
        stdio: 'ignore',
      });
      console.log(`✓ Force deleted directory via cmd: ${dirPath}`);
    } catch (cmdError) {
      console.log(`✗ CMD rmdir also failed for ${dirPath}`);
    }
  }
}

function cleanNext() {
  console.log('🧹 Starting Windows-specific Next.js cleanup...');

  // First, kill any existing Node.js processes to prevent conflicts
  killNodeProcesses();

  const nextDir = '.next';
  const traceFile = path.join(nextDir, 'trace');

  // First, try to delete the problematic trace file specifically
  if (fs.existsSync(traceFile)) {
    console.log('🎯 Targeting trace file...');
    forceDeleteFile(traceFile);
  }

  // Then clean the entire .next directory
  if (fs.existsSync(nextDir)) {
    console.log('🎯 Cleaning .next directory...');
    forceDeleteDirectory(nextDir);
  }

  console.log('✅ Cleanup completed!');
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanNext();
}

module.exports = {
  cleanNext,
  forceDeleteFile,
  forceDeleteDirectory,
  killNodeProcesses,
};
