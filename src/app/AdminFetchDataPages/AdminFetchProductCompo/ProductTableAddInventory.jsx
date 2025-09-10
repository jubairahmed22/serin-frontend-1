"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaStar, FaCalendarAlt, FaFire, FaNewspaper, FaTimes, FaPlus } from 'react-icons/fa';

const ProductTableAddInventory = ({ products, onDelete, currentPage, totalPages, onAddProduct }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load selected products from localStorage on component mount
  useEffect(() => {
    const loadSelectedProducts = () => {
      try {
        const savedSelections = localStorage.getItem("selectedProducts");
        if (savedSelections) {
          const parsed = JSON.parse(savedSelections);
          if (Array.isArray(parsed)) {
            setSelectedProducts(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load selections from localStorage:", error);
        localStorage.removeItem("selectedProducts");
      }
      setIsInitialized(true);
    };

    loadSelectedProducts();

    // Add storage event listener to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === "selectedProducts") {
        loadSelectedProducts();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save selected products to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(selectedProducts)
        );
      } catch (error) {
        console.error("Failed to save selections to localStorage:", error);
      }
    }
  }, [selectedProducts, isInitialized]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Toggle single product selection
  const handleSelectChange = (productId) => {
    setSelectedProducts((prev) => {
      const newSelections = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      return newSelections;
    });
  };

  // Toggle select all visible products
  const handleSelectAll = () => {
    setSelectedProducts((prev) => {
      const visibleIds = products.map((p) => p._id);
      if (selectAll) {
        // Deselect only currently visible products
        return prev.filter((id) => !visibleIds.includes(id));
      } else {
        // Select all visible products (without duplicates)
        return [...new Set([...prev, ...visibleIds])];
      }
    });
    setSelectAll(!selectAll);
  };

  // Update selectAll state when products or selections change
  useEffect(() => {
    if (products.length > 0) {
      const allVisibleSelected = products.every((p) =>
        selectedProducts.includes(p._id)
      );
      setSelectAll(allVisibleSelected);
    } else {
      setSelectAll(false);
    }
  }, [products, selectedProducts]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Main Table */}
      <div className="relative overflow-x-auto mt-5 shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs border-b border-gray-300 text-gray-700 uppercase bg-gray-100">
            <tr>
              {/* <th scope="col" className="px-6 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th> */}
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Brand
              </th>
              <th scope="col" className="px-6 py-3">
                Website
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3">
                Product Price
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 ? (
              products?.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  formatDate={formatDate}
                  onDelete={onDelete}
                  isSelected={selectedProducts.includes(product._id)}
                  onSelectChange={handleSelectChange}
                  onAddProduct={onAddProduct}
                />
              ))
            ) : (
              <tr className="bg-white border-b hover:bg-gray-50">
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No products found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductRow = ({
  product,
  formatDate,
  onDelete,
  isSelected,
  onSelectChange,
  onAddProduct
}) => {
  // Calculate discounted price
  const calculateDiscount = () => {
    if (product.discount && product.discountValue) {
      if (product.discountType === "percentage") {
        return product.price - (product.price * product.discountValue) / 100;
      }
      return product.price - product.discountValue;
    }
    return product.price;
  };

  const discountedPrice = calculateDiscount();
  const hasDiscount = product.discount && product.discountValue;

  const handleAddToCart = () => {
    const productToAdd = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      singleImage: product.singleImage,
      deliveryCharge: product.deliveryCharge || 0,
      discountedPrice: discountedPrice,
      discountValue: product.discountValue,
      discountType: product.discountType, 
      numberOfPages: product.numberOfPages || null,
      weight: product.weight || null,
      categoryId: product.categoryId || null,
      subCategoryId: product.subCategoryId || null,
      childCategoryId: product.childCategoryId || null,
      publisherId: product.publisherId || null,
      authorId: product.authorId || null
    };
    
    // Call the function passed as prop (previously called onAddToInventory)
    onAddProduct(productToAdd);
    toast.success(`${product.title} added to inventory`);
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      {/* <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectChange(product._id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          onClick={(e) => e.stopPropagation()}
        />
      </td> */}
      <ProductCell product={product} formatDate={formatDate} />
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Parent: {product.parentCategory?.title || "N/A"}</span>
          <span className="text-xs text-gray-500">Sub: {product.parentSubCategory?.title || "N/A"}</span>
          <span className="text-xs text-gray-500">Child: {product.parentChildCategory?.title || "N/A"}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span>{product.brand?.name || "N/A"}</span>
        </div>
      </td>
      <StatusCell showWebsite={product.showWebsite} />
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">Popular:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.popularBooks 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.popularProducts ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">New Arrival:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.dailyDeals 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.newArrival ? "Yes" : "No"}
            </span>
          </div>
      
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">Discount:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.discount 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.discount ? `${product.discountValue} ${product.discountType}` : "None"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {product.stock || "N/A"}
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          {hasDiscount ? (
            <>
              <span className="text-gray-400 line-through">{product.price} Tk</span>
              <span className="font-semibold text-green-600">{discountedPrice.toFixed(2)} Tk</span>
            </>
          ) : (
            <span>{product.price || "N/A"} Tk</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <motion.button
          onClick={handleAddToCart}
          className="relative overflow-hidden px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ 
            scale: 0.98,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15
          }}
        >
          {/* Ripple effect container */}
          <span className="absolute inset-0 overflow-hidden">
            <motion.span
              className="absolute bg-white opacity-0 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 10, opacity: 0 }}
              transition={{ duration: 0.6 }}
              key={Math.random()} // Force re-render on each click
            />
          </span>
          
          {/* Button content with icon */}
          <div className="flex items-center justify-center gap-2">
            <FaPlus className="h-4 w-4" />
            <span className="text-sm">Add To Inventory</span>
          </div>
        </motion.button>
      </td>
    </tr>
  );
};

const ProductCell = ({ product, formatDate }) => (
  <th
    scope="row"
    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
  >
    <div className="flex flex-row gap-3 w-56">
      <div>
        {product.singleImage && (
          <img
            src={product.singleImage}
            alt={product.title}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
      </div>
      <Link
        href={`/admin/products/all-products/${product._id}`}
        className="hover:underline hover:text-blue-600"
      >
        <div className="flex flex-col gap-1">
          <span className="font-medium">{product.title.slice(0,20) || "N/A"}...</span>
          <span className="text-xs text-gray-500">
            Created: {formatDate(product.createdAt)}
          </span>
        </div>
      </Link>
    </div>
  </th>
);

const StatusCell = ({ showWebsite }) => (
  <td className="px-6 py-4">
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        showWebsite
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {showWebsite ? "Visible" : "Hidden"}
    </span>
  </td>
);

export default ProductTableAddInventory;