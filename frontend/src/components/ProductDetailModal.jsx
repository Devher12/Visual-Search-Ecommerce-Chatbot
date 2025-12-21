/**
 * Product detail modal component.
 *
 * Displays detailed product information in a modal overlay.
 * Note: Currently not used in the application but kept for future use.
 */

import React from 'react';
import {
  X,
  ExternalLink,
  Tag,
  Ruler,
  Palette,
  Footprints,
  ChevronRight,
  Hash,
  DollarSign,
  Info,
} from 'lucide-react';

/**
 * Product detail modal component.
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data object
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element|null} Modal component or null if no product
 */
const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const {
    title = 'N/A',
    cloudinary_url,
    category = 'N/A',
    SubCategory = 'N/A',
    gender = 'N/A',
    material = 'N/A',
    closure = 'N/A',
    toe_style = 'N/A',
    heel_height = 'N/A',
    insole = 'N/A',
    distance,
    shopify_url,
    price,
  } = product;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-modal-overlay-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-modal-open"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50 rounded-l-xl">
            {cloudinary_url ? (
              <img
                src={cloudinary_url}
                alt={title}
                className="max-w-full h-64 md:h-80 object-contain rounded-md border border-gray-200 shadow-md"
                onError={(event) => {
                  event.target.onerror = null;
                  event.target.src =
                    'https://placehold.co/300x200/cccccc/333333?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-lg font-medium">
                No Image Available
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center md:text-left font-montserrat leading-tight">
                {title}
              </h2>

              <div className="text-gray-700 text-base space-y-2 mb-6">
                <p className="flex items-center">
                  <Tag size={18} className="mr-2 text-blue-500" />
                  <span className="font-semibold">Category:</span> {category}
                </p>
                <p className="flex items-center">
                  <ChevronRight size={18} className="mr-2 text-blue-500" />
                  <span className="font-semibold">SubCategory:</span>{' '}
                  {SubCategory}
                </p>
                <p className="flex items-center">
                  <Info size={18} className="mr-2 text-indigo-500" />
                  <span className="font-semibold">Gender:</span> {gender}
                </p>
                <p className="flex items-center">
                  <Palette size={18} className="mr-2 text-purple-500" />
                  <span className="font-semibold">Material:</span> {material}
                </p>
                <p className="flex items-center">
                  <Footprints size={18} className="mr-2 text-green-500" />
                  <span className="font-semibold">Closure:</span> {closure}
                </p>
                <p className="flex items-center">
                  <Info size={18} className="mr-2 text-yellow-600" />
                  <span className="font-semibold">Toe Style:</span> {toe_style}
                </p>
                <p className="flex items-center">
                  <Ruler size={18} className="mr-2 text-red-500" />
                  <span className="font-semibold">Heel Height:</span>{' '}
                  {heel_height}
                </p>
                <p className="flex items-center">
                  <Info size={18} className="mr-2 text-teal-500" />
                  <span className="font-semibold">Insole:</span> {insole}
                </p>
                {distance && (
                  <p className="flex items-center">
                    <Hash size={18} className="mr-2 text-gray-500" />
                    <span className="font-semibold">Distance:</span>{' '}
                    {distance.toFixed(2)}
                  </p>
                )}
                {price && (
                  <p className="flex items-center">
                    <DollarSign size={18} className="mr-2 text-green-600" />
                    <span className="font-semibold">Price:</span> $
                    {price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {shopify_url && (
              <div className="mt-6 text-center">
                <a
                  href={shopify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  View on Shopify <ExternalLink size={20} className="ml-2" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
