"use client";
import SearchableSelect from "./SearchableSelect";
import "../../../../styles/allBooks.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowRightCircle, FiArrowUp, FiBook, FiCheck, FiFilter, FiInfo, FiLayers, FiLoader, FiRefreshCw, FiUser, FiX } from "react-icons/fi";

const AllMobileFilter = ({
  authors,
  publishers,
  tags,
  selectedAuthor,
  selectedPublisher,
  selectedTag,
  isFetchingAuthors,
  isFetchingPublishers,
  isFetchingTags,
  popularBooksFilter,
  discountFilter,
  newArrivalFilter,
  trendingNowFilter,
  newReleasedFilter,
  inStockFilter,
  onAuthorChange,
  onPublisherChange,
  onTagChange,
  onPopularBooksChange,
  onDiscountChange,
  onnewArrivalChange,
  onTrendingNowChange,
  onNewReleasedChange,
  onInStockChange,
  onClear,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };
  useEffect(() => {
    if (selectedAuthor || selectedPublisher || selectedTag) {
      closeDropdown();
    }
  }, [selectedAuthor, selectedPublisher, selectedTag]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
  };

  const panelVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: { y: "100%" },
  };

  const handleFilterChange = (filterType) => {
    // First reset all special filters
    onPopularBooksChange({ target: { value: "" } });
    onDiscountChange({ target: { value: "" } });
    onnewArrivalChange({ target: { value: "" } });
    onTrendingNowChange({ target: { value: "" } });
    onNewReleasedChange({ target: { value: "" } });
    onInStockChange({ target: { value: "" } });

    // Check if this filter is already active
    const isActive =
      (filterType === "popular" && popularBooksFilter === "true") ||
      (filterType === "discount" && discountFilter === "true") ||
      (filterType === "newArrival" && newArrivalFilter === "true") ||
      (filterType === "trending" && trendingNowFilter === "true") ||
      (filterType === "newReleased" && newReleasedFilter === "true") ||
      (filterType === "inStock" && inStockFilter === "true");

    // If not active, set the new filter
    if (!isActive) {
      const setEvent = { target: { value: "true" } };
      switch (filterType) {
        case "popular":
          onPopularBooksChange(setEvent);
          break;
        case "discount":
          onDiscountChange(setEvent);
          break;
        case "newArrival":
          onnewArrivalChange(setEvent);
          break;
        case "trending":
          onTrendingNowChange(setEvent);
          break;
        case "newReleased":
          onNewReleasedChange(setEvent);
          break;
        case "inStock":
          onInStockChange(setEvent);
          break;
      }
    }
  };

  // Handle tag click - toggle selection
  const handleTagClick = (tagId) => {
    // If this tag is already selected, clear the tag filter
    if (selectedTag === tagId) {
      onTagChange(""); // Clear tag filter
    } else {
      onTagChange(tagId); // Set the new tag filter
    }
  };

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.03 },
  };

  const clearButtonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.02 },
  };

  // Filter icons
  const filterIcons = {
    popular: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    discount: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
        />
      </svg>
    ),
    newArrival: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    trending: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    newReleased: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    inStock: (
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  };

  return (
    <div className="mobileDisplay">
  {/* Main filter bar fixed to bottom */}
  <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white border-t border-gray-200 shadow-lg">
    <div className="flex flex-row items-center justify-between mx-auto max-w-md rounded-full shadow-md p-1 border border-emerald-200 bg-white">
      {/* All Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        }}
        type="button"
        onClick={() => {
          onClear();
          closeDropdown();
        }}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-l-full transition-colors flex-1"
      >
        <FiLayers className="text-emerald-600 text-sm" />
        <span className="text-emerald-600 font-medium text-xs sm:text-sm">All Products</span>
      </motion.button>
      
      {/* Divider */}
      <div className="h-6 w-px bg-emerald-100"></div>
      
      {/* Sort Button */}
      {/* <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        }}
        onClick={() => toggleDropdown('sort')}
        className="flex items-center justify-center gap-2 px-4 py-3 transition-colors flex-1"
      >
        <FiArrowUp className="text-emerald-600 text-sm" />
        <span className="text-emerald-600 font-medium text-xs sm:text-sm">Sort</span>
      </motion.button> */}

      {/* Divider */}
      <div className="h-6 w-px bg-emerald-100"></div>

      {/* Filter Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        }}
        onClick={() => toggleDropdown('filter')}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-r-full transition-colors flex-1"
      >
        <FiFilter className="text-emerald-600 text-sm" />
        <span className="text-emerald-600 font-medium text-xs sm:text-sm">Filter</span>
      </motion.button>
    </div>
  </div>

  <AnimatePresence>
    {/* Overlay backdrop */}
    {openDropdown && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={closeDropdown}
      />
    )}

    {/* Sort Dropdown */}
    {openDropdown === 'sort' && (
      <motion.div
        key="sort-panel"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 rounded-t-3xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Sort Options</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={closeDropdown}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FiX className="text-gray-500" size={20} />
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Sort By</h4>
                <div className="space-y-2">
                  {['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Rating'].map((option) => (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="text-gray-700">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.button
                      key={tag._id}
                      type="button"
                      onClick={() => {
                        onTagChange(tag._id);
                        closeDropdown();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                        selectedTag === tag._id
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                      }`}
                    >
                      {tag.title}
                    </motion.button>
                  ))}
                  {isFetchingTags && (
                    <div className="flex items-center justify-center px-4 py-2 text-sm text-gray-500">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <FiLoader />
                      </motion.div>
                      Loading tags...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Apply Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-emerald-500 text-white font-medium rounded-lg shadow-md"
            >
              Apply Sort
            </motion.button>
          </div>
        </div>
      </motion.div>
    )}

    {/* Filter Dropdown */}
    {openDropdown === 'filter' && (
  <motion.div
    key="filter-panel"
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "100%" }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 rounded-t-3xl shadow-xl overflow-hidden"
  >
    <div className="flex flex-col h-full">
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Filter Options</h3>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={closeDropdown}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX className="text-gray-500" size={20} />
        </motion.button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-8">
          {/* Special Filters Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Special Filters</h4>
              <FiInfo className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  type: "all",
                  label: "All Products",
                  filter: discountFilter === "true" || popularBooksFilter === "true" || newArrivalFilter === "true" ? "false" : "true",
                  icon: (isActive) => (
                    <svg className="w-5 h-5" fill="none" stroke={isActive ? "#fff" : "#F01F7B"} strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M3 5h18M3 12h18M3 19h18" strokeLinecap="round" />
                    </svg>
                  ),
                  color: "bg-emerald-500",
                  activeColor: "bg-[#F01F7B]"
                },
                {
                  type: "discount",
                  label: "Discounted",
                  filter: discountFilter,
                  icon: (isActive) => (
                    <svg className="w-5 h-5" fill="none" stroke={isActive ? "#fff" : "#F59E0B"} strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M9 14l6-6M9 8h.01M15 14h.01" strokeLinecap="round" />
                    </svg>
                  ),
                  color: "bg-amber-500",
                  activeColor: "bg-amber-600"
                },
                {
                  type: "popular",
                  label: "Popular",
                  filter: popularBooksFilter,
                  icon: (isActive) => (
                    <svg className="w-5 h-5" fill="none" stroke={isActive ? "#fff" : "#EF4444"} strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M12 2l3 7h7l-5.5 4 2.5 7-6-4-6 4 2.5-7L2 9h7z" strokeLinejoin="round" />
                    </svg>
                  ),
                  color: "bg-red-500",
                  activeColor: "bg-red-600"
                },
                {
                  type: "newArrival",
                  label: "New Arrival",
                  filter: newArrivalFilter,
                  icon: (isActive) => (
                    <svg className="w-5 h-5" fill="none" stroke={isActive ? "#fff" : "#3B82F6"} strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3M5 3a9 9 0 1014 0" strokeLinecap="round" />
                    </svg>
                  ),
                  color: "bg-blue-500",
                  activeColor: "bg-blue-600"
                },
              ].map(({ type, label, filter, icon, color, activeColor }) => {
                const isActive = filter === "true";

                return (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => type === "all" ? onClear() : handleFilterChange(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 shadow-sm ${
                      isActive 
                        ? `${activeColor} text-white shadow-md` 
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isActive ? "bg-white/20" : "bg-gray-100"
                    }`}>
                      {icon(isActive)}
                    </div>
                    <span className="text-xs font-medium">{label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.button
                  key={tag._id}
                  type="button"
                  onClick={() => handleTagClick(tag._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                    selectedTag === tag._id
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  {tag.title}
                </motion.button>
              ))}
              {isFetchingTags && (
                <div className="flex items-center justify-center px-4 py-2 text-sm text-gray-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <FiLoader />
                  </motion.div>
                  Loading tags...
                </div>
              )}
            </div>
          </div>
          
          
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
        <motion.button
          whileHover={{ backgroundColor: "#F3F4F6" }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg flex items-center justify-center"
        >
          <FiRefreshCw className="mr-2" />
          Reset
        </motion.button>
        <motion.button
          whileHover={{ backgroundColor: "#059669" }}
          whileTap={{ scale: 0.95 }}
          onClick={closeDropdown}
          className="flex-1 py-3 bg-[#F01F7B] text-white font-medium rounded-lg shadow-md flex items-center justify-center"
        >
          <FiCheck className="mr-2" />
          Apply Filters
        </motion.button>
      </div>
    </div>
  </motion.div>
)}
  </AnimatePresence>
</div>
  );
};

export default AllMobileFilter;
