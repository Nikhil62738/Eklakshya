// GroupSave Mobile API Client
// Hosted on Render: https://eklakshya.onrender.com

// Production Render backend URL with local fallback
export const PRODUCTION_API_URL = 'https://eklakshya.onrender.com/api';
export const LOCAL_DEV_API_URL = 'http://10.0.2.2:5000/api';

// Active base URL pointing to Render
export const API_BASE = PRODUCTION_API_URL;

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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netErr = new Error('Cannot connect to GroupSave server. Operating in offline demo mode.');
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw error;
  }
};
