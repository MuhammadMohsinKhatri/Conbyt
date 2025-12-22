/**
 * Authentication utility functions
 * Handles token management and automatic logout on expiration
 */

/**
 * Logout the user and redirect to login page
 * @param {Function} navigate - React Router navigate function (optional)
 * @param {Function} toast - Toast notification function (optional)
 */
export const logout = (navigate = null, toast = null) => {
  // Clear authentication data
  localStorage.removeItem('cms_token');
  localStorage.removeItem('cms_user');
  
  // Show notification if toast is available
  if (toast) {
    toast.error('Session expired. Please log in again.');
  } else {
    console.log('🔐 Session expired. User logged out.');
  }
  
  // Redirect to login if navigate function is provided
  if (navigate) {
    navigate('/cms/login');
  } else if (typeof window !== 'undefined') {
    // Fallback: use window.location if navigate is not available
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/cms/') && currentPath !== '/cms/login') {
      window.location.href = '/cms/login';
    }
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('cms_token');
};

/**
 * Get the current authentication token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('cms_token');
};

/**
 * Get the current user data
 * @returns {object|null}
 */
export const getUser = () => {
  const userData = localStorage.getItem('cms_user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  return null;
};

/**
 * Check if an error is an authentication error (401)
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  if (!error) return false;
  
  // Check status code
  if (error.status === 401) return true;
  
  // Check error message
  const message = error.message || '';
  return (
    message.includes('401') ||
    message.includes('Token') ||
    message.includes('expired') ||
    message.includes('Invalid') ||
    message.includes('Unauthorized')
  );
};

