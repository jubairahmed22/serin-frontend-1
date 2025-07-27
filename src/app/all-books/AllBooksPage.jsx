"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import BooksData from "../components/Website/DataFiltered/BooksData";
import PaginationCard from "../components/Website/Paginations/PaginationCard";
import AllBooksFilter from "../components/Website/Filters/AllBooksFilter";
import '../../styles/allBooks.css'


const AllBooksPage = () => {
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
  const [tags, setTags] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Loading states
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
  const [isFetchingChildCategories, setIsFetchingChildCategories] = useState(false);
  const [isFetchingAuthors, setIsFetchingAuthors] = useState(false);
  const [isFetchingPublishers, setIsFetchingPublishers] = useState(false);
  const [isFetchingTags, setIsFetchingTags] = useState(false);

  // Get URL params
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const categoryParam = searchParams.get("category") || "";
  const subCategoryParam = searchParams.get("subCategory") || "";
  const childCategoryParam = searchParams.get("childCategory") || "";
  const authorParam = searchParams.get("author") || "";
  const publisherParam = searchParams.get("publisher") || "";
  const tagParam = searchParams.get("tag") || "";
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

  const handleTagChange = (tagId) => {
    const newParams = new URLSearchParams();
    newParams.set("tag", tagId);
    updateFilters(newParams);
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
        setIsFetchingTags(true);

        const [categoriesRes, authorsRes, publishersRes, tagsRes] = await Promise.all([
          axios.get("https://books-server-001.vercel.app/api/admin/category"),
          axios.get("https://books-server-001.vercel.app/api/admin/all-author"),
          axios.get("https://books-server-001.vercel.app/api/admin/all-publisher"),
          axios.get("https://books-server-001.vercel.app/api/admin/all-tag")
        ]);

        setCategories(categoriesRes.data.products);
        setAuthors(authorsRes.data.products);
        setPublishers(publishersRes.data.products);
        setTags(tagsRes.data.products);
      } catch (error) {
        setError("Failed to load initial data");
      } finally {
        setIsFetchingCategories(false);
        setIsFetchingAuthors(false);
        setIsFetchingPublishers(false);
        setIsFetchingTags(false);
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

  return (
    <div className="fontPoppins max-w-[1400px] dark:bg-white customLayout mx-auto flex justify-between gap-3">
      <div className="flex w-[450px] customWidth dark:bg-white mt-2">
        <AllBooksFilter
          authors={authors}
          publishers={publishers}
          tags={tags}
          selectedAuthor={authorParam}
          selectedPublisher={publisherParam}
          selectedTag={tagParam}
          isFetchingAuthors={isFetchingAuthors}
          isFetchingPublishers={isFetchingPublishers}
          isFetchingTags={isFetchingTags}
          popularBooksFilter={popularBooksParam}
          discountFilter={discountParam}
          dailyDealsFilter={dailyDealsParam}
          trendingNowFilter={trendingNowParam}
          newReleasedFilter={newReleasedParam}
          inStockFilter={inStockParam}
          onAuthorChange={handleAuthorChange}
          onPublisherChange={handlePublisherChange}
          onTagChange={handleTagChange}
          onPopularBooksChange={handleSpecialFilterChange("popularBooks")}
          onDiscountChange={handleSpecialFilterChange("discount")}
          onDailyDealsChange={handleSpecialFilterChange("dailyDeals")}
          onTrendingNowChange={handleSpecialFilterChange("trendingNow")}
          onNewReleasedChange={handleSpecialFilterChange("newReleased")}
          onInStockChange={handleInStockChange}
          onClear={clearAllFilters}
        />
      </div>
      <div className="flex flex-col mt-2 w-full bg-white rounded-lg mb-6">
        <BooksData initialLoading={initialLoading} products={products} />
        <PaginationCard
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllBooksPage;