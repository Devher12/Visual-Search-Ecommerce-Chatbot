/**
 * Home page component.
 *
 * Displays featured products and provides navigation to visual search.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Search, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = 'http://localhost:5000';
const INITIAL_SEARCH_QUERY = 'shoes';

/**
 * Home page component.
 * @param {Object} props - Component props
 * @param {Function} props.setCurrentPage - Function to change current page
 * @returns {JSX.Element} Home page
 */
const HomePage = ({ setCurrentPage }) => {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  /**
   * Fetch initial featured products on mount.
   * Authentication bypassed - works without token.
   */
  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try with token if available, otherwise without
        const headers = {
          'Content-Type': 'application/json',
        };
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/text-search`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ query: INITIAL_SEARCH_QUERY }),
        });

        const responseText = await response.text();

        if (!response.ok) {
          let errorMessage = 'Failed to fetch initial products.';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = `Server responded with status ${response.status}.`;
          }
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        setProducts(data.results || []);

        if (!data.results || data.results.length === 0) {
          setError('No featured products found.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Error loading products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch products, authentication bypassed
    fetchInitialProducts();
  }, [accessToken]);

  /**
   * Handle user logout (disabled - authentication bypassed).
   */
  const handleLogout = () => {
    // Logout disabled - authentication bypassed
    // logout();
    // setCurrentPage('auth');
  };

  /**
   * Handle product card click to toggle details.
   * @param {string} productId - Product ID to select/deselect
   */
  const handleProductClick = (productId) => {
    setSelectedProductId((prevId) =>
      prevId === productId ? null : productId
    );
  };

  return (
    <div className="home-background-container">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative z-10 w-full flex flex-col items-center min-h-screen">
        {/* Logout button removed - authentication bypassed */}

        <div
          className="relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center p-6 text-white text-center shadow-lg"
          style={{ backgroundImage: `url('/12.jpg')` }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="relative z-10 animate-fade-in max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-2xl mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-sky-400 animate-pulse font-montserrat">
              Welcome to SoleRush!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide mb-8 font-poppins">
              Find your perfect pair with smart visual and text search.
            </p>
            <button
              aria-label="Start Visual Search"
              onClick={() => setCurrentPage('visualSearch')}
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-2xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Search size={28} className="mr-3" />
              Start Visual Search
            </button>
          </div>
        </div>

        <div className="w-full max-w-7xl -mt-20 md:-mt-32 relative z-20 bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-200 animate-slide-up">
          <h2 className="text-4xl font-bold text-center text-black mb-8 drop-shadow-sm font-montserrat">
            Featured Products
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
              <p className="mt-4 text-gray-700 text-xl font-medium font-poppins">
                Loading amazing products...
              </p>
            </div>
          ) : error ? (
            <p className="text-center text-red-700 text-xl bg-red-100 p-4 rounded-lg border border-red-300 font-poppins">
              {error}
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {products.map((product) => {
                // Show all products, even without images (ProductCard handles missing images)
                return (
                  <ProductCard
                    key={product.CID || product._id}
                    product={product}
                    onProductClick={handleProductClick}
                    isSelected={selectedProductId === (product.CID || product._id)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-xl bg-gray-100 p-4 rounded-lg border border-gray-300 font-poppins">
              No featured products available at the moment. Try a search!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
