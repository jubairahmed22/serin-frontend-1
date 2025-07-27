"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import heic2any from "heic2any";
import CategorySelectUpdate from "../../../../Form/AddProductComponent/CategorySelectUpdate";
import SubCategoryUpdate from "../../../../Form/AddProductComponent/SubCategoryUpdate";
import ChildCategoryUpdate from "../../../../Form/AddProductComponent/ChildCategoryUpdate";
import ImageUploaderUpdate from "../../../../Form/AddProductComponent/ImageUploaderUpdate";
import MultipleImageUploaderUpdate from "../../../../Form/AddProductComponent/MultipleImageUploaderUpdate";
import SubmitButton from "../../../../Form/AddProductComponent/SubmitButton";
import ProductBasicInfoUpdate from "../../../../Form/AddProductComponent/ProductBasicInfoUpdate";
import ProductSpecifications from "../../../../Form/AddProductComponent/ProductSpecifications";
import Link from "next/link";

const EditProductForm = ({ onClose }) => {

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id;

  // Get all current query parameters to preserve them
  const currentPage = searchParams.get("page") || "1";
  const titleParam = searchParams.get("title") || "";
  const showWebParam = searchParams.get("showWebFilter") || "";
  const categoryParam = searchParams.get("category") || "";
  const subCategoryParam = searchParams.get("subCategory") || "";
  const childCategoryParam = searchParams.get("childCategory") || "";
  const authorParam = searchParams.get("author") || "";
  const publisherParam = searchParams.get("publisher") || "";
  const startDateParam = searchParams.get("startDate") || "";
  const endDateParam = searchParams.get("endDate") || "";
  const popularBooksParam = searchParams.get("popularBooks") || "";
  const discountParam = searchParams.get("discount") || "";
  const dailyDealsParam = searchParams.get("dailyDeals") || "";
  const trendingNowParam = searchParams.get("trendingNow") || "";
  const newReleasedParam = searchParams.get("newReleased") || "";

  // Function to build the return URL with all preserved parameters
  const buildReturnUrl = () => {
    const params = new URLSearchParams();
    
    params.set("page", currentPage);
    if (titleParam) params.set("title", titleParam);
    if (showWebParam) params.set("showWebFilter", showWebParam);
    if (categoryParam) params.set("category", categoryParam);
    if (subCategoryParam) params.set("subCategory", subCategoryParam);
    if (childCategoryParam) params.set("childCategory", childCategoryParam);
    if (authorParam) params.set("author", authorParam);
    if (publisherParam) params.set("publisher", publisherParam);
    if (startDateParam) params.set("startDate", startDateParam);
    if (endDateParam) params.set("endDate", endDateParam);
    if (popularBooksParam) params.set("popularBooks", popularBooksParam);
    if (discountParam) params.set("discount", discountParam);
    if (dailyDealsParam) params.set("dailyDeals", dailyDealsParam);
    if (trendingNowParam) params.set("trendingNow", trendingNowParam);
    if (newReleasedParam) params.set("newReleased", newReleasedParam);

    return `/admin/products/all-products?${params.toString()}`;
  };

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
    categoryId: "",
    categoryTitle: "",
    subCategoryId: "",
    subCategoryTitle: "",
    childCategoryId: "",
    childCategoryTitle: "",
  });

  const [singleImage, setSingleImage] = useState(null);
  const [existingSingleImage, setExistingSingleImage] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
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

        // Fetch product data if in edit mode
        if (productId) {
          const productResponse = await axios.get(
            `https://books-server-001.vercel.app/api/admin/all-products/${productId}`
          );
          const product = productResponse.data;
          console.log("products", product);
          

          // Set form data
          setFormData({
            title: product.title || "",
            description: product.description || "",
            author: product.author.name || "", // author name
            authorId: product.author.id || "", // author ID
            authorId: product.author.id || "", // author ID
            price: product.price || "",
            stock: product.stock || "",
            tags: product.tags || "",
            tagIds: product.tagIds || [],
            edition: product.edition || "",
            numberOfPages: product.numberOfPages || "",
            language: product.language || "",
            publisher: product.publisher.name || "",
            publisherId: product.publisher.id || "",
            country: product.country || "",
            weight: product.weight || "",
            rating: product.rating || "",
            categoryId: product.parentCategory.id || "",
            categoryTitle: product.parentCategory.title || "",
            subCategoryId: product.parentSubCategory?.objectId || "",
            subCategoryTitle: product.parentSubCategory.title || "",
            childCategoryId: product.parentChildCategory?.objectId || "",
            childCategoryTitle: product.parentChildCategory?.title || "",
          });

          setShowWebsite(product.showWebsite || false);
          setExistingSingleImage(product.singleImage || "");
          setExistingImages(product.images || []);

          // Set category hierarchy if available
          if (product.categoryId) {
            const category = categoriesResponse.data.products.find(
              (cat) => cat._id === product.categoryId
            );
            if (category) {
              setSelectedCategory(category);

              // Fetch subcategories for this category
              const subCatResponse = await axios.get(
                "https://books-server-001.vercel.app/api/admin/sub-category"
              );
              const filteredSubCategories = subCatResponse.data.products.filter(
                (subCat) => subCat.parentCategory.id === product.categoryId
              );
              setSubCategories(filteredSubCategories);

              if (product.subCategoryId) {
                const subCategory = filteredSubCategories.find(
                  (sub) => sub._id === product.subCategoryId
                );
                if (subCategory) {
                  setSelectedSubCategory(subCategory);

                  // Fetch child categories for this subcategory
                  const childCatResponse = await axios.get(
                    "https://books-server-001.vercel.app/api/admin/child-category"
                  );
                  const filteredChildCategories =
                    childCatResponse.data.products.filter(
                      (childCat) =>
                        childCat.parentSubCategory.id === product.subCategoryId
                    );
                  setChildCategories(filteredChildCategories);

                  if (product.childCategoryId) {
                    const childCategory = filteredChildCategories.find(
                      (child) => child._id === product.childCategoryId
                    );
                    if (childCategory) {
                      setSelectedChildCategory(childCategory);
                    }
                  }
                }
              }
            }
          }
        }
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
  }, [productId]);

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
    if (!selectedSubCategory)
      return toast.error("Please select a sub-category");
    // if (!selectedChildCategory)
    //   return toast.error("Please select a child category");

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
    formDataToSend.append("subCategoryId", selectedSubCategory._id);
    formDataToSend.append("subCategoryTitle", selectedSubCategory.title);
    formDataToSend.append("childCategoryId", selectedChildCategory?._id || "");
    formDataToSend.append("childCategoryTitle", selectedChildCategory?.title || "");

    // Handle author data
    if (formData.authorId) {
      const selectedAuthor = authors.find(
        (author) => author._id === formData.authorId
      );
      if (selectedAuthor) {
        formDataToSend.set("author", selectedAuthor.title);
        formDataToSend.set("authorId", selectedAuthor._id);
      }
    }

    // Handle publisher data
    if (formData.publisherId) {
      const selectedPublisher = publishers.find(
        (publisher) => publisher._id === formData.publisherId
      );
      if (selectedPublisher) {
        formDataToSend.set("publisher", selectedPublisher.title);
        formDataToSend.set("publisherId", selectedPublisher._id);
      }
    }

    // Handle tags
    if (formData.tagIds && formData.tagIds.length > 0) {
      const selectedTags = tags.filter((tag) =>
        formData.tagIds.includes(tag._id)
      );
      if (selectedTags.length > 0) {
        formDataToSend.set(
          "tags",
          selectedTags.map((tag) => tag.title).join(",")
        );
        formDataToSend.set(
          "tagIds",
          JSON.stringify(selectedTags.map((tag) => tag._id))
        );
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
      const response = await axios.put(
        `https://books-server-001.vercel.app/api/admin/update/all-products/${productId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.fire({
        title: "Success!",
        text: "Product updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        if (onClose) {
          onClose();
        } else {
          router.back();
        }
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.error || "Product Update Failed");
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

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeSingleImage = () => {
    setSingleImage(null);
    setExistingSingleImage("");
  };

   const handleBack = () => {
    router.back();
  };

  return (
    <div className="m-5 p-6 bg-white dark:text-black rounded-xl">
        <div className="mb-8">
        <button
          onClick={handleBack}
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
          Back to all products
        </button>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <ProductBasicInfoUpdate
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
                <CategorySelectUpdate
                  categories={categories}
                  isFetchingCategories={isFetchingCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  setSelectedSubCategory={setSelectedSubCategory}
                  setSelectedChildCategory={setSelectedChildCategory}
                  formData={formData}
                  setFormData={setFormData}
                />

                {selectedCategory && (
                  <SubCategoryUpdate
                    subCategories={subCategories}
                    isFetchingSubCategories={isFetchingSubCategories}
                    selectedSubCategory={selectedSubCategory}
                    setSelectedSubCategory={setSelectedSubCategory}
                    setSelectedChildCategory={setSelectedChildCategory}
                    selectedCategory={selectedCategory}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}

                {selectedSubCategory && (
                  <ChildCategoryUpdate
                    childCategories={childCategories}
                    isFetchingChildCategories={isFetchingChildCategories}
                    selectedChildCategory={selectedChildCategory}
                    setSelectedChildCategory={setSelectedChildCategory}
                    selectedSubCategory={selectedSubCategory}
                    formData={formData}
                    setFormData={setFormData}
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
            <ImageUploaderUpdate
              isDragging={isDraggingSingle}
              isLoading={isLoadingSingleImage}
              image={singleImage}
              existingImage={existingSingleImage}
              setImage={setSingleImage}
              removeImage={removeSingleImage}
              handleDragOver={handleDragOverSingle}
              handleDragLeave={handleDragLeaveSingle}
              handleDrop={handleDropSingle}
              handleFileChange={handleFileChangeSingle}
              label="Update Featured Image"
            />

            <div className="space-y-2">
              <MultipleImageUploaderUpdate
                images={images}
                existingImages={existingImages}
                setImages={setImages}
                removeExistingImage={removeExistingImage}
                isDragging={isDraggingMultiple}
                isLoading={isLoadingMultipleImages}
                handleDragOver={handleDragOverMultiple}
                handleDragLeave={handleDragLeaveMultiple}
                handleDrop={handleDropMultiple}
                handleFileChange={handleFileChangeMultiple}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 w-56">
          <SubmitButton isLoading={isLoading} label="Update Product" />
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
