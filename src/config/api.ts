import DeviceInfo from 'react-native-device-info';

/**
 * API Configuration
 * 
 * For development on real devices:
 * - Update DEV_API_HOST below with your machine's local IP address
 * - Find your IP: macOS/Linux: `ipconfig getifaddr en0` or `ifconfig | grep "inet "`
 * - Windows: `ipconfig` (look for IPv4 Address)
 * - Ensure your device and computer are on the same WiFi network
 * 
 * For simulators/emulators: localhost works fine (auto-detected)
 */
// Update this to your machine's IP address for real device testing
// Find your IP: macOS/Linux: `ipconfig getifaddr en0` or `ifconfig | grep "inet "`
// Windows: `ipconfig` (look for IPv4 Address)
// const DEV_API_HOST = '192.168.70.33'; 
const DEV_API_HOST = '192.168.70.33'; 

// Cache for device type detection
let isSimulatorCache: boolean | null = null;

/**
 * Check if running on simulator/emulator (cached)
 */
async function isSimulator(): Promise<boolean> {
  if (isSimulatorCache === null) {
    isSimulatorCache = await DeviceInfo.isEmulator();
  }
  return isSimulatorCache;
}

/**
 * Get API base URL (async to support device detection)
 */
export async function getAPIBaseURL(): Promise<string> {
  if (__DEV__) {
    return `http://${DEV_API_HOST}:8000/api/v1`;
   
  } else {
    return 'https://clevrcash.com/api/v1';
  }
}

// For backward compatibility - will be updated on first API call
// Default to localhost for initial load (works for simulator)
//   ? 'http://localhost:8000/api/v1'
//   : 'https://clevrcash.com/api/v1';
export let API_BASE_URL = "https://clevrcash.com/api/v1"; 

// Initialize the base URL asynchronously
getAPIBaseURL().then(url => {
  API_BASE_URL = url;
  if (__DEV__) {
    console.log(`[API] Base URL initialized: ${API_BASE_URL}`);
  }
}).catch(err => {
  console.error('[API] Failed to initialize base URL:', err);
});

export const API_TIMEOUT = 30000;
