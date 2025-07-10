"use client";

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AddPublisherForm = ({ onClose, refreshTags }) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://books-server-001.vercel.app/api/admin/upload/add-publisher",
        { title },
        { headers: { "Content-Type": "application/json" } }
      );
      
      console.log("Publisher added successfully:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Publisher created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        onClose();
        refreshTags(); // Call this to refresh the tag list in parent component
      });
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error(error.response?.data?.error || "Tag creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="flex flex-row gap-5">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Publisher Name <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter publisher name"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 w-56">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-4 text-sm py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Create Publisher"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPublisherForm;