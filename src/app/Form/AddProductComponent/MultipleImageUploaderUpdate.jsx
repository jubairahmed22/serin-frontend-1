"use client";

import React from "react";
import { FiX } from "react-icons/fi";

const MultipleImageUploaderUpdate = ({
  images,
  existingImages = [],
  setImages,
  removeExistingImage,
  isDragging,
  isLoading,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
}) => {
  const removeNewImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Product Images
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-44">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Processing images...</p>
          </div>
        ) : (
          <>
            {(existingImages.length > 0 || images.length > 0) && (
              <div className="grid grid-cols-3 gap-2 mb-4 max-h-64 overflow-y-auto">
                {/* Existing Images */}
                {existingImages.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`existing-${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      Current
                    </div>
                  </div>
                ))}

                {/* Newly Uploaded Images */}
                {images.map((image, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`preview-${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FiX size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-50 text-white text-xs p-1 truncate">
                      New
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div className="flex flex-col items-center justify-center border-t pt-4">
              <input
                type="file"
                id="fileInputImage"
                className="hidden"
                multiple
                accept="image/*, .heic, .heif"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInputImage"
                className="text-blue-600 underline cursor-pointer hover:text-blue-700"
              >
                {existingImages.length > 0 || images.length > 0
                  ? "Add more images"
                  : "Drag & drop files here or click to select"}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB each
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MultipleImageUploaderUpdate;