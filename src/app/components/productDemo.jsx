"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import heic2any from "heic2any";

const productDemo = ({ onClose }) => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState(1);

  const [title, setTitle] = useState("");
  const [purchasePricing, setPurchasePricing] = useState("");
  const [flatFeePricing, setFlatFeePricing] = useState("");
  const [HourTime, setHourTime] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [contractDescription, setContractDescription] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [images, setImages] = useState([]); // For multiple images
  const [singleImage, setSingleImage] = useState(null); // For single image
  const [video, setVideo] = useState(null);
  const [model, setModel] = useState(""); // For model field
  const [categories, setCategories] = useState([]); // To store categories from API
  const [SubCategoryMain, setSubCategoryMain] = useState([]); // To store SubCategoryMain from API
  const [selectedCategory, setSelectedCategory] = useState(""); // To store selected category
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // To store selected Event
  const [color, setColor] = useState(""); // To store selected Event
  const [measurement, setMeasurement] = useState(""); // To store selected Event
  const [height, setHeight] = useState(""); // For the numeric value of the height
  const [perDayPricing, setPerDayPricing] = useState(""); // For the numeric value of the height
  const [length, setLength] = useState(""); // For the numeric value of the height
  const [width, setWidth] = useState(""); // For the numeric value of the height
  const [unit, setUnit] = useState("ft");
  const [lengthUnit, setLengthUnit] = useState("ft");
  const [widthUnit, setWidthUnit] = useState("ft");
  const [shape, setShape] = useState("");
  const [showWebsite, setShowWebsite] = useState(false);
  const [productCode, setProductCode] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [Promotion, setPromotion] = useState(false);
  const [promotionValue, setPromotionValue] = useState("");
  const [promotionType, setPromotionValueType] = useState("%");
  // Fetch categories and SubCategoryMain on component mount

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://server-gs.vercel.app/all-main-category"
        );
        setCategories(response.data); // Assuming the data is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubCategoryMain = async () => {
      try {
        const response = await axios.get(
          "https://server-gs.vercel.app/all-main-subCategory"
        );
        setSubCategoryMain(response.data); // Assuming the data is an array of SubCategoryMain
      } catch (error) {
        console.error("Error fetching SubCategoryMain:", error);
      }
    };

    fetchCategories();
    fetchSubCategoryMain();
  }, []);

  // Handle form submission
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Find the selected category object
    const selectedCategoryObj = categories.find(
      (cat) => cat._id === selectedCategory
    );
    // Find the selected subcategory object (if exists)
    const selectedSubCategoryObj = SubCategoryMain.find(
      (sub) => sub._id === selectedSubCategory
    );

    const formData = new FormData();
    const combinedHeight = `${height} ${unit}`;
    const combinedLength = `${length} ${lengthUnit}`;
    const combinedWidth = `${width} ${widthUnit}`;

    // Append all the existing fields
    formData.append("title", title);
    formData.append("quantity", quantity);
    formData.append("purchasePricing", purchasePricing);
    formData.append("flatFeePricing", flatFeePricing);
    formData.append("contractDescription", contractDescription);
    formData.append("productDescription", productDescription);
    formData.append("internalNotes", internalNotes);
    formData.append("model", model);
    formData.append("perDayPricing", perDayPricing);
    formData.append("showWebsite", showWebsite);

    // Append category data (both ID and title)
    formData.append("category", selectedCategory);
    formData.append("categoryTitle", selectedCategoryObj?.title || "");

    // Append subcategory data (both ID and title if exists)
    formData.append("subCategory", selectedSubCategory);
    if (selectedSubCategoryObj) {
      formData.append("subCategoryTitle", selectedSubCategoryObj.title);
    } else {
      formData.append("subCategoryTitle", "");
    }

    formData.append("height", combinedHeight);
    formData.append("length", combinedLength);
    formData.append("width", combinedWidth);
    formData.append("color", color);
    formData.append("measurement", measurement);
    formData.append("shape", shape);
    formData.append("productCode", productCode);
    formData.append("productLocation", productLocation);
    formData.append("Promotion", Promotion);
    formData.append("promotionValue", promotionValue);
    formData.append("promotionType", promotionType);

    images.forEach((image) => {
      formData.append("images", image);
    });

    if (singleImage) {
      formData.append("singleImage", singleImage);
    }
    if (video) {
      formData.append("video", video);
    }

    try {
      const response = await axios.post(
        "https://books-server-001.vercel.app/upload-products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Product added successfully:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Product uploaded successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        onClose();
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Product Upload Failed");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  // Function to handle tab switching
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
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
      await handleFile(file, setIsLoadingSingleImage, setSingleImage); // Handle the file (convert if necessary)
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

  // Handle file selection for multiple images
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoadingImages(true); // Start loading

      const files = Array.from(e.target.files);
      const convertedFiles = await Promise.all(
        files.map(async (file) => {
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
            return new File(
              [convertedBlob],
              file.name.replace(/\.heic$|\.heif$/i, ".jpeg"),
              {
                type: "image/jpeg",
              }
            );
          }
          return file;
        })
      );

      setImages((prevImages) => [...prevImages, ...convertedFiles]);
      setIsLoadingImages(false); // Stop loading
    }
  };

  // Handle file drop for multiple images
  const handleDropImages = async (e) => {
    e.preventDefault();
    setIsDraggingImages(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsLoadingImages(true); // Start loading

      const files = Array.from(e.dataTransfer.files);
      const convertedFiles = await Promise.all(
        files.map(async (file) => {
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
            return new File(
              [convertedBlob],
              file.name.replace(/\.heic$|\.heif$/i, ".jpeg"),
              {
                type: "image/jpeg",
              }
            );
          }
          return file;
        })
      );

      setImages((prevImages) => [...prevImages, ...convertedFiles]);
      setIsLoadingImages(false); // Stop loading
    }
  };

  // Handle drag over for multiple images
  const handleDragOverImages = (e) => {
    e.preventDefault();
    setIsDraggingImages(true);
  };

  // Handle drag leave for multiple images
  const handleDragLeaveImages = () => {
    setIsDraggingImages(false);
  };

  // Remove an image from the multiple images list
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6  min-h-screen">
      {/* Tab Content */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title Input */}
            <div className="flex flex-col">
              <label className="text-lg font-roboto text-black mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Category Select */}
              <div className="flex flex-col">
                <label className="text-lg font-roboto text-black mb-2">
                  Choose Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Sub Category Select only if subcategories exist for the selected category */}
              {SubCategoryMain.some(
                (sub) => sub.categoryObjectId === selectedCategory
              ) && (
                <div className="flex flex-col">
                  <label className="text-lg font-roboto text-black mb-2">
                    Sub Category
                  </label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select a Sub Category</option>
                    {SubCategoryMain.filter(
                      (sub) => sub.categoryObjectId === selectedCategory
                    ).map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Quantity Input */}
              <div className="flex flex-col">
                <label className="text-lg font-roboto text-black mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setQuantity(null);
                    } else {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue) && numberValue >= 0) {
                        setQuantity(numberValue);
                      }
                    }
                  }}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {/* Per Day Pricing Input */}
              <div className="flex flex-col">
                <label className="text-lg font-roboto text-black mb-2">
                  Per Day Pricing
                </label>
                <input
                  type="number"
                  value={perDayPricing ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setPerDayPricing(null);
                    } else {
                      const numberValue = Number(value);
                      if (!isNaN(numberValue) && numberValue >= 0) {
                        setPerDayPricing(numberValue);
                      }
                    }
                  }}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter per day pricing"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {/* Product Code Input */}
              <div className="flex flex-col">
                <label className="text-lg font-roboto text-black mb-2">
                  Product Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter product code"
                  required
                />
              </div>

              {/* Product Location Input */}
              <div className="flex flex-col">
                <label className="text-lg font-roboto text-black mb-2">
                  Product Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={productLocation}
                  onChange={(e) => setProductLocation(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter product location"
                  required
                />
              </div>
            </div>

            {/* Show Website Checkbox */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="showWebsite"
                checked={showWebsite}
                onChange={() => setShowWebsite(!showWebsite)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
              />
              <label
                htmlFor="showWebsite"
                className="ml-3 text-black font-medium"
              >
                Show website
              </label>
            </div>

            <div className="flex flex-col mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="Promotion"
                  checked={Promotion}
                  onChange={() => setPromotion(!Promotion)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                />
                <label
                  htmlFor="Promotion"
                  className="ml-3 text-black font-medium"
                >
                  Show Promotion
                </label>
              </div>

              {Promotion && (
                <div className="flex flex-col space-y-2 mt-2">
                  <label className="text-lg font-roboto text-black ">
                    Add Promotion Discount:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={promotionValue}
                      onChange={(e) => setPromotionValue(e.target.value)}
                      className="border w-[30%] border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Enter promotion discount"
                    />

                    <select
                      value={promotionType}
                      onChange={(e) => setPromotionValueType(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-2 bg-white cursor-pointer focus:outline-none"
                    >
                      <option value="%">%</option>
                      <option value="$">$</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Attributes Table */}
            <div>
              <h2 className="text-lg font-roboto text-black mb-2">
                Attributes
              </h2>
              <div className="overflow-x-auto border border-gray-300 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Attribute
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Color Input */}
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 text-left font-medium text-gray-900 whitespace-nowrap"
                      >
                        <label className="text-sm text-black font-roboto">
                          Color
                        </label>
                      </th>
                      <td className="px-6 py-4">
                        <input
                          className="border border-gray-300 bg-white h-10 w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="Enter color"
                        />
                      </td>
                    </tr>

                    {/* Height Input */}
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap"
                      >
                        <label className="text-sm text-black font-roboto">
                          Height
                        </label>
                      </th>
                      <td className="px-6 py-4 flex flex-row gap-2">
                        <input
                          className="border border-gray-300 bg-white h-10 w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          type="number"
                          value={height ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setHeight(null);
                            } else {
                              const numberValue = Number(value);
                              if (!isNaN(numberValue) && numberValue >= 0) {
                                setHeight(numberValue);
                              }
                            }
                          }}
                          placeholder="Enter height"
                        />
                        <select
                          id="unit"
                          className="block w-20 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                        >
                          <option value="ft">ft.</option>
                          <option value="in">in.</option>
                          <option value="cm">cm.</option>
                        </select>
                      </td>
                    </tr>

                    {/* Length Input */}
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap"
                      >
                        <label className="text-sm text-black font-roboto">
                          Length
                        </label>
                      </th>
                      <td className="px-6 py-4 flex flex-row gap-2">
                        <input
                          className="border border-gray-300 bg-white h-10 w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          type="number"
                          value={length ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setLength(null);
                            } else {
                              const numberValue = Number(value);
                              if (!isNaN(numberValue) && numberValue >= 0) {
                                setLength(numberValue);
                              }
                            }
                          }}
                          placeholder="Enter length"
                        />
                        <select
                          id="unit"
                          className="block w-20 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={lengthUnit}
                          onChange={(e) => setLengthUnit(e.target.value)}
                        >
                          <option value="ft">ft.</option>
                          <option value="in">in.</option>
                          <option value="cm">cm.</option>
                        </select>
                      </td>
                    </tr>

                    {/* Width Input */}
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap"
                      >
                        <label className="text-sm text-black font-roboto">
                          Width
                        </label>
                      </th>
                      <td className="px-6 py-4 flex flex-row gap-2">
                        <input
                          className="border border-gray-300 bg-white h-10 w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          type="number"
                          value={width ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setWidth(null);
                            } else {
                              const numberValue = Number(value);
                              if (!isNaN(numberValue) && numberValue >= 0) {
                                setWidth(numberValue);
                              }
                            }
                          }}
                          placeholder="Enter width"
                        />
                        <select
                          id="unit"
                          className="block w-20 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={widthUnit}
                          onChange={(e) => setWidthUnit(e.target.value)}
                        >
                          <option value="ft">ft.</option>
                          <option value="in">in.</option>
                          <option value="cm">cm.</option>
                        </select>
                      </td>
                    </tr>

                    {/* Measurement Input */}
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap"
                      >
                        <label className="text-sm text-black font-roboto">
                          Measurement
                        </label>
                      </th>
                      <td className="px-6 py-4">
                        <input
                          className="border border-gray-300 bg-white h-10 w-full rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          type="text"
                          value={measurement}
                          onChange={(e) => setMeasurement(e.target.value)}
                          placeholder="Enter measurement"
                        />
                      </td>
                    </tr>

                    {/* Shape Select */}
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-left text-gray-900 whitespace-nowrap"
                      >
                        <label className="text-sm text-black font-roboto">
                          Shape
                        </label>
                      </th>
                      <td className="px-6 py-4">
                        <select
                          id="shape"
                          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={shape}
                          onChange={(e) => setShape(e.target.value)}
                        >
                          <option value="other">Other</option>
                          <option value="rectangle">Rectangle</option>
                          <option value="round">Round</option>
                          <option value="square">Square</option>
                          <option value="serpentine">Serpentine</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-lg font-roboto text-black mb-2">
                Contract Description
              </label>
              <textarea
                value={contractDescription}
                onChange={(e) => setContractDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-roboto text-black mb-2">
                Product Description
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-roboto text-black mb-2">
                Internal Notes
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Single Image Upload Section */}
            <div className="flex flex-col h-[50%]">
              <label className="text-lg font-roboto text-black mb-2">
                Upload Single Image
              </label>
              <div
                className={`border-2  border-dashed rounded-lg p-8 h-full text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 bg-white"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isLoadingSingleImage ? (
                  <div className="flex flex-col items-center">
                    {/* Spinning Loader */}
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Processing image...</p>
                  </div>
                ) : singleImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(singleImage)}
                      alt="Selected"
                      className="w-32 h-32 object-cover mb-4 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setSingleImage(null)}
                      className="text-sm text-red-600 underline"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Drag & drop a file here or click to select
                  </p>
                )}
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*, .heic, .heif"
                />
                <label
                  htmlFor="fileInput"
                  className="mt-2 inline-block text-blue-600 underline cursor-pointer"
                >
                  Browse File
                </label>
              </div>
            </div>

            {/* Multiple Images Upload Section */}
            <div className="flex flex-col h-[50%]">
              <label className="text-lg font-roboto text-black mb-2">
                Upload Multiple Images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 h-full text-center transition-colors ${
                  isDraggingImages
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
                onDragOver={handleDragOverImages}
                onDragLeave={handleDragLeaveImages}
                onDrop={handleDropImages}
              >
                {isLoadingImages ? (
                  <div className="flex flex-col items-center">
                    {/* Spinning Loader */}
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Processing images...</p>
                  </div>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Drag & drop files here or click to select
                  </p>
                )}
                <input
                  type="file"
                  id="fileInputImage"
                  className="hidden"
                  multiple
                  accept="image/*, .heic, .heif"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="fileInputImage"
                  className="mt-2 inline-block text-blue-600 underline cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 w-56">
          <button
            type="submit"
            className="w-full h-16 py-3 font-roboto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex flex-row gap-4 items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8h4l-3-3-3 3h4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default productDemo;
