"use client";

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [productData, setProductData] = useState({
    productId: "",
    title: "",
    price: 0,
    quantity: 1,
    stock: 0,
    categoryId: null,
    subCategoryId: null,
    childCategoryId: null,
    publisherId: null,
    authorId: null
  });

  useEffect(() => {
    if (isOpen) {
      // Generate 8-digit random number for productId when modal opens
      const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();
      setProductData(prev => ({
        ...prev,
        productId: randomId
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: ["price", "quantity", "stock"].includes(name) 
        ? (value === "" ? null : Number(value))
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!productData.productId || !productData.title || productData.price <= 0) {
      toast.error("Please fill in Product ID, Title, and valid Price");
      return;
    }

    const finalProduct = {
      ...productData,
      _id: `temp-${Date.now()}` // Temporary ID for frontend
    };

    onAddProduct(finalProduct);
    setProductData({
      productId: "",
      title: "",
      price: 0,
      quantity: 1,
      stock: 0,
      categoryId: null,
      subCategoryId: null,
      childCategoryId: null,
      publisherId: null,
      authorId: null
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20  backdrop-blur fontPoppins bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[700px]   overflow-y-auto">

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-800">Add custom product</h3>
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Fields */}
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-6">
              

            {/* Pricing Section */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Price*
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={productData.price}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Quantity and Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={productData.quantity}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={productData.stock}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Product ID*
                </label>
                <input
                  type="text"
                  name="productId"
                  value={productData.productId}
                  onChange={handleInputChange}
                  disabled
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  readOnly
                />
              </div>
            </div>

          </div>

          <div className="mt-6 flex justify-start space-x-3">
            {/* <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;