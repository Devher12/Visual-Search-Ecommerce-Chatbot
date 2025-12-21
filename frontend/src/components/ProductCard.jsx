/**
 * Product card component.
 *
 * Displays product information in a card format with expandable details.
 * Shows similarity score for visual search results.
 */

import React, { useState } from 'react';
import { Hash } from 'lucide-react';

/**
 * Product card component.
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data object
 * @param {Function} props.onProductClick - Callback when card is clicked
 * @param {boolean} props.isSelected - Whether this card is currently selected
 * @returns {JSX.Element} Product card component
 */
const ProductCard = ({ product, onProductClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    title = 'Unknown Product',
    cloudinary_url,
    category = 'N/A',
    SubCategory = 'N/A',
    CID,
    gender,
    material,
    closure,
    toe_style,
    heel_height,
    insole,
    similarity,
  } = product || {};

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out
                   hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer border border-gray-200
                   w-full group
                   ${isSelected ? 'scale-105 shadow-2xl ring-2 ring-blue-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProductClick(CID)}
    >
      <div className="relative w-full h-48 flex items-center justify-center bg-gray-100 overflow-hidden">
        {cloudinary_url ? (
          <img
            src={cloudinary_url}
            alt={title}
            className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-110"
            onError={(event) => {
              event.target.onerror = null;
              event.target.src =
                'https://placehold.co/200x200/e0e0e0/555555?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
            No Image
          </div>
        )}

      {!isSelected && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4
                         transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <h3 className="text-white text-lg font-semibold text-center leading-tight drop-shadow-md">
            {title}
          </h3>
        </div>
      )}
      </div>

      {isSelected && (
        <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
          <h3 className="text-lg font-bold text-gray-800 mb-1 truncate leading-tight font-montserrat">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mb-0.5 font-poppins">
            <span className="font-semibold">Category:</span> {category}
          </p>
          <p className="text-xs text-gray-600 mb-2 font-poppins">
            <span className="font-semibold">SubCategory:</span> {SubCategory}
          </p>

          {gender && (
            <p className="text-xs text-gray-600 font-poppins">
              <span className="font-semibold">Gender:</span> {gender}
            </p>
          )}
          {material && (
            <p className="text-xs text-gray-600 font-poppins">
              <span className="font-semibold">Material:</span> {material}
            </p>
          )}
          {closure && (
            <p className="text-xs text-gray-600 font-poppins">
              <span className="font-semibold">Closure:</span> {closure}
            </p>
          )}
          {toe_style && (
            <p className="text-xs text-gray-600 font-poppins">
              <span className="font-semibold">Toe Style:</span> {toe_style}
            </p>
          )}
          {heel_height && (
            <p className="text-xs text-gray-600 font-poppins">
              <span className="font-semibold">Heel Height:</span> {heel_height}
            </p>
          )}
          {insole && (
            <p className="text-xs text-gray-600 font-poppins">
              <span className="font-semibold">Insole:</span> {insole}
            </p>
          )}

          {similarity !== undefined &&
            similarity !== null &&
            similarity > 0 && (
              <p className="text-xs text-gray-800 mt-2 font-semibold font-poppins flex items-center">
                <Hash size={14} className="mr-1 text-orange-500" />
                Similarity: {(similarity * 100).toFixed(2)}%
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
