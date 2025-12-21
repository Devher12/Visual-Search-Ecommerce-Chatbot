/**
 * Authentication page component.
 *
 * Handles user login and signup with form validation and error handling.
 */

import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import Notification from '../components/Notification';
import { Lock, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

/**
 * Authentication page component.
 * @param {Object} props - Component props
 * @param {Function} props.setCurrentPage - Function to change current page
 * @returns {JSX.Element} Authentication page
 */
const AuthPage = ({ setCurrentPage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  /**
   * Handle form submission for login or signup.
   * @param {Event} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotification(null);
    setLoading(true);

    const endpoint = isLogin
      ? `${API_BASE_URL}/login`
      : `${API_BASE_URL}/signup`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ message: data.message, type: 'success' });

        if (isLogin) {
          login({ username: data.username }, data.access_token);
          setTimeout(() => setCurrentPage('home'), 1500);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setNotification({
              message: 'Account created! Please log in.',
              type: 'success',
            });
          }, 1500);
        }
      } else {
        setNotification({
          message: data.error || 'An unexpected error occurred.',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        message: 'Network error or server unreachable. Please check your connection.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Close notification.
   */
  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <div className="auth-container bg-cover bg-center">
      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={handleNotificationClose}
      />

      <div className="auth-card bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white border-opacity-20 w-full max-w-md">
        <div className="flex justify-center mb-8">
          {isLogin ? (
            <Lock size={80} className="text-white" />
          ) : (
            <User size={80} className="text-white" />
          )}
        </div>

        <h2 className="text-4xl font-extrabold text-center text-white mb-10">
          {isLogin ? 'Secure Login' : 'Create Account'}
        </h2>

        <div className="flex justify-center mb-8">
          <button onClick={() => setIsLogin(true)}>Login</button>
          <button onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-field"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
