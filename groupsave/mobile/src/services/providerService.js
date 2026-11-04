import { api } from './api';

/**
 * Fetch nearby approved providers from backend
 * @param {Object} coords - { lat, lng }
 * @param {number} radius - in km (default 15)
 * @param {string} category - optional category filter
 */
export const getNearbyProviders = async ({ lat = 18.4507, lng = 73.4387, radius = 15, category = 'All' } = {}) => {
  const query = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString(),
  });
  if (category && category !== 'All') {
    query.append('category', category);
  }
  return api(`/providers/nearby?${query.toString()}`);
};

/**
 * Get provider profile by ID
 */
export const getProviderById = async (id) => {
  return api(`/providers/${id}`);
};

