"use client";

const EditItemModal = ({
  isOpen,
  onClose,
  currentCartItem,
  handleCartItemChange,
  handleSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur fontPoppins bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[40%] rounded-xl">
        <div className="flex justify-between rounded-t-xl items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-800">Edit product</h3>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={currentCartItem.title}
              onChange={handleCartItemChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={currentCartItem.price}
                onChange={handleCartItemChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={currentCartItem.quantity}
                onChange={handleCartItemChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Discount Type
              </label>
              <select
                name="discountType"
                value={currentCartItem.discountType || ""}
                onChange={handleCartItemChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">No Discount</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            {currentCartItem.discountType && (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Discount Value{" "}
                  {currentCartItem.discountType === "percentage"
                    ? "(%)"
                    : "($)"}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={currentCartItem.discountValue || ""}
                  onChange={handleCartItemChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  min="0"
                  step={
                    currentCartItem.discountType === "percentage" ? "1" : "0.01"
                  }
                  max={
                    currentCartItem.discountType === "percentage" ? "100" : ""
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-start p-5 space-x-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
