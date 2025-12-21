/**
 * Main application component with routing logic.
 *
 * Handles page navigation based on authentication state and user actions.
 * Uses simple state-based routing instead of a router library.
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import VisualSearchPage from './pages/VisualSearchPage';

/**
 * Main app content component that handles routing.
 * @returns {JSX.Element} The current page based on routing state
 */
const AppContent = () => {
  // Bypass authentication - always start on home page
  const [currentPage, setCurrentPage] = useState('home');

  /**
   * Renders the appropriate page based on current route.
   * Authentication bypassed - all pages accessible.
   * @returns {JSX.Element} The page component to render
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage setCurrentPage={setCurrentPage} />;

      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;

      case 'visualSearch':
        return <VisualSearchPage setCurrentPage={setCurrentPage} />;

      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      {renderPage()}
    </div>
  );
};

/**
 * Root App component wrapped with authentication provider.
 * @returns {JSX.Element} The application with auth context
 */
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
