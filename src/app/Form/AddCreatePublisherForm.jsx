"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import heic2any from "heic2any";

const AddCreatePublisherForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]); // For multiple images
  const [singleImage, setSingleImage] = useState(null); // For single image
  const [showWebsite, setShowWebsite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(""); // Added description state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const formData = new FormData();

    formData.append("title", title);
    formData.append("showWebsite", showWebsite);
    formData.append("description", description); // Added description to form data

    images.forEach((image) => {
      formData.append("images", image);
    });

    if (singleImage) {
      formData.append("singleImage", singleImage);
    }

    try {
      const response = await axios.post(
        "https://books-server-001.vercel.app/api/admin/upload/create-publisher",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Product added successfully:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Product uploaded successfully.",
        icon: "success",
        timer: 1500, // Auto-close after 1.5 seconds
        showConfirmButton: false, // No "OK" button
      }).then(() => {
        // Close the modal after user acknowledges the success message
        onClose();
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Product Upload Failed");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isLoadingSingleImage, setIsLoadingSingleImage] = useState(false); // Loading state for single image
  const [isLoadingImages, setIsLoadingImages] = useState(false); // Loading state for multiple images

  // Handle drag over for single image
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave for single image
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle file drop for single image
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFile(file, setIsLoadingSingleImage, setSingleImage); // Handle the file (convert if necessary)
      e.dataTransfer.clearData();
    }
  };

  // Handle file selection for single image
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFile(file, setIsLoadingSingleImage, setSingleImage);
    }
  };

  // Handle file processing (single or multiple)
  const handleFile = async (file, setIsLoading, setImageState) => {
    setIsLoading(true); // Start loading

    try {
      // Check if the file is HEIC/HEIF
      if (
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        // Convert HEIC to JPEG
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8, // Adjust quality as needed
        });

        // Create a new File object with the converted blob
        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.heic$|\.heif$/i, ".jpeg"),
          {
            type: "image/jpeg",
          }
        );

        setImageState(convertedFile);
      } else {
        // If it's not HEIC, use the file as-is
        setImageState(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-5 dark:text-black">
      {/* Tab Content */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col">
          {/* Left Column - Form Fields */}
          <div className="flex flex-row gap-5">
            {/* Title Input */}
            <div className="w-[60%]">
              <label className="block text-sm fontPoppins   text-gray-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter category title"
                  required
                />
              </div>
            </div>

            {/* Show Website Toggle */}
            <div className="w-[40%] flex items-center">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="showWebsite"
                  checked={showWebsite}
                  onChange={() => setShowWebsite(!showWebsite)}
                  className="w-4 h-4 fontPoppins text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <label
                htmlFor="showWebsite"
                className="ml-3 text-sm fontPoppins   text-gray-800"
              >
                Show on website
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm fontPoppins text-gray-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter author description"
              rows="4"
              required
            />
          </div>
          {/* Right Column - Image Upload */}
          <div className="space-y-6 mt-5">
            <div>
              <label className="block text-sm fontPoppins   text-gray-800 mb-2">
                Featured Image
              </label>
              <div
                className={`relative bg-white border-2 border-dashed rounded-xl p-6 h-64 flex flex-col items-center justify-center transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isLoadingSingleImage ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm fontPoppins  text-gray-500">
                      Uploading image...
                    </p>
                  </div>
                ) : singleImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={URL.createObjectURL(singleImage)}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setSingleImage(null)}
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
                    <div className="mt-2 flex text-sm fontPoppins  text-gray-600">
                      <label
                        htmlFor="fileInput"
                        className="relative cursor-pointer bg-white rounded-md  text-blue-600 hover:text-blue-500 focus-within:outline-none"
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
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 w-56">
          <button
            type="submit"
            disabled={isLoading}
            className={` cursor-pointer sm:w-auto px-4 text-sm fontPoppins py-3 border border-transparent  rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </span>
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCreatePublisherForm;
