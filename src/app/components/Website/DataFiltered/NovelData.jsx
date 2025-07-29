"use client";
import React, { useState, useEffect } from "react";
import BooksCardVertical from "../BooksAllCard/BooksCardVertical";
import CustomSelect from "../Dropdown/CustomSelect";
import BookCardVerticalSkeleton from "../../../components/Spinner/BookCardVerticalSkeleton";

const NovelData = () => {
  const [novelData, setNovelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [childCategoriesLoading, setChildCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchChildCategories = async () => {
      try {
        setChildCategoriesLoading(true);
        const response = await fetch(
          "https://books-server-001.vercel.app/api/admin/child-category"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setChildCategories(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Error fetching child categories:", err);
        setChildCategories([]);
        setError("Failed to load categories");
      } finally {
        setChildCategoriesLoading(false);
      }
    };

    fetchChildCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `https://books-server-001.vercel.app/api/admin/novel?page=${currentPage}`;
        if (selectedChildCategory) url += `&childCategory=${selectedChildCategory}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        setNovelData(data.products);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        setError(err.message);
        setNovelData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedChildCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleChildCategoryChange = (value) => {
    setSelectedChildCategory(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedChildCategory("");
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        Error: {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="fontPoppins w-full max-w-6xl mx-auto lg:px-4">
      {/* Header and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
        {/* <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Novels</h1> */}
        
        <div className="flex-1 flex items-center gap-4 w-full">
          <div className="flex-1 max-w-md">
            {childCategoriesLoading ? (
              <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <CustomSelect
                options={childCategories.map((cat) => ({
                  value: cat._id,
                  label: cat.title,
                }))}
                value={selectedChildCategory}
                onChange={handleChildCategoryChange}
                placeholder="Filter by category"
              />
            )}
          </div>

          {selectedChildCategory && !childCategoriesLoading && (
            <button
              onClick={handleResetFilters}
              className="text-red-500 hover:underline whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[720px] overflow-y-auto mb-6 w-full space-y-4 pr-2">
        {loading ? (
          [...Array(5)].map((_, index) => (
            <BookCardVerticalSkeleton key={`skeleton-${index}`} />
          ))
        ) : novelData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <div className="text-gray-500 text-lg mb-4">No novels found</div>
            {selectedChildCategory && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          novelData.map((product) => (
            <BooksCardVertical key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Pagination */}
      {novelData.length > 0 && !loading && (
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default NovelData;