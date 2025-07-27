"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  orderId,
  refreshOrder,
  formData,
}) => {
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    paymentValue: "",
    paymentDate: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    paymentStatus: "pending", // Default status
  });
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    "Cash On Delivery",
    "SSLCommerz",
    "Bkash",
    "Nagad",
    "Rocket",
    "Bank Transfer",
    "Other",
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "due", label: "Due" },
    { value: "success", label: "Success" },
  ];

  // Initialize form with existing payment data when formData changes
  useEffect(() => {
    if (formData?.method) {
      // Convert MongoDB date to local date string if it exists
      const dateValue = formData.paymentDate
        ? new Date(formData.paymentDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      setPaymentData({
        paymentMethod: formData.method || "",
        paymentValue: formData.PaymentAmount?.toString() || "",
        paymentDate: dateValue,
        paymentStatus: formData.status || "pending",
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!paymentData.paymentMethod) {
        toast.error("Payment method is required");
        setIsLoading(false);
        return;
      }

      // Convert the date string to a proper ISO string with time
      const paymentDateISO = paymentData.paymentDate
        ? new Date(paymentData.paymentDate).toISOString()
        : new Date().toISOString();

      // Prepare the payment data for the API
      const paymentInfo = {
        paymentMethod: paymentData.paymentMethod,
        paymentValue: paymentData.paymentValue
          ? parseFloat(paymentData.paymentValue)
          : 0,
        paymentDate: paymentDateISO,
        paymentStatus: paymentData.paymentStatus,
      };

      // Make API call to add payment
      const response = await axios.post(
        `https://books-server-001.vercel.app/api/admin/orders/${orderId}/add-payment`,
        paymentInfo
      );

      toast.success("Payment information added successfully");
      refreshOrder();
      onClose();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        error.response?.data?.error || "Failed to add payment information"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur fontPoppins bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="flex justify-between rounded-t-xl items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-semibold text-gray-800">
            {formData?.method ? "Update Payment" : "Add Payment Confirmation"}
          </h3>
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
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Payment Amount ( {formData.total} )*
              </label>
              <input
                type="number"
                name="paymentValue"
                value={paymentData.paymentValue}
                onChange={handleChange}
                placeholder="Enter payment amount"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={paymentData.paymentDate}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Payment Status *
              </label>
              <select
                name="paymentStatus"
                value={paymentData.paymentStatus}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-start space-x-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;