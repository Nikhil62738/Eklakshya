import { api, setAuthToken } from './api';

export const register = async (userData) => {
  const data = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const login = async (identifier, password) => {
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const sendOtp = (phone, email, purpose = 'Verification') => {
  return api('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, email, purpose })
  });
};

export const verifyOtp = async (credentials) => {
  const data = await api('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const getMe = () => {
  return api('/auth/me');
};

export const updateProfile = (profileData) => {
  return api('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export const addAddress = (addressData) => {
  return api('/auth/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData)
  });
};

export const deleteAddress = (addressId) => {
  return api(`/auth/addresses/${addressId}`, {
    method: 'DELETE'
  });
};

