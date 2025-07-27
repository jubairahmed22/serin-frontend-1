"use client";
import React, { useState, useEffect } from "react";
import "../../styles/homePage.css";
import "../../styles/globals.css";
import { useRouter } from "next/navigation";
import AuthorCardSkeleton from "../components/Spinner/AuthorCardSkeleton";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchAuthors = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const url = new URL("https://books-server-001.vercel.app/api/web/main-all-author");
      url.searchParams.append("page", page);
      if (search) {
        url.searchParams.append("title", search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch authors");
      }
      const data = await response.json();
      setAuthors(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAuthors(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAuthors(newPage, searchTerm);
    }
  };

  const router = useRouter();

  const handleAuthorClick = (author) => {
    return (e) => {
      e.preventDefault();
      const params = new URLSearchParams();
      params.set("author", author._id);
      router.push(`/all-books?${params.toString()}`);
    };
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
    <div className="min-h-screen py-10 bg-white max-w-[1400px] font-poppins mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="lg:text-3xl md:text-xl sm:text-sm font-bold text-gray-900">All Authors</h1>

        <form onSubmit={handleSearch} className="w-96 md:w-auto">
          <div className="relative">
            {loading ? (
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Search authors..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={`skeleton-${index}`} className="cursor-pointer">
              <AuthorCardSkeleton />
            </div>
          ))}
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No authors found. Try a different search.
        </div>
      ) : (
        <>
          <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author) => (
              <button 
                key={author._id}  
                onClick={handleAuthorClick(author)} 
                className="cursor-pointer"
              >
                <div className="max-w-sm bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                  <div className="relative w-full h-64 overflow-hidden">
                    <img
                      src={author.singleImage || "/default-author.jpg"}
                      alt={author.title}
                      className="absolute rounded-2xl w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-author.jpg";
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 bangla-text text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      {author.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === pageNum
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorsPage;