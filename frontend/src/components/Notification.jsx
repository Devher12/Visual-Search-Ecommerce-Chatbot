/**
 * Notification component for displaying temporary messages.
 *
 * Supports success, error, and warning notification types with auto-dismiss.
 */

import React, { useEffect, useState } from 'react';

/**
 * Notification component.
 * @param {Object} props - Component props
 * @param {string} props.message - Notification message text
 * @param {string} props.type - Notification type: 'success', 'error', or 'warning'
 * @param {Function} props.onClose - Callback when notification is closed
 * @param {number} props.duration - Auto-dismiss duration in milliseconds (default: 4000)
 * @returns {JSX.Element|null} Notification component or null if not visible
 */
const Notification = ({
  message,
  type,
  onClose,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-yellow-500';
    }
  };

  const getShadowColor = () => {
    switch (type) {
      case 'success':
        return 'shadow-green-700/50';
      case 'error':
        return 'shadow-red-700/50';
      default:
        return 'shadow-yellow-600/50';
    }
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg text-white font-semibold ${getBackgroundColor()} ${getShadowColor()} z-50 transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="ml-4 text-white hover:text-gray-100 focus:outline-none text-xl leading-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
