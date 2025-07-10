"use client";

import React, { useState, useEffect } from "react";
import BooksCardVertical from "../BooksAllCard/BooksCardVertical";
import CustomSelect from "../Dropdown/CustomSelect";

const NonFictionData = () => {
  const [fictionData, setFictionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState("");

  useEffect(() => {
    const fetchChildCategories = async () => {
      try {
        const response = await fetch(
          "https://books-server-001.vercel.app/api/admin/child-category"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChildCategories(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Error fetching child categories:", err);
        setChildCategories([]);
      }
    };

    fetchChildCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `https://books-server-001.vercel.app/api/admin/non-fiction?page=${currentPage}`;

        if (selectedChildCategory) {
          url += `&childCategory=${selectedChildCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFictionData(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!fictionData.length) return <div>No data found</div>;

  return (
    <div className="fontPoppins">
      {/* Child category filter with reset button */}
      <div className="mb-4 flex items-center gap-4 w-full">
        <div className="flex items-center w-full">
          <CustomSelect
            options={childCategories.map((cat) => ({
              value: cat._id,
              label: cat.title,
            }))}
            value={selectedChildCategory}
            onChange={handleChildCategoryChange}
          />
        </div>

        {selectedChildCategory && (
          <button
            onClick={handleResetFilters}
            className="text-red-500 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="h-[720px] overflow-auto mb-4">
        {fictionData.map((product) => (
          <BooksCardVertical key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end items-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed text-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
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
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed text-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
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
    </div>
  );
};

export default NonFictionData;
