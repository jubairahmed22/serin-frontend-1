"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const EditOrders = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  // State management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    method: "",
    status: "",
    cart: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState({
    productId: "",
    title: "",
    price: 0,
    quantity: 1,
  });
  const [currentCartIndex, setCurrentCartIndex] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (orderId) {
          const orderResponse = await axios.get(
            `https://books-server-001.vercel.app/api/admin/all-order/${orderId}`
          );
          const order = orderResponse.data;
          setFormData({
            name: order.name || "",
            email: order.email || "",
            phone: order.phone || "",
            address: order.address || "",
            title: order.title || "",
            method: order.method || "",
            status: order.status || "",
            cart: order.cart || [],
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load order data");
      }
    };
    fetchInitialData();
  }, [orderId]);

  // Handle cart item edit
  const handleEditClick = (item, index) => {
    setCurrentCartItem(item);
    setCurrentCartIndex(index);
    setIsModalOpen(true);
  };

  // Handle cart item changes in modal
  const handleCartItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentCartItem((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  // Save edited cart item
  const handleSaveCartItem = () => {
    if (!currentCartItem.productId || !currentCartItem.title) {
      toast.error("Product ID and Title are required");
      return;
    }

    setFormData((prev) => {
      const updatedCart = [...prev.cart];
      updatedCart[currentCartIndex] = currentCartItem;
      return {
        ...prev,
        cart: updatedCart,
      };
    });

    setIsModalOpen(false);
  };

  // Remove cart item
  const handleRemoveCartItem = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData((prev) => ({
          ...prev,
          cart: prev.cart.filter((_, i) => i !== index),
        }));
        toast.success("Item removed successfully");
      }
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `https://books-server-001.vercel.app/api/admin/update/all-orders/${orderId}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.fire({
        title: "Success!",
        text: "Order updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push(`/admin/orders/all-orders`);
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data?.error || "Order Update Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate total
  const calculateTotal = () => {
    return formData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Order #{orderId}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-700">Customer Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>

               

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Method</option>
                      <option value="BKash Mobile Banking">BKash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash On Delivery">Cash On Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="success">Success</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-700">Order Items</h2>
              </div>

              {/* Cart Items List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.cart.length > 0 ? (
                        formData.cart.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500">ID: {item.productId}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <button
                                type="button"
                                onClick={() => handleEditClick(item, index)}
                                className="text-blue-600 hover:text-blue-900 mr-3 focus:outline-none"
                              >
                                Edit
                              </button>
                              {/* <button
                                type="button"
                                onClick={() => handleRemoveCartItem(index)}
                                className="text-red-600 hover:text-red-900 focus:outline-none"
                              >
                                Remove
                              </button> */}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
                            No items in this order
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-right text-sm font-medium text-gray-700"
                        >
                          Order Total:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${calculateTotal().toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/admin/orders/all-orders")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Cart Item</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productId"
                  value={currentCartItem.productId}
                  onChange={handleCartItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentCartItem.title}
                  onChange={handleCartItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={currentCartItem.price}
                    onChange={handleCartItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={currentCartItem.quantity}
                    onChange={handleCartItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCartItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditOrders;