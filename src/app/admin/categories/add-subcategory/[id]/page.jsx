"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import heic2any from "heic2any";

const EditSubCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;

  const [formData, setFormData] = useState({
    title: "",
    showWebsite: false,
  });

  const [singleImage, setSingleImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingSingleImage, setIsLoadingSingleImage] = useState(false);

  // New state for categories and selected category
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      try {
        const response = await axios.get(
          "https://books-server-001.vercel.app/api/admin/category"
        );
        setCategories(response.data.products);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://books-server-001.vercel.app/api/admin/sub-category/${categoryId}`
        );
        const category = response.data;
        setFormData({
          title: category.title,
          showWebsite: category.showWebsite,
        });
        setExistingImage(category.singleImage || "");

        // Set the parent category if it exists
        if (category.parentCategory) {
          setSelectedCategory({
            _id: category.parentCategory.id,
            title: category.parentCategory.title,
          });
        }
      } catch (err) {
        setError(err.message);
        Swal.fire(
          "Error!",
          err.response?.data?.error || "Failed to fetch category details",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFile(file, setIsLoadingSingleImage, setSingleImage);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFile(file, setIsLoadingSingleImage, setSingleImage);
    }
  };

  const handleFile = async (file, setIsLoading, setImageState) => {
    setIsLoading(true);
    try {
      if (
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });

        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.heic$|\.heif$/i, ".jpeg"),
          {
            type: "image/jpeg",
          }
        );

        setImageState(convertedFile);
      } else {
        setImageState(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedCategory) {
      Swal.fire("Error!", "Please select a parent category", "error");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("showWebsite", formData.showWebsite.toString());
      formDataToSend.append("categoryId", selectedCategory._id);
      formDataToSend.append("categoryTitle", selectedCategory.title);

      if (singleImage) {
        formDataToSend.append("singleImage", singleImage);
      }

      const response = await axios.put(
        `https://books-server-001.vercel.app/api/admin/update/sub-categoryyy/${categoryId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Success!", "Category updated successfully!", "success").then(
        () => {
          router.push("/admin/categories/add-subcategory");
        }
      );
    } catch (err) {
      setError(err.message);
      Swal.fire(
        "Error!",
        err.response?.data?.error || "Failed to update category",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSingleImage(null);
    setExistingImage("");
    setError(null);
  };

  if (isLoading && !formData.title) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="fontPoppins p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/categories/add-category"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Categories
        </Link>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Sub Category
        </h1>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex flex-col gap-5">
            {/* Parent Category Select */}
            <div className="w-full">
              <label className="block text-sm fontPoppins text-gray-800 mb-1">
                Parent Category <span className="text-red-500">*</span>
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
                    value={selectedCategory?._id || ""}
                    onChange={(e) => {
                      const selected = categories.find(
                        (cat) => cat._id === e.target.value
                      );
                      setSelectedCategory(selected);
                    }}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                    <option value="">Select a parent category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-5">
              {/* Title Input */}
              <div className="w-[60%]">
                <label className="block text-sm fontPoppins text-gray-800 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
                    name="showWebsite"
                    checked={formData.showWebsite}
                    onChange={handleChange}
                    className="w-4 h-4 fontPoppins text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <label
                  htmlFor="showWebsite"
                  className="ml-3 text-sm fontPoppins text-gray-800"
                >
                  Show on website
                </label>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6 mt-5">
              <div>
                <label className="block text-sm fontPoppins text-gray-800 mb-2">
                  Featured Image
                </label>
                <div
                  className={`relative cursor-pointer bg-white border-2 border-dashed rounded-xl p-6 h-64 flex flex-col items-center justify-center transition-all ${
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
                      <p className="text-sm fontPoppins text-gray-500">
                        Processing image...
                      </p>
                    </div>
                  ) : singleImage || existingImage ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={
                          singleImage
                            ? URL.createObjectURL(singleImage)
                            : existingImage
                        }
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
                        PNG, JPG, GIF, WEBP, HEIC up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 w-56">
            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer sm:w-auto px-4 text-sm fontPoppins py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
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
                  Updating...
                </span>
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubCategoryPage;
