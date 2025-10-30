// API configuration - hardcoded for production
export const API_BASE = 'https://metacrown.co.za';
export const ASSETS_BASE = 'https://metacrown.co.za/assets/';

// Helper to create full API URLs
export const apiUrl = (path) => `${API_BASE}${path}`;
export const assetUrl = (path) => `${ASSETS_BASE}${path}`;

// Common fetch wrapper with correct base URL
export const apiFetch = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, options);
};
