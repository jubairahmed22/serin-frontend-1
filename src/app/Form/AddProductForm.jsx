"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import heic2any from "heic2any";
import CategorySelect from "./AddProductComponent/CategorySelect";
import SubCategorySelect from "./AddProductComponent/SubCategorySelect";
import ChildCategorySelect from "./AddProductComponent/ChildCategorySelect";
import ImageUploader from "./AddProductComponent/ImageUploader";
import MultipleImageUploader from "./AddProductComponent/MultipleImageUploader";
import SubmitButton from "./AddProductComponent/SubmitButton";
import ProductBasicInfo from "./AddProductComponent/ProductBasicInfo";
import ProductSpecifications from "./AddProductComponent/ProductSpecifications";

const AddProductForm = ({ onClose }) => {
  // State management
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    authorId: "",
    price: "",
    stock: "",
    tags: "",
    tagIds: [],
    edition: "",
    numberOfPages: "",
    language: "",
    publisher: "",
    publisherId: "",
    country: "",
    weight: "",
    rating: "",
  });

  const [singleImage, setSingleImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showWebsite, setShowWebsite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
  const [isFetchingChildCategories, setIsFetchingChildCategories] =
    useState(false);
  const [isDraggingSingle, setIsDraggingSingle] = useState(false);
  const [isDraggingMultiple, setIsDraggingMultiple] = useState(false);
  const [isLoadingSingleImage, setIsLoadingSingleImage] = useState(false);
  const [isLoadingMultipleImages, setIsLoadingMultipleImages] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [isFetchingAuthors, setIsFetchingAuthors] = useState(false);
  const [isFetchingTags, setIsFetchingTags] = useState(false);
  const [isFetchingPublishers, setIsFetchingPublishers] = useState(false);

  // Fetch initial data (categories, authors, tags, publishers)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetchingCategories(true);
      setIsFetchingAuthors(true);
      setIsFetchingTags(true);
      setIsFetchingPublishers(true);

      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          "https://books-server-001.vercel.app/api/admin/category"
        );
        setCategories(categoriesResponse.data.products);

        // Fetch authors
        const authorsResponse = await axios.get(
          "https://books-server-001.vercel.app/api/admin/all-author"
        );
        setAuthors(authorsResponse.data.products);

        // Fetch tags
        const tagsResponse = await axios.get(
          "https://books-server-001.vercel.app/api/admin/all-tag"
        );
        setTags(tagsResponse.data.products);

        // Fetch publishers
        const publishersResponse = await axios.get(
          "https://books-server-001.vercel.app/api/admin/all-publisher"
        );
        setPublishers(publishersResponse.data.products);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsFetchingCategories(false);
        setIsFetchingAuthors(false);
        setIsFetchingTags(false);
        setIsFetchingPublishers(false);
      }
    };
    fetchInitialData();
  }, []);


  // Fetch sub-categories when category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory) return;
      setIsFetchingSubCategories(true);
      try {
        const response = await axios.get(
          "https://books-server-001.vercel.app/api/admin/sub-category"
        );
        const filteredSubCategories = response.data.products.filter(
          (subCat) => subCat.parentCategory.id === selectedCategory._id
        );
        setSubCategories(filteredSubCategories);
        setSelectedSubCategory(null);
        setSelectedChildCategory(null);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
        toast.error("Failed to load sub-categories");
      } finally {
        setIsFetchingSubCategories(false);
      }
    };
    fetchSubCategories();
  }, [selectedCategory]);

  // Fetch child categories when subcategory is selected
  useEffect(() => {
    const fetchChildCategories = async () => {
      if (!selectedSubCategory) return;
      setIsFetchingChildCategories(true);
      try {
        const response = await axios.get(
          "https://books-server-001.vercel.app/api/admin/child-category"
        );
        const filteredChildCategories = response.data.products.filter(
          (childCat) =>
            childCat.parentSubCategory.id === selectedSubCategory._id
        );
        setChildCategories(filteredChildCategories);
        setSelectedChildCategory(null);
      } catch (error) {
        console.error("Error fetching child categories:", error);
        toast.error("Failed to load child categories");
      } finally {
        setIsFetchingChildCategories(false);
      }
    };
    fetchChildCategories();
  }, [selectedSubCategory]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate category selections
    if (!selectedCategory) return toast.error("Please select a category");
    if (!selectedSubCategory) return toast.error("Please select a sub-category");
    // if (!selectedChildCategory) return toast.error("Please select a child category");

    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append basic form data (excluding empty values)
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // Append category data
    formDataToSend.append("showWebsite", showWebsite);
    formDataToSend.append("categoryId", selectedCategory._id);
    formDataToSend.append("categoryTitle", selectedCategory.title);
    formDataToSend.append("subCategoryId", selectedSubCategory.subCategoryId);
    formDataToSend.append("subCategoryObjectId", selectedSubCategory._id);
    formDataToSend.append("subCategoryTitle", selectedSubCategory.title);
    formDataToSend.append("childCategoryId", selectedChildCategory?.childCategoryId || "");
    formDataToSend.append("childCategoryObjectId", selectedChildCategory?._id || "");
    formDataToSend.append("childCategoryTitle", selectedChildCategory?.title || "");

    // Handle author data - ensure we have both ID and name
    if (formData.authorId) {
      const selectedAuthor = authors.find(author => author._id === formData.authorId);
      if (selectedAuthor) {
        formDataToSend.set("author", selectedAuthor.title); // Use set() to overwrite any existing value
        formDataToSend.set("authorId", selectedAuthor._id);
      }
    }

    // Handle publisher data - ensure we have both ID and name
    if (formData.publisherId) {
      const selectedPublisher = publishers.find(publisher => publisher._id === formData.publisherId);
      if (selectedPublisher) {
        formDataToSend.set("publisher", selectedPublisher.title); // Use set() to overwrite any existing value
        formDataToSend.set("publisherId", selectedPublisher._id);
      }
    }

    // Handle tags
    if (formData.tagIds && formData.tagIds.length > 0) {
      const selectedTags = tags.filter(tag => formData.tagIds.includes(tag._id));
      if (selectedTags.length > 0) {
        formDataToSend.set("tags", selectedTags.map(tag => tag.title).join(','));
        formDataToSend.set("tagIds", JSON.stringify(selectedTags.map(tag => tag._id)));
      }
    }

    // Handle images
    if (singleImage) formDataToSend.append("singleImage", singleImage);
    if (images && images.length > 0) {
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });
    }

    try {
      const response = await axios.post(
        "https://books-server-001.vercel.app/api/admin/upload/product",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      Swal.fire({
        title: "Success!",
        text: "Product uploaded successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onClose());
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.error || "Product Upload Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Single image handlers
  const handleDragOverSingle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSingle(true);
  };

  const handleDragLeaveSingle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSingle(false);
  };

  const handleDropSingle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSingle(false);
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFile(file, setIsLoadingSingleImage, setSingleImage);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChangeSingle = async (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      await handleFile(file, setIsLoadingSingleImage, setSingleImage);
    }
  };

  // Multiple image handlers
  const handleDragOverMultiple = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMultiple(true);
  };

  const handleDragLeaveMultiple = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMultiple(false);
  };

  const handleDropMultiple = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMultiple(false);
    if (e.dataTransfer.files?.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      await handleMultipleFiles(files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChangeMultiple = async (e) => {
    if (e.target.files?.length > 0) {
      const files = Array.from(e.target.files);
      await handleMultipleFiles(files);
    }
  };

  // Handle file processing (single or multiple)
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
          { type: "image/jpeg" }
        );
        setImageState(convertedFile);
      } else {
        setImageState(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultipleFiles = async (files) => {
    setIsLoadingMultipleImages(true);
    try {
      const convertedFiles = await Promise.all(
        files.map(async (file) => {
          if (
            file.name.toLowerCase().endsWith(".heic") ||
            file.name.toLowerCase().endsWith(".heif")
          ) {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.8,
            });
            return new File(
              [convertedBlob],
              file.name.replace(/\.heic$|\.heif$/i, ".jpeg"),
              { type: "image/jpeg" }
            );
          }
          return file;
        })
      );
      setImages((prevImages) => [...prevImages, ...convertedFiles]);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing images");
    } finally {
      setIsLoadingMultipleImages(false);
    }
  };

  return (
    <div className="p-6 ">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <ProductBasicInfo
                formData={formData}
                setFormData={setFormData}
                showWebsite={showWebsite}
                setShowWebsite={setShowWebsite}
                authors={authors}
                isFetchingAuthors={isFetchingAuthors}
                tags={tags}
                isFetchingTags={isFetchingTags}
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-5">
                <CategorySelect
                  categories={categories}
                  isFetchingCategories={isFetchingCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  setSelectedSubCategory={setSelectedSubCategory}
                  setSelectedChildCategory={setSelectedChildCategory}
                />

                {selectedCategory && (
                  <SubCategorySelect
                    subCategories={subCategories}
                    isFetchingSubCategories={isFetchingSubCategories}
                    selectedSubCategory={selectedSubCategory}
                    setSelectedSubCategory={setSelectedSubCategory}
                    setSelectedChildCategory={setSelectedChildCategory}
                    selectedCategory={selectedCategory}
                  />
                )}

                {selectedSubCategory && (
                  <ChildCategorySelect
                    childCategories={childCategories}
                    isFetchingChildCategories={isFetchingChildCategories}
                    selectedChildCategory={selectedChildCategory}
                    setSelectedChildCategory={setSelectedChildCategory}
                    selectedSubCategory={selectedSubCategory}
                  />
                )}
              </div>

              <ProductSpecifications
                formData={formData}
                setFormData={setFormData}
                publishers={publishers}
                isFetchingPublishers={isFetchingPublishers}
              />
            </div>
          </div>

          <div className="space-y-6 mt-5 grid grid-cols-2 gap-5">
            <ImageUploader
              isDragging={isDraggingSingle}
              isLoading={isLoadingSingleImage}
              image={singleImage}
              setImage={setSingleImage}
              handleDragOver={handleDragOverSingle}
              handleDragLeave={handleDragLeaveSingle}
              handleDrop={handleDropSingle}
              handleFileChange={handleFileChangeSingle}
              label="Upload Featured Image"
            />

            <MultipleImageUploader
              images={images}
              setImages={setImages}
              isDragging={isDraggingMultiple}
              isLoading={isLoadingMultipleImages}
              handleDragOver={handleDragOverMultiple}
              handleDragLeave={handleDragLeaveMultiple}
              handleDrop={handleDropMultiple}
              handleFileChange={handleFileChangeMultiple}
            />
          </div>
        </div>

        <div className="pt-6 w-56">
          <SubmitButton isLoading={isLoading} label="Create Product" />
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
