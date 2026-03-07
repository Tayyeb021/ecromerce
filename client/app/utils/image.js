/**
 * Image URL utility functions
 */

import { API_URL } from '../constants';

/**
 * Get the base URL for the API server
 */
const getBaseUrl = () => {
  // Extract base URL from API_URL (remove /api and any trailing paths)
  if (API_URL) {
    let baseUrl = API_URL;
    // Remove /api if present
    baseUrl = baseUrl.replace('/api', '');
    // Remove any trailing paths like /uploads/products
    baseUrl = baseUrl.replace(/\/uploads.*$/, '');
    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
    
    if (baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'))) {
      return baseUrl;
    }
  }
  
  // Fallback to localhost for development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  
  // Fallback: try to construct from current window location
  if (typeof window !== 'undefined' && window.location) {
    // If frontend is on a different port, assume backend is on 3000
    if (window.location.port && window.location.port !== '3000') {
      return `http://${window.location.hostname}:3000`;
    }
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  return '';
};

/**
 * Convert relative image URL to full URL
 * @param {string} imageUrl - Relative or absolute image URL
 * @returns {string} Full image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return '/images/placeholder-image.png';
  }
  
  // If already a full URL (http/https), clean it up if needed
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    let cleaned = imageUrl;
    // Remove all duplicate path segments
    while (cleaned.includes('/uploads/products/api/uploads/products/') || 
           cleaned.includes('/uploads/products/uploads/products/')) {
      cleaned = cleaned.replace(/\/uploads\/products\/api\/uploads\/products\//g, '/uploads/products/');
      cleaned = cleaned.replace(/\/uploads\/products\/uploads\/products\//g, '/uploads/products/');
    }
    // Remove /api from anywhere in the path
    cleaned = cleaned.replace(/\/api\/uploads\//g, '/uploads/');
    return cleaned;
  }
  
  // If it's a public image (starts with /images), return as is
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
  // Clean up the path - extract just the filename if there are nested paths
  let cleanPath = imageUrl;
  
  // Extract filename from nested paths like /uploads/products/api/uploads/products/filename.png
  const filenameMatch = cleanPath.match(/([^\/]+\.(png|jpg|jpeg|gif|webp))$/i);
  if (filenameMatch && (cleanPath.includes('/api/uploads/products/') || cleanPath.includes('/uploads/products/uploads/products/'))) {
    // If we have a nested path, just use the filename
    cleanPath = `/uploads/products/${filenameMatch[1]}`;
  } else {
    // Remove any duplicate /uploads/products segments
    cleanPath = cleanPath.replace(/\/uploads\/products\/api\/uploads\/products\//g, '/uploads/products/');
    cleanPath = cleanPath.replace(/\/api\/uploads\/products\//g, '/uploads/products/');
    cleanPath = cleanPath.replace(/\/uploads\/products\/uploads\/products\//g, '/uploads/products/');
    
    // Remove /api from the beginning if present
    if (cleanPath.startsWith('/api/uploads/')) {
      cleanPath = cleanPath.replace('/api/uploads/', '/uploads/');
    }
    if (cleanPath.startsWith('/api/')) {
      cleanPath = cleanPath.replace('/api/', '/');
    }
    
    // Ensure it starts with /uploads/products/
    if (!cleanPath.startsWith('/uploads/products/') && cleanPath.startsWith('/uploads/')) {
      // If it's just /uploads/, assume it needs /products/ added
      cleanPath = cleanPath.replace(/^\/uploads\//, '/uploads/products/');
    }
  }
  
  // If it's an upload path, prepend base URL
  if (cleanPath.startsWith('/uploads/')) {
    const baseUrl = getBaseUrl();
    return `${baseUrl}${cleanPath}`;
  }
  
  // Default: assume it's just a filename
  const baseUrl = getBaseUrl();
  return `${baseUrl}/uploads/products/${cleanPath}`;
};

/**
 * Get image URL for product (handles both single and multiple images)
 * @param {object} product - Product object
 * @returns {string|array} Image URL(s)
 */
export const getProductImageUrl = (product) => {
  if (!product) {
    return '/images/placeholder-image.png';
  }
  
  // Check for multiple images first
  if (product.images && product.images.length > 0) {
    return product.images.map(img => {
      const url = typeof img === 'string' ? img : (img.imageUrl || img);
      return getImageUrl(url);
    });
  }
  
  // Fallback to single imageUrl
  if (product.imageUrl) {
    return getImageUrl(product.imageUrl);
  }
  
  return '/images/placeholder-image.png';
};
