"use client";

import React, { useEffect } from "react";

const CategorySelectUpdate = ({
  categories,
  isFetchingCategories,
  selectedCategory,
  setSelectedCategory,
  setSelectedSubCategory,
  setSelectedChildCategory,
  formData,
  setFormData,
}) => {
  // Auto-select the category if formData has categoryId but selectedCategory isn't set
  useEffect(() => {
    if (formData.categoryId && !selectedCategory && categories.length > 0) {
      const category = categories.find(cat => cat._id === formData.categoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [categories, formData.categoryId, selectedCategory, setSelectedCategory]);

  return (
    <div className="w-full">
      <label className="block text-sm fontPoppins text-gray-800 mb-1">
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
            value={selectedCategory?._id || formData.categoryId || ""}
            onChange={(e) => {
              const selected = categories.find(
                (cat) => cat._id === e.target.value
              );
              setSelectedCategory(selected);
              setSelectedSubCategory(null);
              setSelectedChildCategory(null);
              
              setFormData({
                ...formData,
                categoryId: selected?._id || "",
                categoryTitle: selected?.title || "",
                subCategoryId: "",
                subCategoryTitle: "",
                childCategoryId: "",
                childCategoryTitle: ""
              });
            }}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        )}
      </div>
      {(selectedCategory || formData.categoryTitle) && (
        <p className="mt-1 text-sm text-gray-500">
          Current: {selectedCategory?.title || formData.categoryTitle}
        </p>
      )}
    </div>
  );
};

export default CategorySelectUpdate;