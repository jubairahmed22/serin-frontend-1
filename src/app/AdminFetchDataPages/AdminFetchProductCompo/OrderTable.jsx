"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaCalendarAlt,
  FaFire,
  FaNewspaper,
  FaTimes,
  FaClock,
} from "react-icons/fa";

const OrderTable = ({
  products,
  onDelete,
  totalSum,
  totalDueSum,
  currentPage,
  totalPages,
}) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load selected products from localStorage on component mount
  useEffect(() => {
    const loadSelectedProducts = () => {
      try {
        const savedSelections = localStorage.getItem("selectedOrder");
        if (savedSelections) {
          const parsed = JSON.parse(savedSelections);
          if (Array.isArray(parsed)) {
            setSelectedProducts(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load selections from localStorage:", error);
        localStorage.removeItem("selectedOrder");
      }
      setIsInitialized(true);
    };

    loadSelectedProducts();

    // Add storage event listener to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === "selectedOrder") {
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
        localStorage.setItem("selectedOrder", JSON.stringify(selectedProducts));
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

  // Clear all selections
  const clearSelections = () => {
    if (confirm("Clear all selections?")) {
      setSelectedProducts([]);
    }
  };

  const handleMakePaymentSuccess = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/make-payment-success",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMakePaymentPending = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/make-payment-pending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemovePopular = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/remove-popular-books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkAsDailyBooks = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/add-dailyDeals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveDailyBooks = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/remove-dailyDeals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkAsTrendingNow = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/add-trendingNow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveTrendingNow = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/remove-trending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkAsNewReleased = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/new-released",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveNewReleased = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/remove/new-released",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedProducts }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // 'percentage' or 'fixed'

  return (
    <div className=" shadow-md sm:rounded-lg">
      <div className="flex flex-row gap-5 px-5 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-black">
            Selected: {selectedProducts.length}
          </span>

          <button
            onClick={handleSelectAll}
            className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              selectAll
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
                : "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
            }`}
          >
            {selectAll ? "Deselect All" : "Select All"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleMakePaymentSuccess}
            className="px-4 py-2 flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <FaStar className="h-4 w-4" />
            Add to payment success
          </button>

          <button
            onClick={handleMakePaymentPending}
            className="px-4 py-2 flex items-center justify-center gap-2 bg-indigo-400 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <FaClock className="h-4 w-4" />
            Add to payment pending
          </button>
        </div>
      </div>
      {/* Main Table */}
      <div className="relative overflow-x-auto ">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs  border-b border-gray-400 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </th>
              <th scope="col" className="px-6 py-3">
                Client
              </th>
              <th scope="col" className="px-6 py-3">
                Order Details
              </th>
              <th scope="col" className="px-6 py-3">
                Transaction Id
              </th>
              <th scope="col" className="px-6 py-3">
                Method
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3 ">
                Price
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
                />
              ))
            ) : (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No products found matching your filters
                </td>
              </tr>
            )}
          </tbody>
          <thead className="text-xs   text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 w-10">
                
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
                Total :
              </th>
              <th scope="col" className="px-6 py-3 ">
                {totalSum}
              </th>
              <th scope="col" className="px-6 py-3 text-right">
              </th>
            </tr>
          </thead>
          <thead className="text-xs   text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 w-10">
                
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
              <th scope="col" className="px-6 py-3">
                Due :
              </th>
              <th scope="col" className="px-6 py-3 ">
                {totalDueSum}
              </th>
              <th scope="col" className="px-6 py-3 text-right">
              </th>
            </tr>
          </thead>
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
}) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectChange(product._id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <ProductCell product={product} formatDate={formatDate} />
      <td className="px-6 py-4 ">
        <div className="flex flex-col">
          <span>Name : {product.name || "N/A"}</span>
          <span>Email : {product.email || "N/A"}</span>
          <span>Phone : {product.phone || "N/A"}</span>
        </div>
      </td>

      <td className="px-6 py-4">{product.transactionId}</td>
      <td className="px-6 py-4">{product.method}</td>
      <td className="px-6 py-4 whitespace-nowrap">{product.status}</td>
      <td className="px-6 py-4">{product.total || "N/A"} Tk</td>
      <DeleteCell productId={product._id} onDelete={onDelete} />
    </tr>
  );
};

const ProductCell = ({ product, formatDate }) => (
  <th
    scope="row"
    className="px-6 py-4  font-medium text-gray-900 whitespace-nowrap dark:text-white"
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
        href={`/admin/orders/all-orders/${product._id}`}
        className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span>Name : {product.name || "N/A"}</span>
            <span>Email : {product.email || "N/A"}</span>
            <span>Phone : {product.phone || "N/A"}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Order Date: {formatDate(product.createdAt)}
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
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      {showWebsite ? "Visible" : "Hidden"}
    </span>
  </td>
);

const DeleteCell = ({ productId, onDelete }) => (
  <td className="px-6 py-4 text-right">
    <div className="flex justify-end gap-2">
      <button
        onClick={() => onDelete(productId)}
        className="font-medium text-red-600 dark:text-red-500 hover:underline"
      >
        <button
          onClick={() => onDelete(productId)}
          className="flex cursor-pointer items-center gap-1 font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          {/* Trash Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </button>
    </div>
  </td>
);

export default OrderTable;
