/**
 * Visual search page component.
 *
 * Allows users to search for products using either:
 * - Image upload (visual similarity search)
 * - Text query (text-based search)
 */

import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Search,
  ArrowLeft,
  Loader2,
  X,
  Text,
  Info,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = 'http://localhost:5000';

/**
 * Visual search page component.
 * @param {Object} props - Component props
 * @param {Function} props.setCurrentPage - Function to change current page
 * @returns {JSX.Element} Visual search page
 */
const VisualSearchPage = ({ setCurrentPage }) => {
  const { accessToken } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [textQuery, setTextQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  /**
   * Reset search results when search parameters change.
   */
  useEffect(() => {
    if (searchInitiated) {
      setSearchResults([]);
      setError(null);
    }
  }, [selectedFile, textQuery, searchInitiated]);

  /**
   * Handle file selection for image upload.
   * @param {Event} event - File input change event
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTextQuery('');
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  /**
   * Handle text query input change.
   * @param {Event} event - Input change event
   */
  const handleTextQueryChange = (event) => {
    setTextQuery(event.target.value);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  /**
   * Execute search based on selected file or text query.
   */
  const executeSearch = async () => {
    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSearchInitiated(true);
    setSelectedProductId(null);

    try {
      let response;

      if (selectedFile) {
        // Visual search with image
        const formData = new FormData();
        formData.append('image', selectedFile);
        const headers = {};
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        response = await fetch(`${API_BASE_URL}/api/visual-search`, {
          method: 'POST',
          headers: headers,
          body: formData,
        });
      } else if (textQuery.trim() !== '') {
        // Text search
        const headers = {
          'Content-Type': 'application/json',
        };
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        response = await fetch(`${API_BASE_URL}/api/text-search`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ query: textQuery }),
        });
      } else {
        setError('Please select an image or enter a text query to start.');
        setLoading(false);
        return;
      }

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = 'Failed to perform search.';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Server responded with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      // Show all results, even without images (ProductCard handles missing images)
      const allResults = data.results || [];
      setSearchResults(allResults);

      if (!allResults || allResults.length === 0) {
        setError('No matching products found. Try a different image or query.');
      }
    } catch (err) {
      setError(`Error during search: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate back to home page.
   */
  const handleBackToHome = () => {
    setCurrentPage('home');
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

  const isSearchButtonDisabled =
    (!selectedFile && textQuery.trim() === '') || loading;

  return (
    <div className="home-background-container">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative z-10 w-full flex flex-col items-center min-h-screen p-4">
        <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100 flex flex-col items-center">
          <button
            onClick={handleBackToHome}
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center space-x-1"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium">Home</span>
          </button>

          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
            Find Your Style
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10 max-w-xl">
            Search for products using an image or by typing keywords.
          </p>

          <div className="w-full flex flex-col items-center space-y-6 mb-8">
            <div className="w-full">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all text-lg font-semibold"
              >
                <UploadCloud size={24} className="mr-3 text-blue-500" />
                {selectedFile ? 'Change Image' : 'Upload an Image'}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {previewUrl && (
                <div className="relative w-48 h-48 mx-auto mt-4 border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center shadow-md">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="relative my-4 w-full flex justify-center items-center">
              <hr className="absolute w-full border-t border-gray-300" />
              <span className="relative bg-white px-4 text-gray-500 text-sm font-semibold">
                OR
              </span>
            </div>

            <div className="w-full relative">
              <input
                type="text"
                value={textQuery}
                onChange={handleTextQueryChange}
                placeholder="Search by product name, category, brand..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 text-lg font-poppins"
              />
              <Text
                size={24}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              onClick={executeSearch}
              disabled={isSearchButtonDisabled}
              className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-xl rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-800 hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-3" size={28} />
              ) : (
                <Search size={28} className="mr-3" />
              )}
              {loading ? 'Searching...' : 'Find Products'}
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center h-48 w-full mt-4">
              <Loader2 className="animate-spin text-purple-600 w-16 h-16" />
              <p className="mt-6 text-gray-700 text-2xl font-medium font-poppins">
                Loading results...
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center w-full mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-lg font-poppins shadow-sm">
              <Info size={24} className="mr-3" />
              <p className="text-center">{error}</p>
            </div>
          )}

          {searchInitiated &&
            !loading &&
            !error &&
            searchResults.length === 0 && (
              <div className="flex items-center justify-center w-full mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-lg font-poppins shadow-sm">
                <Info size={24} className="mr-3" />
                <p className="text-center">
                  No products found. Try a different image or query!
                </p>
              </div>
            )}

          {searchResults.length > 0 && (
            <div className="w-full mt-10">
              <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-600">
                Your Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {searchResults.map((product) =>
                  product.cloudinary_url ? (
                    <ProductCard
                      key={product.CID || product._id}
                      product={product}
                      onProductClick={handleProductClick}
                      isSelected={
                        selectedProductId === (product.CID || product._id)
                      }
                    />
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualSearchPage;
