"use client";

import React from "react";

const ProductSpecifications = ({
  formData,
  setFormData,
  publishers,
  isFetchingPublishers,
}) => {
  const handlePublisherChange = (e) => {
    const selectedPublisherId = e.target.value;
    const selectedPublisher = publishers.find(
      (publisher) => publisher._id === selectedPublisherId
    );
    
    setFormData({
      ...formData,
      publisher: selectedPublisher ? selectedPublisher.title : "",
      publisherId: selectedPublisherId,
    });
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-5 ">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Edition
        </label>
        <input
          type="text"
          value={formData.edition || ""}
          onChange={(e) =>
            setFormData({ ...formData, edition: e.target.value })
          }
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter edition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Number of Pages
        </label>
        <input
          type="number"
          value={formData.numberOfPages || ""}
          onChange={(e) =>
            setFormData({ ...formData, numberOfPages: e.target.value })
          }
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter number of pages"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Language
        </label>
        <input
          type="text"
          value={formData.language || ""}
          onChange={(e) =>
            setFormData({ ...formData, language: e.target.value })
          }
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter language"
        />
      </div>

        <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Publisher
        </label>
        <select
          value={formData.publisherId || ""}
          onChange={handlePublisherChange}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          disabled={isFetchingPublishers}
        >
          <option value="">Select Publisher</option>
          {publishers.map((publisher) => (
            <option key={publisher._id} value={publisher._id}>
              {publisher.title}
            </option>
          ))}
        </select>
        {/* Show currently selected publisher */}
        {formData.publisherId && (
          <p className="mt-1 text-sm text-gray-500">
            Current publisher: {formData.publisher}
          </p>
        )}
        {isFetchingPublishers && (
          <p className="mt-1 text-sm text-gray-500">Loading publishers...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Country
        </label>
        <input
          type="text"
          value={formData.country || ""}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter country"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Weight (grams)
        </label>
        <input
          type="number"
          value={formData.weight || ""}
          onChange={(e) =>
            setFormData({ ...formData, weight: e.target.value })
          }
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter weight in grams"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Rating (1-5)
        </label>
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={formData.rating || ""}
          onChange={(e) =>
            setFormData({ ...formData, rating: e.target.value })
          }
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter rating"
        />
      </div>
    </div>
  );
};

export default ProductSpecifications;