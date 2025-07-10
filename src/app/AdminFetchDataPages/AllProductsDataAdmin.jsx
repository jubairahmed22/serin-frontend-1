"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import ProductFilters from "./AdminFetchProductCompo/ProductFilters";
import ProductTable from "./AdminFetchProductCompo/ProductTable";
import Pagination from "./AdminFetchProductCompo/Pagination";
import DeleteConfirmation from "./AdminFetchProductCompo/DeleteConfirmation";

const AllProductsDataAdmin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State for data and loading
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshInterval] = useState(1000);

  // Loading states for dropdowns
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
  const [isFetchingChildCategories, setIsFetchingChildCategories] = useState(false);
  const [isFetchingAuthors, setIsFetchingAuthors] = useState(false);
  const [isFetchingPublishers, setIsFetchingPublishers] = useState(false);

  // Get all params from URL (these represent the APPLIED filters)
  const currentPage = parseInt(searchParams.get("page")) || 1;
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

  // Local state for SELECTED values (not yet applied)
  const [titleSelected, setTitleSelected] = useState(titleParam);
  const [showWebSelected, setShowWebSelected] = useState(showWebParam);
  const [categorySelected, setCategorySelected] = useState(null);
  const [subCategorySelected, setSubCategorySelected] = useState(null);
  const [childCategorySelected, setChildCategorySelected] = useState(null);
  const [authorSelected, setAuthorSelected] = useState(authorParam);
  const [publisherSelected, setPublisherSelected] = useState(publisherParam);
  const [startDateSelected, setStartDateSelected] = useState(startDateParam);
  const [endDateSelected, setEndDateSelected] = useState(endDateParam);
  const [popularBooksSelected, setPopularBooksSelected] = useState(popularBooksParam);
  const [discountSelected, setDiscountSelected] = useState(discountParam);
  const [dailyDealsSelected, setDailyDealsSelected] = useState(dailyDealsParam);
  const [trendingNowSelected, setTrendingNowSelected] = useState(trendingNowParam);
  const [newReleasedSelected, setNewReleasedSelected] = useState(newReleasedParam);

  // Fetch initial data (categories, authors, publishers)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsFetchingCategories(true);
      setIsFetchingAuthors(true);
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

        // Fetch publishers
        const publishersResponse = await axios.get(
          "https://books-server-001.vercel.app/api/admin/all-publisher"
        );
        setPublishers(publishersResponse.data.products);

      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data");
      } finally {
        setIsFetchingCategories(false);
        setIsFetchingAuthors(false);
        setIsFetchingPublishers(false);
      }
    };
    fetchInitialData();
  }, []);

  // Set selected category when categories are loaded and categoryParam exists
  useEffect(() => {
    if (categories.length > 0 && categoryParam) {
      const foundCategory = categories.find(cat => cat._id === categoryParam);
      setCategorySelected(foundCategory || null);
    }
  }, [categories, categoryParam]);

  // Fetch sub-categories when category is selected (for dropdown only)
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categorySelected) {
        setSubCategories([]);
        setSubCategorySelected(null);
        return;
      }
      
      setIsFetchingSubCategories(true);
      try {
        const response = await axios.get(
          "https://books-server-001.vercel.app/api/admin/sub-category"
        );
        const filteredSubCategories = response.data.products.filter(
          (subCat) => subCat.parentCategory.id === categorySelected._id
        );
        setSubCategories(filteredSubCategories);
        
        // Set selected sub-category if param exists
        if (subCategoryParam) {
          const foundSubCategory = filteredSubCategories.find(
            subCat => subCat._id === subCategoryParam
          );
          setSubCategorySelected(foundSubCategory || null);
        }
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
        setError("Failed to load sub-categories");
      } finally {
        setIsFetchingSubCategories(false);
      }
    };
    fetchSubCategories();
  }, [categorySelected, subCategoryParam]);

  // Fetch child categories when subcategory is selected (for dropdown only)
  useEffect(() => {
    const fetchChildCategories = async () => {
      if (!subCategorySelected) {
        setChildCategories([]);
        setChildCategorySelected(null);
        return;
      }
      
      setIsFetchingChildCategories(true);
      try {
        const response = await axios.get(
          "https://books-server-001.vercel.app/api/admin/child-category"
        );
        const filteredChildCategories = response.data.products.filter(
          (childCat) => childCat.parentSubCategory.id === subCategorySelected._id
        );
        setChildCategories(filteredChildCategories);
        
        // Set selected child category if param exists
        if (childCategoryParam) {
          const foundChildCategory = filteredChildCategories.find(
            childCat => childCat._id === childCategoryParam
          );
          setChildCategorySelected(foundChildCategory || null);
        }
      } catch (error) {
        console.error("Error fetching child categories:", error);
        setError("Failed to load child categories");
      } finally {
        setIsFetchingChildCategories(false);
      }
    };
    fetchChildCategories();
  }, [subCategorySelected, childCategoryParam]);

  // Fetch products function (uses APPLIED filters from URL params)
  const fetchProducts = useCallback(
    async (isBackgroundRefresh = false) => {
      try {
        if (isBackgroundRefresh) {
          setIsRefreshing(true);
        } else {
          setInitialLoading(true);
        }

        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
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

        const response = await axios.get(
          `https://books-server-001.vercel.app/api/admin/all-products?${params.toString()}`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isBackgroundRefresh) {
          setIsRefreshing(false);
        } else {
          setInitialLoading(false);
        }
      }
    },
    [
      currentPage, 
      titleParam, 
      showWebParam, 
      categoryParam, 
      subCategoryParam, 
      childCategoryParam,
      authorParam,
      publisherParam,
      startDateParam,
      endDateParam,
      popularBooksParam,
      discountParam,
      dailyDealsParam,
      trendingNowParam,
      newReleasedParam
    ]
  );

  // Set up interval for auto-refresh
  useEffect(() => {
    fetchProducts(false);
    const intervalId = setInterval(() => {
      fetchProducts(true);
    }, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchProducts, refreshInterval]);

  // Update URL when filters are submitted
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    // Always reset to page 1 when applying new filters
    params.set("page", "1");
    
    if (titleSelected) params.set("title", titleSelected);
    if (showWebSelected) params.set("showWebFilter", showWebSelected);
    if (categorySelected) params.set("category", categorySelected._id);
    if (subCategorySelected) params.set("subCategory", subCategorySelected._id);
    if (childCategorySelected) params.set("childCategory", childCategorySelected._id);
    if (authorSelected) params.set("author", authorSelected);
    if (publisherSelected) params.set("publisher", publisherSelected);
    if (startDateSelected) params.set("startDate", startDateSelected);
    if (endDateSelected) params.set("endDate", endDateSelected);
    if (popularBooksSelected) params.set("popularBooks", popularBooksSelected);
    if (discountSelected) params.set("discount", discountSelected);
    if (dailyDealsSelected) params.set("dailyDeals", dailyDealsSelected);
    if (trendingNowSelected) params.set("trendingNow", trendingNowSelected);
    if (newReleasedSelected) params.set("newReleased", newReleasedSelected);

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    router, 
    pathname,
    titleSelected,
    showWebSelected,
    categorySelected,
    subCategorySelected,
    childCategorySelected,
    authorSelected,
    publisherSelected,
    startDateSelected,
    endDateSelected,
    popularBooksSelected,
    discountSelected,
    dailyDealsSelected,
    trendingNowSelected,
    newReleasedSelected
  ]);

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Handler functions for SELECTIONS (not applied yet)
  const handleCategoryChange = (e) => {
    const cat = categories.find(c => c._id === e.target.value);
    setCategorySelected(cat || null);
    setSubCategorySelected(null);
    setChildCategorySelected(null);
  };

  const handleSubCategoryChange = (e) => {
    const subCat = subCategories.find(sc => sc._id === e.target.value);
    setSubCategorySelected(subCat || null);
    setChildCategorySelected(null);
  };

  const handleChildCategoryChange = (e) => {
    const childCat = childCategories.find(cc => cc._id === e.target.value);
    setChildCategorySelected(childCat || null);
  };

  const handleAuthorChange = (e) => {
    setAuthorSelected(e.target.value);
  };

  const handlePublisherChange = (e) => {
    setPublisherSelected(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDateSelected(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDateSelected(e.target.value);
  };

  const handlePopularBooksChange = (e) => setPopularBooksSelected(e.target.value);
  const handleDiscountChange = (e) => setDiscountSelected(e.target.value);
  const handleDailyDealsChange = (e) => setDailyDealsSelected(e.target.value);
  const handleTrendingNowChange = (e) => setTrendingNowSelected(e.target.value);
  const handleNewReleasedChange = (e) => setNewReleasedSelected(e.target.value);
  const handleTitleChange = (e) => setTitleSelected(e.target.value);
  const handleShowWebChange = (e) => setShowWebSelected(e.target.value);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id) => {
    await DeleteConfirmation(async () => {
      try {
        const response = await axios.delete(
          `https://books-server-001.vercel.app/api/admin/delete/products/${id}`
        );
        if (response.data.success) {
          fetchProducts(false);
          return true;
        }
      } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to delete product");
      }
    });
  };

  const clearAllFilters = useCallback(() => {
    setTitleSelected("");
    setShowWebSelected("");
    setCategorySelected(null);
    setSubCategorySelected(null);
    setChildCategorySelected(null);
    setAuthorSelected("");
    setPublisherSelected("");
    setStartDateSelected("");
    setEndDateSelected("");
    setPopularBooksSelected("");
    setDiscountSelected("");
    setDailyDealsSelected("");
    setTrendingNowSelected("");
    setNewReleasedSelected("");
    
    // Apply empty filters immediately when clearing
    router.replace(`${pathname}?page=1`);
  }, [router, pathname]);

  if (initialLoading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="fontPoppins">
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Updating...
        </div>
      )}

      <ProductFilters
        categories={categories}
        subCategories={subCategories}
        childCategories={childCategories}
        authors={authors}
        publishers={publishers}
        selectedCategory={categorySelected}
        selectedSubCategory={subCategorySelected}
        selectedChildCategory={childCategorySelected}
        selectedAuthor={authorSelected}
        selectedPublisher={publisherSelected}
        startDate={startDateSelected}
        endDate={endDateSelected}
        isFetchingCategories={isFetchingCategories}
        isFetchingSubCategories={isFetchingSubCategories}
        isFetchingChildCategories={isFetchingChildCategories}
        isFetchingAuthors={isFetchingAuthors}
        isFetchingPublishers={isFetchingPublishers}
        titleFilter={titleSelected}
        showWebFilter={showWebSelected}
        popularBooksFilter={popularBooksSelected}
        discountFilter={discountSelected}
        dailyDealsFilter={dailyDealsSelected}
        trendingNowFilter={trendingNowSelected}
        newReleasedFilter={newReleasedSelected}
        onCategoryChange={handleCategoryChange}
        onSubCategoryChange={handleSubCategoryChange}
        onChildCategoryChange={handleChildCategoryChange}
        onAuthorChange={handleAuthorChange}
        onPublisherChange={handlePublisherChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onTitleChange={handleTitleChange}
        onShowWebChange={handleShowWebChange}
        onPopularBooksChange={handlePopularBooksChange}
        onDiscountChange={handleDiscountChange}
        onDailyDealsChange={handleDailyDealsChange}
        onTrendingNowChange={handleTrendingNowChange}
        onNewReleasedChange={handleNewReleasedChange}
        onSubmit={handleFilterSubmit}
        onClear={clearAllFilters}
      />

      <ProductTable 
        products={products} 
        onDelete={handleDelete} 
      />

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default AllProductsDataAdmin;