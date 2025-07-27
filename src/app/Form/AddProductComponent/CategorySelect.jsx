"use client";

import React from "react";

const CategorySelect = ({
  categories,
  isFetchingCategories,
  selectedCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm fontPoppins dark:text-black text-gray-800 mb-1">
        Select Category <span className="text-red-500">*</span>
      </label>
      <div className="relative rounded-md shadow-sm">
        {isFetchingCategories ? (
          <div className="flex items-center justify-center py-3 border border-gray-300 rounded-lg">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2">Loading categories...</span>
          </div>
        ) : (
          <select
            value={selectedCategory?._id || ""}
            onChange={(e) => {
              const selected = categories.find(
                (cat) => cat._id === e.target.value
              );
              setSelectedCategory(selected);
              setSelectedSubCategory(null);
            }}
            className="block w-full px-4 py-3 border dark:text-black border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          >
            <option value="dark:text-black">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default CategorySelect;