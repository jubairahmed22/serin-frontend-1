"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import BooksAddToOrderData from "../../components/Website/DataFiltered/BooksAddToOrderData";
import PaginationCard from "../../components/Website/Paginations/PaginationCard";
import AllBooksFilterAdmin from "../../components/Website/Filters/AllBooksFilterAdmin";

const AddInventoryProductModal = ({ isOpen, onClose, onAddProduct }) => {
  // all books start
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State management
  const [products, setProducts] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Loading states
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
  const [isFetchingChildCategories, setIsFetchingChildCategories] = useState(false);
  const [isFetchingAuthors, setIsFetchingAuthors] = useState(false);
  const [isFetchingPublishers, setIsFetchingPublishers] = useState(false);

  // Get URL params
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const categoryParam = searchParams.get("category") || "";
  const subCategoryParam = searchParams.get("subCategory") || "";
  const childCategoryParam = searchParams.get("childCategory") || "";
  const authorParam = searchParams.get("author") || "";
  const publisherParam = searchParams.get("publisher") || "";
  const titleParam = searchParams.get("title") || "";
  const productIdParam = searchParams.get("productId") || "";
  const popularBooksParam = searchParams.get("popularBooks") || "";
  const discountParam = searchParams.get("discount") || "";
  const dailyDealsParam = searchParams.get("dailyDeals") || "";
  const trendingNowParam = searchParams.get("trendingNow") || "";
  const newReleasedParam = searchParams.get("newReleased") || "";
  const inStockParam = searchParams.get("inStock") || "";

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setInitialLoading(true);
      const params = new URLSearchParams(window.location.search);
      const response = await axios.get(`https://books-server-001.vercel.app/api/admin/all-products?${params.toString()}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Update URL and fetch products
  const updateFilters = useCallback((newParams) => {
    const params = new URLSearchParams(window.location.search);
    
    // Remove all special filters first
    params.delete("popularBooks");
    params.delete("discount");
    params.delete("dailyDeals");
    params.delete("trendingNow");
    params.delete("newReleased");
    params.delete("inStock");

    // Reset page to 1 when filters change
    if (!newParams.has("page")) {
      params.set("page", "1");
    }

    // Apply new parameters
    for (const [key, value] of newParams.entries()) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname]);

  // Filter handlers
  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams();
    newParams.set("category", e.target.value);
    newParams.delete("subCategory");
    newParams.delete("childCategory");
    updateFilters(newParams);
  };

  const handleSubCategoryChange = (e) => {
    const newParams = new URLSearchParams();
    newParams.set("subCategory", e.target.value);
    newParams.delete("childCategory");
    updateFilters(newParams);
  };

  const handleChildCategoryChange = (e) => {
    updateFilters(new URLSearchParams({ childCategory: e.target.value }));
  };

  const handleAuthorChange = (e) => {
    updateFilters(new URLSearchParams({ author: e.target.value }));
  };

  const handlePublisherChange = (e) => {
    updateFilters(new URLSearchParams({ publisher: e.target.value }));
  };

  const handleTitleChange = (e) => {
    updateFilters(new URLSearchParams({ title: e.target.value }));
  };

  const handleProductIdChange = (e) => {
    updateFilters(new URLSearchParams({ productId: e.target.value }));
  };

  const handleSpecialFilterChange = (filterName) => (e) => {
    const newParams = new URLSearchParams();
    
    // Clear all other special filters
    newParams.delete("popularBooks");
    newParams.delete("discount");
    newParams.delete("dailyDeals");
    newParams.delete("trendingNow");
    newParams.delete("newReleased");
    newParams.delete("inStock");

    // Set the new filter if value is "true"
    if (e.target.value === "true") {
      newParams.set(filterName, "true");
    }

    updateFilters(newParams);
  };

  const handleInStockChange = (e) => {
    const newParams = new URLSearchParams();
    newParams.delete("popularBooks");
    newParams.delete("discount");
    newParams.delete("dailyDeals");
    newParams.delete("trendingNow");
    newParams.delete("newReleased");

    if (e.target.value === "true") {
      newParams.set("inStock", "true");
    }

    updateFilters(newParams);
  };

  const handlePageChange = (page) => {
    updateFilters(new URLSearchParams({ page: page.toString() }));
  };

  const clearAllFilters = useCallback(() => {
    router.replace(`${pathname}?page=1`);
  }, [router, pathname]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsFetchingCategories(true);
        setIsFetchingAuthors(true);
        setIsFetchingPublishers(true);

        const [categoriesRes, authorsRes, publishersRes] = await Promise.all([
          axios.get("https://books-server-001.vercel.app/api/admin/category"),
          axios.get("https://books-server-001.vercel.app/api/admin/all-author"),
          axios.get("https://books-server-001.vercel.app/api/admin/all-publisher")
        ]);

        setCategories(categoriesRes.data.products);
        setAuthors(authorsRes.data.products);
        setPublishers(publishersRes.data.products);
      } catch (error) {
        setError("Failed to load initial data");
      } finally {
        setIsFetchingCategories(false);
        setIsFetchingAuthors(false);
        setIsFetchingPublishers(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch sub-categories
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categoryParam) {
        setSubCategories([]);
        return;
      }

      setIsFetchingSubCategories(true);
      try {
        const response = await axios.get("https://books-server-001.vercel.app/api/admin/sub-category");
        setSubCategories(response.data.products.filter(
          subCat => subCat.parentCategory.id === categoryParam
        ));
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      } finally {
        setIsFetchingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [categoryParam]);

  // Fetch child categories
  useEffect(() => {
    const fetchChildCategories = async () => {
      if (!subCategoryParam) {
        setChildCategories([]);
        return;
      }

      setIsFetchingChildCategories(true);
      try {
        const response = await axios.get("https://books-server-001.vercel.app/api/admin/child-category");
        setChildCategories(response.data.products.filter(
          childCat => childCat.parentSubCategory.id === subCategoryParam
        ));
      } catch (error) {
        console.error("Error fetching child categories:", error);
      } finally {
        setIsFetchingChildCategories(false);
      }
    };

    fetchChildCategories();
  }, [subCategoryParam]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchParams, fetchProducts]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  // all books end
  const [productData, setProductData] = useState({
    productId: "",
    title: "",
    price: 0,
    quantity: 1,
    stock: 0,
    singleImage: "",
    deliveryCharge: 0,
    discountedPrice: 0,
    numberOfPages: null,
    weight: null,
    categoryId: null,
    subCategoryId: null,
    childCategoryId: null,
    publisherId: null,
    authorId: null
  });

  
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: ["price", "quantity", "stock", "deliveryCharge", "discountedPrice", "numberOfPages", "weight"].includes(name) 
        ? (value === "" ? null : Number(value))
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!productData.productId || !productData.title || productData.price <= 0) {
      toast.error("Please fill in Product ID, Title, and valid Price");
      return;
    }

    // Set discountedPrice to price if not provided
    const finalProduct = {
      ...productData,
      discountedPrice: productData.discountedPrice || productData.price,
      discountValue: productData.discountValue || 0,
      discountType: productData.discountType || null,
      _id: `temp-${Date.now()}` // Temporary ID for frontend
    };

    onAddProduct(finalProduct);
    setProductData({
      productId: "",
      title: "",
      price: 0,
      quantity: 1,
      stock: 0,
      singleImage: "",
      deliveryCharge: 0,
      discountedPrice: 0,
      numberOfPages: null,
      weight: null,
      categoryId: null,
      subCategoryId: null,
      childCategoryId: null,
      publisherId: null,
      authorId: null
    });
  };

  const handleAddToInventory = (product) => {
    onAddProduct({
      ...product,
      _id: `temp-${Date.now()}` // Temporary ID for frontend
    });
  };

  return (
    <div className="fixed inset-0 border fontPoppins  bg-black/10 bg-opacity-50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl h-[80%]  w-[80%] overflow-y-auto">
        <div className="flex justify-between rounded-t-xl sticky z-40 top-0 items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-800">Add inventory product</h3>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="fontPoppins w-full mx-auto flex justify-between gap-3">
          <div className="flex w-[450px] mt-2">
            <AllBooksFilterAdmin
              authors={authors}
              publishers={publishers}
              selectedAuthor={authorParam}
              selectedPublisher={publisherParam}
              titleValue={titleParam}
              productIdValue={productIdParam}
              isFetchingAuthors={isFetchingAuthors}
              isFetchingPublishers={isFetchingPublishers}
              popularBooksFilter={popularBooksParam}
              discountFilter={discountParam}
              dailyDealsFilter={dailyDealsParam}
              trendingNowFilter={trendingNowParam}
              newReleasedFilter={newReleasedParam}
              inStockFilter={inStockParam}
              onAuthorChange={handleAuthorChange}
              onPublisherChange={handlePublisherChange}
              onTitleChange={handleTitleChange}
              onProductIdChange={handleProductIdChange}
              onPopularBooksChange={handleSpecialFilterChange("popularBooks")}
              onDiscountChange={handleSpecialFilterChange("discount")}
              onDailyDealsChange={handleSpecialFilterChange("dailyDeals")}
              onTrendingNowChange={handleSpecialFilterChange("trendingNow")}
              onNewReleasedChange={handleSpecialFilterChange("newReleased")}
              onInStockChange={handleInStockChange}
              onClear={clearAllFilters}
            />
          </div>
          <div className="flex flex-col mt-2 mb-6 w-full bg-white rounded-lg ">
            <BooksAddToOrderData initialLoading={initialLoading} products={products} onAddToInventory={handleAddToInventory} />
            <PaginationCard
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryProductModal;

