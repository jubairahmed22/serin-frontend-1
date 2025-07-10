const ChildCategorySelect = ({
  childCategories,
  isFetchingChildCategories,
  selectedChildCategory,
  setSelectedChildCategory,
  selectedSubCategory,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm fontPoppins text-gray-800 mb-1">
        Child Category <span className="text-red-500">*</span>
      </label>
      <div className="relative rounded-md shadow-sm">
        {isFetchingChildCategories ? (
          <div className="block w-full px-4 py-3 border border-gray-300 rounded-lg">
            Loading child categories...
          </div>
        ) : (
          <select
            value={selectedChildCategory?._id || ""}
            onChange={(e) => {
              const selected = childCategories.find(
                (childCat) => childCat._id === e.target.value
              );
              setSelectedChildCategory(selected);
            }}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          >
            <option value="">Select a child category</option>
            {childCategories.map((childCat) => (
              <option key={childCat._id} value={childCat._id}>
                {childCat.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default ChildCategorySelect;