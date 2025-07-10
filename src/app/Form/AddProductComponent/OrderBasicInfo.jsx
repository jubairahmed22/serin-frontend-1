"use client";

import React, { useState, useRef, useEffect } from "react";

const OrderBasicInfo = ({
  formData,
  setFormData,
  showWebsite,
  setShowWebsite,
  authors,
  isFetchingAuthors,
  tags,
  isFetchingTags,
}) => {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              name <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter product name"
                required
              />
            </div>
          </div>


        </div>

      </div>

    
    </div>
  );
};

export default OrderBasicInfo;
