"use client";

const OrderItemsTable = ({
  cartItems,
  handleEditClick,
  handleRemoveCartItem,
  calculateTotal,
  onAddProduct,
  onAddInventory,
}) => {
  // Function to calculate the discounted price for an item
  const calculateItemTotal = (item) => {
    if (item.discountValue > 0) {
      if (item.discountType === "percentage") {
        const discountAmount = item.price * (item.discountValue / 100);
        return (item.price - discountAmount) * item.quantity;
      } else {
        // Fixed discount
        return (item.price - item.discountValue) * item.quantity;
      }
    }
    return item.price * item.quantity;
  };

  // Function to get the discounted unit price
  const getDiscountedPrice = (item) => {
    if (item.discountValue > 0) {
      if (item.discountType === "percentage") {
        const discountAmount = item.price * (item.discountValue / 100);
        return (item.price - discountAmount).toFixed(2);
      } else {
        // Fixed discount
        return (item.price - item.discountValue).toFixed(2);
      }
    }
    return item.price.toFixed(2);
  };

  return (
    <div className="space-y-6 fontPoppins">
      <div className="flex justify-between items-center border-b pb-4">
        
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-700">Order Items</h2>
          <div className="flex flex-row gap-5">
            <button
            type="button"
            onClick={onAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={onAddInventory}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
          >
            Add Inventory
          </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Actions
          </th>
          <th scope="col" className="pl-6 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Product
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Price
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Qty
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Discount
          </th>
          <th scope="col" className="px-3 border-r border-r-gray-300 py-3.5 text-left text-sm font-semibold text-gray-900">
            Total
          </th>
          
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <tr key={item.productId || index} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <button
                  type="button"
                  onClick={() => handleEditClick(item, index)}
                  className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                  title="Edit item"
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
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCartItem(index)}
                  className="text-rose-600 hover:text-rose-900 focus:outline-none"
                  title="Remove item"
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
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  {item.image && (
                    <div className="h-10 w-10 flex-shrink-0 mr-4">
                      <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.title} />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {item.productId}
                      {item._id && ` (${item._id})`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {item.discountValue > 0 ? (
                  <div className="flex flex-col">
                    <span className="line-through text-gray-400">
                      {item.price.toFixed(2)} tk
                    </span>
                    <span className="text-gray-900 font-medium">
                      {getDiscountedPrice(item)} tk
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {item.price.toFixed(2)} tk
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                  {item.quantity}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {item.discountValue > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">
                    {item.discountValue}
                    {item.discountType === "percentage" ? "%" : " tk"}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 border-r border-r-gray-300 text-sm font-medium text-gray-900">
                {calculateItemTotal(item).toFixed(2)} tk
              </td>
              
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="6"
              className="px-6 py-12 text-center"
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items in this order</h3>
                <p className="mt-1 text-sm text-gray-500">Start adding products to see them here.</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default OrderItemsTable;
