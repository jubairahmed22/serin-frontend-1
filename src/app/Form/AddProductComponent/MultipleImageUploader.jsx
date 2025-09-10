"use client";

import React, { useCallback } from "react";
import { FiX } from "react-icons/fi";

const MultipleImageUploader = ({
  images,
  setImages,
  isDragging,
  isLoading,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
}) => {
  // Remove image by index
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Convert URL → File (safe with try/catch)
  const urlToFile = async (url, filename = "pasted-image.jpg") => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Failed to fetch image");
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.error("CORS blocked image fetch:", err);
      alert("❌ Cannot paste this image due to CORS. Try saving it first.");
      return null;
    }
  };

  // Handle paste (files + URLs)
  const handlePaste = useCallback(
    async (e) => {
      const items = e.clipboardData?.items;

      // Case 1: Direct image file (screenshots, copied images)
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              setImages((prev) => [...prev, file]);
              return;
            }
          }
        }
      }

      // Case 2: Pasted image URL
      const text = e.clipboardData.getData("text/plain");
      if (text && text.startsWith("http")) {
        const file = await urlToFile(text);
        if (file) setImages((prev) => [...prev, file]);
      }
    },
    [setImages]
  );

  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Upload Multiple Images
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 h-44 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste} // ✅ handle paste
        tabIndex={0} // ✅ required so div can receive paste events
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Processing images...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-64">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 mb-2">
              Drag & drop, paste (Ctrl+V), or click to select
            </p>
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
              Browse Files
            </label>
          </div>
        )}
        {images.length > 0 && (
          <div className="mt-2">
            <input
              type="file"
              id="fileInputImageMore"
              className="hidden"
              multiple
              accept="image/*, .heic, .heif"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInputImageMore"
              className="text-blue-600 underline cursor-pointer text-sm hover:text-blue-700"
            >
              Add more images
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleImageUploader;
