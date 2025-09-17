"use client";
import SearchableSelect from "./SearchableSelect";
import "../../../../styles/allBooks.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp, FiFilter, FiLayers } from "react-icons/fi";

const AllWebFilter = ({
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
    <div className="w-full">
      <div className="flex flex-row mt-3 gap-3  w-full">
  {[
    {
      type: "all",
      label: "All Products",
      activeText: "All Products",
      inactiveText: "All Products",
      filter:
        discountFilter === "true" ||
        popularBooksFilter === "true" ||
        newArrivalFilter === "true"
          ? "false"
          : "true",
      icon: (isActive) => (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={isActive ? "#414143" : "#F01F7B"}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M3 5h18M3 12h18M3 19h18" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      type: "discount",
      label: "Discounted",
      activeText: "Discounted",
      inactiveText: "Discounted",
      filter: discountFilter,
      icon: (isActive) => (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={isActive ? "#414143" : "#F01F7B"}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 14l6-6M9 8h.01M15 14h.01" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      type: "popular",
      label: "Popular",
      activeText: "Popular",
      inactiveText: "Popular",
      filter: popularBooksFilter,
      icon: (isActive) => (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={isActive ? "#414143" : "#F01F7B"}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2l3 7h7l-5.5 4 2.5 7-6-4-6 4 2.5-7L2 9h7z"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      type: "newArrival",
      label: "New Arrival",
      activeText: "New Arrival",
      inactiveText: "New Arrival",
      filter: newArrivalFilter,
      icon: (isActive) => (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={isActive ? "#414143" : "#F01F7B"}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M12 8v4l3 3M5 3a9 9 0 1014 0" strokeLinecap="round" />
        </svg>
      ),
    },
  ].map(({ type, activeText, inactiveText, filter, icon }) => {
    const isActive = filter === "true";

    return (
      <motion.button
        key={type}
        type="button"
        onClick={() =>
          type === "all" ? onClear() : handleFilterChange(type)
        }
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium 
          shadow-md backdrop-blur-md border
          ${
            isActive && type !== "all"
              ? "bg-gradient-to-r from-pink-200 to-pink-100 text-[#414143] border-pink-300"
              : type === "all" && isActive
              ? "bg-gradient-to-r from-pink-300 to-pink-200 text-[#414143] border-pink-400"
              : "bg-white text-[#414143] hover:bg-pink-50 hover:text-[#F01F7B] border-gray-200"
          }`}
        variants={buttonVariants}
        initial="initial"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon(isActive)}
        {isActive ? activeText : inactiveText}
      </motion.button>
    );
  })}
</div>


      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <motion.button
            key={tag._id}
            type="button"
            onClick={() => handleTagClick(tag._id)}
            className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
              selectedTag === tag._id
                ? "bg-pink-100 text-pink-800 border border-emerald-200 shadow-sm"
                : "bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-700 border border-gray-200"
            }`}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            {tag.title}
          </motion.button>
        ))}
        {isFetchingTags && (
          <div className="px-3 py-1.5 text-xs text-gray-500">
            Loading tags...
          </div>
        )}
      </div>
    </div>
  );
};

export default AllWebFilter;
