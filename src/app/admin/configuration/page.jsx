"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TiptapEditor = dynamic(() => import("../../components/TiptapEditor"), {
  ssr: false,
});

const ConfigurationPage = () => {
  const [formData, setFormData] = useState({
    termsAndConditions: "",
    deliveryChargeInsideDhaka: 0,
    deliveryChargeOutsideDhaka: 0,
    taxRate: 0,
    storeName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          "https://cosmetics-server-001.vercel.app/api/get-configuration"
        );
        if (!response.ok) throw new Error("Failed to fetch configuration");

        const data = await response.json();
        if (data) {
          setFormData({
            termsAndConditions: data.termsAndConditions || "",
            deliveryChargeInsideDhaka: data.deliveryChargeInsideDhaka || 0,
            deliveryChargeOutsideDhaka: data.deliveryChargeOutsideDhaka || 0,
            taxRate: data.taxRate || 0,
            storeName: data.storeName || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
          });
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Charge") || name.includes("Rate")
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        "https://cosmetics-server-001.vercel.app/api/add-configure/appConfig",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to save configuration");

      toast.success("Configuration saved successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white border border-gray-200 shadow flex flex-col gap-5 p-5 rounded-2xl">
        <div className="flex justify-between ">
          <h1 className="fontPoppins font-semibold text-black text-xl">
            Store Configuration
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Information */}
            <div className="space-y-4 grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="storeName"
                  className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  pattern="[0-9]{10,15}"
                  title="Please enter a valid phone number (10-15 digits)"
                  required
                />
              </div>
            </div>

            {/* Financial Settings */}
            <div className="space-y-4 flex flex-row gap-5">
              <div>
                <label
                  htmlFor="deliveryChargeInsideDhaka"
                  className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
                >
                  Delivery Charge Inside Dhaka 
                </label>
                <input
                  type="number"
                  id="deliveryChargeInsideDhaka"
                  name="deliveryChargeInsideDhaka"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.deliveryChargeInsideDhaka}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="deliveryChargeOutsideDhaka"
                  className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
                >
                  Delivery Charge Outside Dhaka
                </label>
                <input
                  type="number"
                  id="deliveryChargeOutsideDhaka"
                  name="deliveryChargeOutsideDhaka"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.deliveryChargeOutsideDhaka}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div>
                <label
                  htmlFor="taxRate"
                  className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
                >
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.taxRate}
                  onChange={handleChange}
                  required
                />
              </div> */}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 pb-2">
              Terms & Conditions
            </h2>
            <div className="">
              <label
                htmlFor="termsAndConditions"
                className="block font-semibold text-sm fontPoppins text-gray-700 mb-1"
              >
                Policy Content
              </label>
              <TiptapEditor
                value={formData.termsAndConditions}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAndConditions: value,
                  }))
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-start">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigurationPage;