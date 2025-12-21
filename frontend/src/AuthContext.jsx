/**
 * Authentication context and provider.
 *
 * Manages user authentication state, JWT tokens, and localStorage persistence.
 * Provides login/logout functionality and token expiration checking.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

/**
 * Hook to access authentication context.
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Safely parse JSON with fallback value.
 * @param {string} data - JSON string to parse
 * @param {*} fallback - Value to return if parsing fails
 * @returns {*} Parsed JSON or fallback value
 */
const safeJSONParse = (data, fallback = null) => {
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

/**
 * Authentication provider component.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Auth context provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeJSONParse(localStorage.getItem('user'))
  );
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem('accessToken')
  );

  /**
   * Check token expiration and logout if expired.
   */
  useEffect(() => {
    if (!accessToken) return;

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        console.warn('Token expired, logging out');
        logout();
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      logout();
    }
  }, [accessToken]);

  /**
   * Login user and store credentials.
   * @param {Object} userData - User data object
   * @param {string} token - JWT access token
   */
  const login = useCallback((userData, token) => {
    setUser(userData);
    setAccessToken(token);
  }, []);

  /**
   * Logout user and clear credentials.
   */
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }, []);

  /**
   * Persist user and token to localStorage.
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [user, accessToken]);

  const value = {
    user,
    isAuthenticated: !!user,
    accessToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
