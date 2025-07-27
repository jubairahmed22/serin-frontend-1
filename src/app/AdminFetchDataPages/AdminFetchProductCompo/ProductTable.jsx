"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaStar, FaCalendarAlt, FaFire, FaNewspaper, FaTimes, } from 'react-icons/fa';

const ProductTable = ({ products, onDelete, currentPage, totalPages }) => {
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

  // Clear all selections
  const clearSelections = () => {
    if (confirm("Clear all selections?")) {
      setSelectedProducts([]);
    }
  };

  const handleMarkAsPopular = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/add-popular-books",
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

  const handleMarkAsDiscount = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    // Validate discount value based on type
    const discountNum = parseFloat(discountValue);
    if (isNaN(discountNum) || discountNum < 0) {
      alert("Please enter a valid discount value");
      return;
    }

    // Additional validation for percentage
    if (discountType === "percentage" && discountNum > 100) {
      alert("Percentage discount cannot be more than 100%");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/add-status-discount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedProducts,
            discountValue: discountNum,
            discountType,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
        setDiscountValue("");
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveDiscount = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/admin/remove-discount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedProducts,
            discountValue: 0,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedProducts([]);
        setDiscountValue("");
      } else {
        throw new Error(data.error || "Failed to update statuses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className=" ">
      {/* Control Panel */}
      <div></div>

      <div className="space-y-4 p-4 bg-white dark:bg-white rounded-lg shadow-sm dark:shadow-gray-300">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Discount Controls */}
    <div className="flex flex-col space-y-2 p-4 bg-gray-50 dark:bg-gray-100 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 dark:text-black">
        Apply Discount
      </h3>
      <div className="flex flex-wrap gap-2">
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-white text-black"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>

        <input
          type="number"
          min="0"
          max={discountType === "percentage" ? "100" : ""}
          step="0.01"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-white text-black"
          placeholder={
            discountType === "percentage" ? "0-100%" : "Amount"
          }
        />

        <button
          onClick={handleMarkAsDiscount}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Apply
        </button>
      </div>
    </div>

    {/* Category Buttons */}
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        {/* Add to Categories Section */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleMarkAsPopular}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FaStar className="h-4 w-4" />
              Popular Books
            </button>
            <button
              onClick={handleMarkAsDailyBooks}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <FaCalendarAlt className="h-4 w-4" />
              Daily Books
            </button>
            <button
              onClick={handleMarkAsTrendingNow}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <FaFire className="h-4 w-4" />
              Trending Now
            </button>
            <button
              onClick={handleMarkAsNewReleased}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <FaNewspaper className="h-4 w-4" />
              New Releases
            </button>
          </div>
        </div>

        {/* Remove from Categories Section */}
        <div>
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleRemoveDiscount}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-indigo-500/20 text-indigo-700 dark:text-indigo-800 text-sm font-medium rounded-md hover:bg-indigo-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-indigo-300 dark:border-indigo-400"
            >
              <FaTimes className="h-4 w-4" />
              Remove Discount
            </button>
            <button
              onClick={handleRemovePopular}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-indigo-500/20 text-indigo-700 dark:text-indigo-800 text-sm font-medium rounded-md hover:bg-indigo-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-indigo-300 dark:border-indigo-400"
            >
              <FaTimes className="h-4 w-4" />
              Remove Popular
            </button>
            <button
              onClick={handleRemoveDailyBooks}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-amber-500/20 text-amber-700 dark:text-amber-800 text-sm font-medium rounded-md hover:bg-amber-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 border border-amber-300 dark:border-amber-400"
            >
              <FaTimes className="h-4 w-4" />
              Remove Daily
            </button>
            <button
              onClick={handleRemoveTrendingNow}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-rose-500/20 text-rose-700 dark:text-rose-800 text-sm font-medium rounded-md hover:bg-rose-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 border border-rose-300 dark:border-rose-400"
            >
              <FaTimes className="h-4 w-4" />
              Remove Trending
            </button>
            <button
              onClick={handleRemoveNewReleased}
              className="px-4 py-2 flex items-center justify-center gap-2 bg-teal-500/20 text-teal-700 dark:text-teal-800 text-sm font-medium rounded-md hover:bg-teal-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 border border-teal-300 dark:border-teal-400"
            >
              <FaTimes className="h-4 w-4" />
              Remove New Releases
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-black">
        Selected: {selectedProducts.length}
      </span>

      <button
        onClick={handleSelectAll}
        className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          selectAll
            ? "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
            : "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
        }`}
      >
        {selectAll ? "Deselect All" : "Select All"}
      </button>
    </div>
  </div>
</div>
      {/* Main Table */}
      <div className="relative overflow-x-auto mt-10 shadow-md sm:rounded-lg">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-black">
    <thead className="text-xs border-b border-gray-400 text-gray-700 uppercase bg-gray-50 dark:bg-gray-100 dark:text-black">
      <tr>
        <th scope="col" className="px-6 py-3 w-10">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-100 focus:ring-2 dark:bg-white dark:border-gray-400"
          />
        </th>
        <th scope="col" className="px-6 py-3">
          Title
        </th>
        <th scope="col" className="px-6 py-3">
          Category
        </th>
        <th scope="col" className="px-6 py-3">
          Production
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
          />
        ))
      ) : (
        <tr className="bg-white border-b dark:bg-white dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100">
          <td
            colSpan="9"
            className="px-6 py-4 text-center text-gray-500 dark:text-black"
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
}) => {
  return (
    <tr className="bg-white border-b dark:bg-white dark:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-100">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectChange(product._id)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-100 focus:ring-2 dark:bg-white dark:border-gray-400"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <ProductCell product={product} formatDate={formatDate} />
      <td className="px-6 py-4">
        <div className="flex flex-col dark:text-black">
          <span>Parent Category : {product.parentCategory?.title || "N/A"}</span>
          <span>Sub Category : {product.parentSubCategory?.title || "N/A"}</span>
          <span>Child Category : {product.parentChildCategory?.title || "N/A"}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex flex-col dark:text-black">
          <span>Author : {product.author?.name || "N/A"}</span>
          <span>Publisher : {product.publisher?.name || "N/A"}</span>
        </div>
      </td>
      <StatusCell showWebsite={product.showWebsite} />
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1 text-sm text-gray-700 dark:text-black">
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">Popular Books:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.popularBooks 
                ? 'bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-100 dark:text-gray-800'
            }`}>
              {product.popularBooks ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">Daily Deals:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.dailyDeals 
                ? 'bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-100 dark:text-gray-800'
            }`}>
              {product.dailyDeals ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">Trending Now:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.trendingNow 
                ? 'bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-100 dark:text-gray-800'
            }`}>
              {product.trendingNow ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">New Releases:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.newReleased 
                ? 'bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-100 dark:text-gray-800'
            }`}>
              {product.newReleased ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium w-28">Discount:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              product.discount 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-100 dark:text-blue-800' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-100 dark:text-gray-800'
            }`}>
              {product.discount ? `${product.discountValue} ${product.discountType}` : "None"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 dark:text-black">
        {product.stock || "N/A"}
      </td>
      <td className="px-6 py-4 dark:text-black">
        {product.price || "N/A"} Tk
      </td>
      <DeleteCell productId={product._id} onDelete={onDelete} />
    </tr>
  );
};

const ProductCell = ({ product, formatDate }) => (
  <th
    scope="row"
    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black"
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
        className="hover:underline hover:text-blue-600 dark:hover:text-blue-600"
      >
        <div className="flex flex-col gap-1">
          <span className="font-medium">{product.title || "N/A"}</span>
          <span className="text-xs text-gray-500 dark:text-gray-600">
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
          ? "bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800"
          : "bg-red-100 text-red-800 dark:bg-red-100 dark:text-red-800"
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
        className="flex cursor-pointer items-center gap-1 font-medium text-red-600 dark:text-red-600 hover:underline"
      >
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
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <path d="M10 11v6"/>
          <path d="M14 11v6"/>
        </svg>
      </button>
    </div>
  </td>
);

export default ProductTable;
