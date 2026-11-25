// API Configuration
// Update this IP address if your backend server IP changes
// To find your IP: Run 'ipconfig' in Command Prompt and look for IPv4 Address

export const API_CONFIG = {
  // Current machine IP: 192.168.137.26
  BASE_URL: 'http://192.168.137.26:8000/api',
  TIMEOUT: 10000, // 10 seconds
};

// You can also use localhost for testing on the same machine
// BASE_URL: 'http://localhost:8000/api',

// For production, replace with your production server URL
// BASE_URL: 'https://your-domain.com/api',
