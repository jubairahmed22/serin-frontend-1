"use client";

import React from "react";

const ImageUploaderUpdate = ({
  isDragging,
  isLoading,
  image,
  existingImage,
  setImage,
  removeImage,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  label = "Featured Image",
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}
      </label>
      <div
        className={`relative bg-white border-2 border-dashed rounded-xl p-6 h-44 flex flex-col items-center justify-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm fontPoppins text-gray-500">
              Uploading image...
            </p>
          </div>
        ) : image || existingImage ? (
          <div className="relative w-full h-full group">
            <img
              src={image ? URL.createObjectURL(image) : existingImage}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-2 flex text-sm fontPoppins text-gray-600">
              <label
                htmlFor="fileInput"
                className="relative cursor-pointer bg-white rounded-md text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload a file</span>
                <input
                  id="fileInput"
                  name="fileInput"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*, .heic, .heif"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>
      {existingImage && !image && (
        <p className="mt-1 text-sm text-gray-500">Current image</p>
      )}
    </div>
  );
};

export default ImageUploaderUpdate;