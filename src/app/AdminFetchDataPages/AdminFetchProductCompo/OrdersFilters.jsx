"use client";

const OrdersFilters = ({
  categories,
  subCategories,
  childCategories,
  authors,
  publishers,
  selectedCategory,
  
  selectedSubCategory,
  selectedChildCategory,
  selectedAuthor,
  selectedPublisher,
  isFetchingCategories,
  isFetchingSubCategories,
  isFetchingChildCategories,
  isFetchingAuthors,
  isFetchingPublishers,
  titleFilter,
  showWebFilter,
  popularBooksFilter,
  discountFilter,
  dailyDealsFilter,
  trendingNowFilter,
  newReleasedFilter,
  onCategoryChange,
  onSubCategoryChange,
  onChildCategoryChange,
  onAuthorChange,
  onPublisherChange,
  onTitleChange,
  onShowWebChange,
  onPopularBooksChange,
  onDiscountChange,
  onDailyDealsChange,
  onTrendingNowChange,
  onNewReleasedChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onClear,
  nameFilter,
  emailFilter,
  phoneFilter,
  transactionIdFilter,
  statusFilter,
  methodFilter,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onTransactionIdChange,
   onStatusChange,

}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Title and Show Web Filters */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
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
                onChange={onTitleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Filter by title"
              />
            </div>
          </div>
           {/* Date Range Filters */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={onStartDateChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={onEndDateChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Category Hierarchy Filters */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          {/* Category Select */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Category
            </label>
            <select
              value={selectedCategory?._id || ""}
              onChange={onCategoryChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled={isFetchingCategories}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category Select */}
          {selectedCategory && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Sub Category
              </label>
              <select
                value={selectedSubCategory?._id || ""}
                onChange={onSubCategoryChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isFetchingSubCategories}
              >
                <option value="">All Sub Categories</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Child Category Select */}
          {selectedSubCategory && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Child Category
              </label>
              <select
                value={selectedChildCategory?._id || ""}
                onChange={onChildCategoryChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isFetchingChildCategories}
              >
                <option value="">All Child Categories</option>
                {childCategories.map((childCategory) => (
                  <option key={childCategory._id} value={childCategory._id}>
                    {childCategory.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Author and Publisher Filters */}
        <div className="grid grid-cols-3 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Author
            </label>
            <select
              value={selectedAuthor || ""}
              onChange={onAuthorChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled={isFetchingAuthors}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Publisher
            </label>
            <select
              value={selectedPublisher || ""}
              onChange={onPublisherChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled={isFetchingPublishers}
            >
              <option value="">All Publishers</option>
              {publishers.map((publisher) => (
                <option key={publisher._id} value={publisher._id}>
                  {publisher.title}
                </option>
              ))}
            </select>
          </div>
         
        </div>

        {/* Boolean Status Filters */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="text"
              value={emailFilter}
              onChange={onEmailChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Customer email"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Phone
            </label>
            <input
              type="text"
              value={phoneFilter}
              onChange={onPhoneChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Customer phone"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionIdFilter}
              onChange={onTransactionIdChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Transaction ID"
            />
          </div>
           <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Status
            </label>
            <select
              value={statusFilter || ""}
              onChange={onStatusChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-row gap-4">
          <button
            type="submit"
            className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-white cursor-pointer bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default OrdersFilters;
