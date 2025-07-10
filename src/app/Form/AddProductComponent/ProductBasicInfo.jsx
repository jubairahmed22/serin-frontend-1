"use client";

import React, { useState, useRef, useEffect } from "react";

const ProductBasicInfo = ({
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

  const handleAuthorChange = (e) => {
    const selectedAuthorId = e.target.value;
    const selectedAuthor = authors.find(
      (author) => author._id === selectedAuthorId
    );
    setFormData({
      ...formData,
      author: selectedAuthor ? selectedAuthor.title : "",
      authorId: selectedAuthorId,
    });
  };

  const toggleTagDropdown = () => {
    setIsTagDropdownOpen(!isTagDropdownOpen);
  };

  const handleTagChange = (tagId) => {
    const currentTagIds = formData.tagIds || [];
    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter((id) => id !== tagId) // Remove if already selected
      : [...currentTagIds, tagId]; // Add if not selected

    const selectedTags = tags.filter((tag) => newTagIds.includes(tag._id));

    setFormData({
      ...formData,
      tags: selectedTags.map((tag) => tag.title).join(", "),
      tagIds: newTagIds,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter product title"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.authorId || ""}
              onChange={handleAuthorChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isFetchingAuthors}
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-32"
            placeholder="Enter product description"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock || ""}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div className="w-full flex items-center">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="showWebsite"
              checked={showWebsite}
              onChange={() => setShowWebsite(!showWebsite)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <label
            htmlFor="showWebsite"
            className="ml-3 text-sm font-medium text-gray-800"
          >
            Show on website
          </label>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Tags
        </label>
        <button
          type="button"
          onClick={toggleTagDropdown}
          className="flex justify-between items-center w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-left"
          disabled={isFetchingTags}
        >
          <span>
            {formData.tagIds?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags
                  .filter((tag) => formData.tagIds.includes(tag._id))
                  .map((tag) => (
                    <span
                      key={tag._id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag.title}
                      <button
                        type="button"
                        onClick={() => handleTagChange(tag._id)}
                        className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                      >
                        <span className="sr-only">Remove tag</span>
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isTagDropdownOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isTagDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
            {tags.map((tag) => (
              <div
                key={tag._id}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTagChange(tag._id)}
              >
                <input
                  type="checkbox"
                  checked={formData.tagIds?.includes(tag._id) || false}
                  readOnly
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 block truncate">{tag.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBasicInfo;
