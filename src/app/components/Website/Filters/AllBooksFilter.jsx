"use client";
import SearchableSelect from "./SearchableSelect";
import '../../../../styles/allBooks.css';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiFilter, FiLayers } from "react-icons/fi";

const AllBooksFilter = ({
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
    visible: { opacity: 0.5 }
  };

  const panelVariants = {
    hidden: { y: "100%" },
    visible: { 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { y: "100%" }
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
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    discount: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
      </svg>
    ),
    newArrival: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    trending: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    newReleased: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    inStock: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  };




  return (
    <div className="">
  <div className="w-full shrink-0 bigDisplay">
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4 border border-gray-200">
      <div className="flex flex-row items-center justify-between mb-3 border-b border-gray-200 pb-3">
          <h3 className="text-sm font-medium text-gray-900 pb-2 flex-grow">
           Filters
          </h3>
          <div className="ml-4">
            <motion.button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 text-xs font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm flex items-center justify-center whitespace-nowrap"
              variants={clearButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </motion.button>
          </div>
        </div>

      {/* Author Filter */}
      {/* <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Authors
        </label>
        <SearchableSelect
          options={authors}
          value={selectedAuthor}
          onChange={onAuthorChange}
          placeholder="Select an author..."
          searchPlaceholder="Search authors..."
          loading={isFetchingAuthors}
          disabled={isFetchingAuthors}
          noOptionsMessage="No authors found"
        />
      </div> */}

      {/* Publisher Filter */}
      {/* <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Brands
        </label>
        <SearchableSelect
          options={publishers}
          value={selectedPublisher}
          onChange={onPublisherChange}
          placeholder="Select a publisher..."
          searchPlaceholder="Search publishers..."
          loading={isFetchingPublishers}
          disabled={isFetchingPublishers}
          noOptionsMessage="No publishers found"
        />
      </div> */}

      {/* Tags Filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.button
              key={tag._id}
              type="button"
              onClick={() => onTagChange(tag._id)}
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

      {/* Special Filters Section */}
      <div className="mb-4">
        <div className="flex flex-row items-center justify-between mb-3 border-b border-gray-200 pb-3">
          <h3 className="text-sm font-medium text-gray-900 pb-2 flex-grow">
            Special Filters
          </h3>
          
        </div>
        <div className="space-y-2">
          {[
            
            {
              type: "discount",
              label: "Discounted",
              activeText: "Discounted",
              inactiveText: "Discounted",
              filter: discountFilter,
            },
            {
              type: "popular",
              label: "Popular Products",
              activeText: "Popular Products",
              inactiveText: "Popular Products",
              filter: popularBooksFilter,
            },
            {
              type: "newArrival",
              label: "New Arrival",
              activeText: "New Arrival",
              inactiveText: "New Arrival",
              filter: newArrivalFilter,
            },
           
            // {
            //   type: "inStock",
            //   label: "In Stock Only",
            //   activeText: "In Stock Only",
            //   inactiveText: "In Stock Only",
            //   filter: inStockFilter,
            // },
          ].map(({ type, label, activeText, inactiveText, filter }) => (
            <motion.button
              key={type}
              type="button"
              onClick={() => handleFilterChange(type)}
              className={`w-full text-left px-3 py-4 cursor-pointer text-sm rounded-md transition-all duration-200 ${
                filter === "true"
                  ? "bg-pink-100 text-pink-800 border border-emerald-200 shadow-sm"
                  : "bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-700 border border-gray-200"
              }`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <span className="flex items-center">
                {filter === "true" ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {activeText}
                  </>
                ) : (
                  <>
                    {filterIcons[type]}
                    {inactiveText}
                  </>
                )}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  <div className="relative w-full mobileDisplay">
    <div className="w-full flex flex-row items-center justify-between bg-white mx-4">
      <motion.button
        whileTap="tap"
        whileHover="hover"
        variants={buttonVariants}
        type="button"
        onClick={() => {
          onClear();
          closeDropdown();
        }}
        className="flex w-full items-center gap-2 border-l border-y rounded-l border-l-rounded-lg border-emerald-500 px-4 py-2 transition-colors"
      >
        <FiLayers className="text-pink-500" />
        <span className="text-pink-500 font-medium">All</span>
      </motion.button>
      
      <motion.button
        whileTap="tap"
        whileHover="hover"
        variants={buttonVariants}
        onClick={() => toggleDropdown('sort')}
        className="flex w-full items-center gap-2 border-l border-y border-emerald-500 px-4 py-2 transition-colors"
      >
        <FiArrowUp className="text-pink-500" />
        <span className="text-pink-500 font-medium">Sort</span>
      </motion.button>

      <div className="h-6 w-px bg-gray-300"></div>

      <motion.button
        whileTap="tap"
        whileHover="hover"
        variants={buttonVariants}
        onClick={() => toggleDropdown('filter')}
        className="flex w-full items-center gap-2 border-r rounded-r border-y border-l border-r-rounded-lg border-emerald-500 px-4 py-2 transition-colors"
      >
        <FiFilter className="text-pink-500" />
        <span className="text-pink-500 font-medium">Filter</span>
      </motion.button>
    </div>

    <AnimatePresence>
      {/* Overlay backdrop */}
      {openDropdown && (
        <motion.div
          key="backdrop"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          className="fixed inset-0 bg-black/50 z-10"
          onClick={closeDropdown}
        />
      )}

      {/* Sort Dropdown */}
      {openDropdown === 'sort' && (
        <motion.div
          key="sort-panel"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          className="fixed bottom-0 left-0 right-0 h-[70%] bg-white z-20 rounded-t-lg shadow-lg p-4 overflow-y-auto"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-900">Sort</h3>
          <div className="space-y-2">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Authors
              </label>
              <SearchableSelect
                options={authors}
                value={selectedAuthor}
                onChange={(value) => {
                  onAuthorChange(value);
                  closeDropdown();
                }}
                placeholder="Select an author..."
                searchPlaceholder="Search authors..."
                loading={isFetchingAuthors}
                disabled={isFetchingAuthors}
                noOptionsMessage="No authors found"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Publishers
              </label>
              <SearchableSelect
                options={publishers}
                value={selectedPublisher}
                onChange={(value) => {
                  onPublisherChange(value);
                  closeDropdown();
                }}
                placeholder="Select a publisher..."
                searchPlaceholder="Search publishers..."
                loading={isFetchingPublishers}
                disabled={isFetchingPublishers}
                noOptionsMessage="No publishers found"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.button
                    key={tag._id}
                    type="button"
                    onClick={() => {
                      onTagChange(tag._id);
                      closeDropdown();
                    }}
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
          </div>
        </motion.div>
      )}

      {/* Filter Dropdown */}
     {openDropdown === 'filter' && (
  <motion.div
    key="filter-panel"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={panelVariants}
    className="fixed bottom-0 left-0 right-0 h-[70%] bg-white z-20 rounded-t-lg shadow-lg p-4 overflow-y-auto dark:bg-white dark:text-gray-900"
  >
    <h3 className="text-lg font-bold mb-4 dark:text-gray-900">Filter</h3>
    <div className="space-y-4">
      {/* Special Filters Section */}
      <div className="mb-4">
        <div className="flex flex-row items-center justify-between mb-3 border-b border-gray-200 pb-3 dark:border-gray-300">
          <h3 className="text-sm font-medium dark:text-gray-900 pb-2 flex-grow">
            Special Filters
          </h3>
        </div>
        <div className="space-y-2">
          {[
            {
              type: "popular",
              label: "Popular Books",
              activeText: "Popular Books",
              inactiveText: "Popular Books",
              filter: popularBooksFilter,
            },
            {
              type: "discount",
              label: "Discounted",
              activeText: "Discounted",
              inactiveText: "Discounted",
              filter: discountFilter,
            },
            {
              type: "newArrival",
              label: "Daily Deals",
              activeText: "Daily Deals",
              inactiveText: "Daily Deals",
              filter: newArrivalFilter,
            },
            {
              type: "trending",
              label: "Trending Now",
              activeText: "Trending Now",
              inactiveText: "Trending Now",
              filter: trendingNowFilter,
            },
            {
              type: "newReleased",
              label: "New Releases",
              activeText: "New Releases",
              inactiveText: "New Releases",
              filter: newReleasedFilter,
            },
            {
              type: "inStock",
              label: "In Stock Only",
              activeText: "In Stock Only",
              inactiveText: "In Stock Only",
              filter: inStockFilter,
            },
          ].map(({ type, label, activeText, inactiveText, filter }) => (
            <motion.button
              key={type}
              type="button"
              onClick={() => {
                handleFilterChange(type);
                closeDropdown();
              }}
              className={`w-full text-left px-3 py-4 cursor-pointer text-sm rounded-md transition-all duration-200 ${
                filter === "true"
                  ? "bg-pink-100 text-pink-800 border border-emerald-200 shadow-sm dark:bg-pink-200 dark:text-pink-900 dark:border-emerald-300"
                  : "bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-700 border border-gray-200 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-pink-100 dark:hover:text-pink-800 dark:border-gray-300"
              }`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <span className="flex items-center dark:text-gray-900">
                {filter === "true" ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {activeText}
                  </>
                ) : (
                  <>
                    {filterIcons[type]}
                    {inactiveText}
                  </>
                )}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)}
    </AnimatePresence>
  </div>
</div>
  );
};

export default AllBooksFilter;