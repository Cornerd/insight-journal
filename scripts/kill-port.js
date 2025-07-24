const { execSync } = require('child_process');

/**
 * Kill processes running on specific ports
 * Safer than killing all Node.js processes
 */

function killProcessOnPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // Find process using the port
    const result = execSync(`netstat -ano | findstr :${port}`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (result) {
      // Extract PID from netstat output
      const lines = result.split('\n').filter(line => line.trim());
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            pids.add(pid);
          }
        }
      });
      
      // Kill each unique PID
      pids.forEach(pid => {
        try {
          execSync(`taskkill /f /pid ${pid}`, { stdio: 'ignore' });
          console.log(`✓ Killed process ${pid} on port ${port}`);
        } catch (error) {
          console.log(`✗ Failed to kill process ${pid}: ${error.message}`);
        }
      });
      
      if (pids.size === 0) {
        console.log(`ℹ️ No processes found on port ${port}`);
      }
    } else {
      console.log(`ℹ️ No processes found on port ${port}`);
    }
  } catch (error) {
    console.log(`ℹ️ No processes found on port ${port} or access denied`);
  }
}

function killCommonPorts() {
  console.log('🔪 Killing processes on common development ports...');
  
  // Common Next.js development ports
  const ports = [3000, 3001, 3002, 3003, 3004, 3005];
  
  ports.forEach(port => {
    killProcessOnPort(port);
  });
  
  console.log('✅ Port cleanup completed!');
}

// Run if executed directly
if (require.main === module) {
  killCommonPorts();
}

module.exports = { killProcessOnPort, killCommonPorts };
