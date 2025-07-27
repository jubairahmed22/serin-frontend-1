"use client";
import SearchableSelect from "./SearchableSelect";
import { motion } from "framer-motion";

const AllBooksFilterAdmin = ({
  authors,
  publishers,
  selectedAuthor,
  selectedPublisher,
  titleValue,
  productIdValue,
  isFetchingAuthors,
  isFetchingPublishers,
  popularBooksFilter,
  discountFilter,
  dailyDealsFilter,
  trendingNowFilter,
  newReleasedFilter,
  inStockFilter,
  onAuthorChange,
  onPublisherChange,
  onTitleChange,
  onProductIdChange,
  onPopularBooksChange,
  onDiscountChange,
  onDailyDealsChange,
  onTrendingNowChange,
  onNewReleasedChange,
  onInStockChange,
  onClear,
}) => {
  const handleFilterChange = (filterType) => {
    // First reset all special filters
    onPopularBooksChange({ target: { value: "" } });
    onDiscountChange({ target: { value: "" } });
    onDailyDealsChange({ target: { value: "" } });
    onTrendingNowChange({ target: { value: "" } });
    onNewReleasedChange({ target: { value: "" } });
    onInStockChange({ target: { value: "" } });

    // Check if this filter is already active
    const isActive =
      (filterType === "popular" && popularBooksFilter === "true") ||
      (filterType === "discount" && discountFilter === "true") ||
      (filterType === "dailyDeals" && dailyDealsFilter === "true") ||
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
        case "dailyDeals":
          onDailyDealsChange(setEvent);
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
    dailyDeals: (
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
    <div className="w-full md:w-72 shrink-0">
      <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 p-4 sticky top-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Filters
        </h2>

        {/* Title Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Title
          </label>
          <input
            type="text"
            value={titleValue || ""}
            onChange={onTitleChange}
            placeholder="Search by title..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Product ID Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product ID
          </label>
          <input
            type="text"
            value={productIdValue || ""}
            onChange={onProductIdChange}
            placeholder="Search by product ID..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Author Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
        </div>

        {/* Publisher Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Publishers
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
        </div>

        {/* Special Filters Section */}
        <div className="mb-4">
          <div className="flex flex-row items-center justify-between mb-3 border-b border-gray-200 pb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white  dark:border-gray-700 pb-2 flex-grow">
              Special Filters
            </h3>
            <div className="ml-4">
              <motion.button
                type="button"
                onClick={onClear}
                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-800 transition-all duration-200 shadow-sm flex items-center justify-center whitespace-nowrap"
                variants={clearButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset All
              </motion.button>
            </div>
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
                type: "dailyDeals",
                label: "Daily Deals",
                activeText: "Daily Deals",
                inactiveText: "Daily Deals",
                filter: dailyDealsFilter,
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
                onClick={() => handleFilterChange(type)}
                className={`w-full text-left px-3 py-4 cursor-pointer text-sm rounded-md transition-all duration-200 ${
                  filter === "true"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800 shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-100 dark:border-gray-600"
                }`}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="flex items-center">
                  {filter === "true" ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
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
  );
};

export default AllBooksFilterAdmin;