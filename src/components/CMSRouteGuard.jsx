import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth';
import { adminVerify } from '../utils/api';
import { useToast } from '../contexts/ToastContext';

/**
 * Route guard component for CMS routes
 * Automatically verifies token and logs out if expired
 */
const CMSRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const verifyingRef = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      // Skip verification for login/register pages
      if (location.pathname === '/cms/login' || location.pathname === '/cms/register') {
        return;
      }

      // Prevent multiple simultaneous verifications
      if (verifyingRef.current) {
        return;
      }

      // Check if token exists
      if (!isAuthenticated()) {
        navigate('/cms/login');
        return;
      }

      // Verify token is still valid (only once per route change)
      verifyingRef.current = true;
      try {
        const token = localStorage.getItem('cms_token');
        await adminVerify(token);
      } catch (error) {
        // Token is invalid or expired - logout will be handled by API error handler
        // But we can also handle it here as a fallback
        if (error.message && (error.message.includes('401') || error.message.includes('Token') || error.message.includes('expired'))) {
          console.warn('🔐 Token verification failed:', error.message);
          logout(navigate, toast);
        }
      } finally {
        verifyingRef.current = false;
      }
    };

    verifyToken();
  }, [location.pathname, navigate, toast]);

  return children;
};

export default CMSRouteGuard;

