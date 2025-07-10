"use client";

import React from "react";

const SubCategorySelect = ({
  subCategories,
  isFetchingSubCategories,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedCategory,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm fontPoppins text-gray-800 mb-1">
        Select Sub-Category <span className="text-red-500">*</span>
      </label>
      <div className="relative rounded-md shadow-sm">
        {isFetchingSubCategories ? (
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
            <span className="ml-2">Loading sub-categories...</span>
          </div>
        ) : (
          <select
            value={selectedSubCategory?._id || ""}
            onChange={(e) => {
              const selected = subCategories.find(
                (subCat) => subCat._id === e.target.value
              );
              setSelectedSubCategory(selected);
            }}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
            disabled={!selectedCategory || subCategories.length === 0}
          >
            <option value="">Select a sub-category</option>
            {subCategories.length > 0 ? (
              subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.title}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No sub-categories available for this category
              </option>
            )}
          </select>
        )}
      </div>
    </div>
  );
};

export default SubCategorySelect;