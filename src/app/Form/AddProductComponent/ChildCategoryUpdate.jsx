"use client";

import React, { useEffect } from "react";

const ChildCategoryUpdate = ({
  childCategories,
  isFetchingChildCategories,
  selectedChildCategory,
  setSelectedChildCategory,
  selectedSubCategory,
  formData,
  setFormData
}) => {
  // Auto-select the child category when data loads
  useEffect(() => {
    if (formData.childCategoryId && childCategories.length > 0) {
      // Only set if not already set or if the current selection doesn't match
      if (!selectedChildCategory || selectedChildCategory._id !== formData.childCategoryId) {
        const childCategory = childCategories.find(child => child._id === formData.childCategoryId);
        if (childCategory) {
          setSelectedChildCategory(childCategory);
        }
      }
    }
  }, [childCategories, formData.childCategoryId, selectedChildCategory, setSelectedChildCategory]);

  const handleChildCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selected = childCategories.find(child => child._id === selectedId);
    
    setSelectedChildCategory(selected);
    
    setFormData({
      ...formData,
      childCategoryId: selected?._id || "",
      childCategoryTitle: selected?.title || ""
    });
  };

  // Get the current value to display
  const currentValue = selectedChildCategory?._id || formData.childCategoryId || "";

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Child Category
      </label>
      
      <div className="relative rounded-md shadow-sm">
        {isFetchingChildCategories ? (
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
            <span className="ml-2 text-sm text-gray-600">Loading child categories...</span>
          </div>
        ) : (
          <>
            <select
              value={currentValue}
              onChange={handleChildCategoryChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              disabled={!selectedSubCategory || isFetchingChildCategories}
            >
              <option value="">{selectedSubCategory ? "Select a child category" : "Select a sub-category first"}</option>
              {childCategories.length > 0 ? (
                childCategories.map((childCategory) => (
                  <option key={childCategory._id} value={childCategory._id}>
                    {childCategory.title}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {selectedSubCategory ? "No child categories available" : ""}
                </option>
              )}
            </select>
          </>
        )}
      </div>
      
      {(selectedChildCategory || formData.childCategoryTitle) && (
        <p className="mt-1 text-sm text-gray-500">
          Current: {selectedChildCategory?.title || formData.childCategoryTitle}
        </p>
      )}
    </div>
  );
};

export default ChildCategoryUpdate;