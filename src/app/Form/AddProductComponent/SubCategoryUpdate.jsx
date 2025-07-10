"use client";

import React, { useEffect } from "react";

const SubCategoryUpdate = ({
  subCategories,
  isFetchingSubCategories,
  selectedSubCategory,
  setSelectedSubCategory,
  setSelectedChildCategory,
  selectedCategory,
  formData,
  setFormData
}) => {
  // Improved auto-selection logic
  useEffect(() => {
    if (formData.subCategoryId && subCategories.length > 0) {
      // Only set if not already set or if the current selection doesn't match
      if (!selectedSubCategory || selectedSubCategory._id !== formData.subCategoryId) {
        const subCategory = subCategories.find(sub => sub._id === formData.subCategoryId);
        if (subCategory) {
          setSelectedSubCategory(subCategory);
        }
      }
    }
  }, [subCategories, formData.subCategoryId, selectedSubCategory, setSelectedSubCategory]);

  const handleSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selected = subCategories.find(sub => sub._id === selectedId);
    
    setSelectedSubCategory(selected);
    setSelectedChildCategory(null);
    
    setFormData({
      ...formData,
      subCategoryId: selected?._id || "",
      subCategoryTitle: selected?.title || "",
      childCategoryId: "",
      childCategoryTitle: ""
    });
  };

  // Get the current value to display
  const currentValue = selectedSubCategory?._id || formData.subCategoryId || "";

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <span className="ml-2 text-sm text-gray-600">Loading sub-categories...</span>
          </div>
        ) : (
          <>
            <select
              value={currentValue}
              onChange={handleSubCategoryChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
              disabled={!selectedCategory || isFetchingSubCategories}
            >
              <option value="">{selectedCategory ? "Select a sub-category" : "Select a category first"}</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.title}
                </option>
              ))}
            </select>
            
            {subCategories.length === 0 && selectedCategory && (
              <p className="mt-1 text-sm text-gray-500">
                No sub-categories available for this category
              </p>
            )}
          </>
        )}
      </div>
      
      {(selectedSubCategory || formData.subCategoryTitle) && (
        <p className="mt-1 text-sm text-gray-500">
          Current: {selectedSubCategory?.title || formData.subCategoryTitle}
        </p>
      )}
    </div>
  );
};

export default SubCategoryUpdate;