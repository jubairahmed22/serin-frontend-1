"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

const AuthorAllDataAdmin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State for data and loading
  const [categories, setCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [isRefreshing, setIsRefreshing] = useState(false); // For background refreshes
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshInterval, setRefreshInterval] = useState(1000); // Default 1 second

  // Get current params
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const titleParam = searchParams.get("title") || "";
  const showWebParam = searchParams.get("showWebFilter") || "";

  // Local state for form inputs
  const [titleFilter, setTitleFilter] = useState(titleParam);
  const [showWebFilter, setShowWebFilter] = useState(showWebParam);

  // Fetch data function
  const fetchCategories = useCallback(
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

        const response = await axios.get(
          `https://books-server-001.vercel.app/api/admin/all-author/?${params.toString()}`
        );
        setCategories(response.data.products);
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
    [currentPage, titleParam, showWebParam]
  );

  // Set up interval for auto-refresh
  useEffect(() => {
    // Fetch immediately on mount (not a background refresh)
    fetchCategories(false);

    // Set up interval for background refreshes
    const intervalId = setInterval(() => {
      fetchCategories(true);
    }, refreshInterval);

    // Clean up interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [fetchCategories, refreshInterval]);

  // Update URL when filters or pagination changes
  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value || value === false) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({
      page: "1", // Reset to first page
      title: titleFilter,
      showWebFilter: showWebFilter,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `https://books-server-001.vercel.app/api/admin/delete/author/${id}`
      );

      if (response.data.success) {
        // Refresh the categories after deletion
        fetchCategories(false); // Not a background refresh

        await Swal.fire(
          "Deleted!",
          "Your category has been deleted.",
          "success"
        );
      }
    } catch (err) {
      await Swal.fire(
        "Error!",
        err.response?.data?.error || "Failed to delete category",
        "error"
      );
    }
  };

  const clearAllFilters = useCallback(() => {
    setTitleFilter("");
    setShowWebFilter("");
    updateUrlParams({
      page: "1",
      title: "",
      showWebFilter: "",
    });
  }, []);

  if (initialLoading) return <div className="p-4">Loading categories...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="fontPoppins">
      {/* Filter Form */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Updating...
        </div>
      )}

      <form
  onSubmit={handleFilterSubmit}
  className="mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-white dark:shadow-gray-300"
>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
        Title Filter
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-white dark:border-gray-400 dark:text-black dark:placeholder-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Filter by title"
        />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
        Show on Website
      </label>
      <select
        value={showWebFilter}
        onChange={(e) => setShowWebFilter(e.target.value)}
        className="bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">All</option>
        <option value="true">Show on Website</option>
        <option value="false">Hidden on Website</option>
      </select>
    </div>

    <div className="flex flex-row gap-5">
      <button
        type="submit"
        className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Apply Filters
      </button>
      <button
        type="button"
        onClick={clearAllFilters}
        className="text-white cursor-pointer bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
      >
        Clear Filters
      </button>
    </div>
  </div>
</form>

      {/* Categories Table */}
     <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
    <thead className="text-xs border-b border-gray-400 text-gray-700 uppercase bg-gray-50 dark:bg-gray-100 dark:text-black">
      <tr>
        <th scope="col" className="px-6 py-3">
          Title
        </th>
        <th scope="col" className="px-6 py-3">
          Status
        </th>
        <th scope="col" className="px-6 py-3 flex justify-end">
          Delete
        </th>
      </tr>
    </thead>
    <tbody>
      {categories.length > 0 ? (
        categories.map((category) => (
          <tr
            key={category._id}
            className="bg-white border-b border-gray-200 dark:bg-white dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100"
          >
            <th
              scope="row"
              className="px-6 py-4 flex flex-row gap-3 items-center font-medium text-gray-900 whitespace-nowrap dark:text-black"
            >
              <span>
                {category.singleImage && (
                  <img
                    src={category.singleImage}
                    alt={category.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </span>
              <Link
                href={`/admin/products/add-author/${category._id}`}
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-600"
              >
                {category.title}
              </Link>
            </th>

            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.showWebsite
                    ? "bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800"
                    : "bg-red-100 text-red-800 dark:bg-red-100 dark:text-red-800"
                }`}
              >
                {category.showWebsite ? "Visible" : "Hidden"}
              </span>
            </td>

            <td className="px-6 py-4 text-right">
              <button
                onClick={() => handleDelete(category._id)}
                className="font-medium cursor-pointer text-red-600 dark:text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr className="bg-white border-b dark:bg-white dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100">
          <td
            colSpan="4"
            className="px-6 py-4 text-center text-gray-500 dark:text-gray-600"
          >
            No categories found matching your filters
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
      {/* Pagination */}
      {totalPages > 1 && (
  <div className="mt-6 flex justify-center">
    <nav
      className="inline-flex rounded-md shadow-sm -space-x-px"
      aria-label="Pagination"
    >
      {currentPage > 1 && (
        <button
          onClick={() =>
            updateUrlParams({ page: (currentPage - 1).toString() })
          }
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-white dark:border-gray-400 dark:text-black dark:hover:bg-gray-100"
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => updateUrlParams({ page: page.toString() })}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === page
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-100 dark:border-blue-300 dark:text-blue-800"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-white dark:border-gray-400 dark:text-black dark:hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() =>
            updateUrlParams({ page: (currentPage + 1).toString() })
          }
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-white dark:border-gray-400 dark:text-black dark:hover:bg-gray-100"
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </nav>
  </div>
)}
    </div>
  );
};

export default AuthorAllDataAdmin;
