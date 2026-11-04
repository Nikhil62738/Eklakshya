// GroupSave Mobile API Client
// Handles authorization tokens, base URL routing, and error handling

const API_BASE = 'http://10.0.2.2:5000/api'; // Android Emulator default
// For physical devices, change to your computer's LAN IP e.g. http://192.168.1.x:5000/api

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const api = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.errors ? data.errors.join(', ') : (data.message || `Request failed (${res.status})`);
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    // If network failure or backend unreachable, rethrow clean error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netErr = new Error('Cannot connect to GroupSave server. Operating in offline demo mode.');
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw error;
  }
};

