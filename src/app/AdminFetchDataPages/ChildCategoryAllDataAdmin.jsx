"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";

const ChildCategoryAllDataAdmin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const [isDragging, setIsDragging] = useState(false);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const titleParam = searchParams.get("title") || "";
  const showWebParam = searchParams.get("showWebFilter") || "";

  const [titleFilter, setTitleFilter] = useState(titleParam);
  const [showWebFilter, setShowWebFilter] = useState(showWebParam);

  // Fetch data
  const fetchCategories = useCallback(
    async (isBackgroundRefresh = false) => {
      try {
        if (isBackgroundRefresh) setIsRefreshing(true);
        else setInitialLoading(true);

        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (titleParam) params.set("title", titleParam);
        if (showWebParam) params.set("showWebFilter", showWebParam);

        const res = await axios.get(
          `https://cosmetics-server-001.vercel.app/api/admin/child-category?${params.toString()}`
        );
        setCategories(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isBackgroundRefresh) setIsRefreshing(false);
        else setInitialLoading(false);
      }
    },
    [currentPage, titleParam, showWebParam]
  );

  useEffect(() => {
    fetchCategories(false);
    const intervalId = setInterval(() => {
      fetchCategories(true);
    }, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchCategories, refreshInterval]);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setIsDragging(true);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    setIsDragging(false);

    document
      .querySelectorAll(".drag-over, .dragging")
      .forEach((el) => el.classList.remove("drag-over", "dragging"));

    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    const reordered = [...categories];
    const [movedItem] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);
    setCategories(reordered);

    try {
      const positionUpdates = reordered.map((c, idx) => ({
        id: c._id,
        position: idx,
      }));

      await axios.put(
        "https://cosmetics-server-001.vercel.app/api/admin/update-position-child-category",
        { positions: positionUpdates }
      );

      await Swal.fire({
        title: "Success!",
        text: "Positions updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchCategories(false);
    } catch (err) {
      console.error("Error updating positions:", err);
      fetchCategories(false);
      await Swal.fire("Error!", "Failed to update positions", "error");
    }
  };

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value || value === false) params.set(key, value);
      else params.delete(key);
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({
      page: "1",
      title: titleFilter,
      showWebFilter: showWebFilter,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(
        `https://cosmetics-server-001.vercel.app/api/admin/delete/childcategory/${id}`
      );
      if (res.data.success) {
        fetchCategories(false);
        Swal.fire("Deleted!", "Child category deleted.", "success");
      }
    } catch (err) {
      Swal.fire(
        "Error!",
        err.response?.data?.error || "Delete failed",
        "error"
      );
    }
  };

  const clearAllFilters = useCallback(() => {
    setTitleFilter("");
    setShowWebFilter("");
    updateUrlParams({ page: "1", title: "", showWebFilter: "" });
  }, []);

  if (initialLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="fontPoppins">
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Updating...
        </div>
      )}

      {/* Filter form */}
      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Title Filter
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Filter by title"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Show on Website
            </label>
            <select
              value={showWebFilter}
              onChange={(e) => setShowWebFilter(e.target.value)}
              className="bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              className="text-white cursor-pointer bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>

      {/* Drag instructions */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Drag and drop child categories to reorder. Changes are auto-saved.
        </p>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs border-b border-gray-400 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Parent Category</th>
              <th className="px-6 py-3">Parent SubCategory</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, idx) => (
              <tr
                key={c._id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <td className="px-6 py-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </td>
                <td className="px-6 py-4 flex gap-2 items-center">
                  {c.singleImage && (
                    <img
                      src={c.singleImage}
                      alt={c.title}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <Link
                    href={`/admin/categories/add-childcategory/${c._id}`}
                    className="hover:underline hover:text-blue-600"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {c.parentCategory?.title || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {c.parentSubCategory?.title || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      c.showWebsite
                        ? "bg-pink-100 text-pink-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.showWebsite ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination same as before */}
    </div>
  );
};

export default ChildCategoryAllDataAdmin;
