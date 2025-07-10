"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CreateZoneForm({ fetchData }) {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    countryCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://books-server-001.vercel.app/api/countryList");
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        setCountries(data.data);
      } catch (err) {
        toast.error("Failed to load countries");
        console.error(err);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If country is changing, find the corresponding code
    if (name === "country") {
      const selectedCountry = countries.find((c) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        countryCode: selectedCountry ? selectedCountry.code : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add this validation function
  const validateZoneName = (name) => {
    return /^[A-Z]$/.test(name);
  };

  // Update your handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.country) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    // Validate zone name is a single capital letter
    if (!validateZoneName(formData.name)) {
      toast.error("Zone name must be a single capital letter (A-Z)");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://books-server-001.vercel.app/api/zone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create zone");
      }

      toast.success("Zone created successfully!");
      setFormData({
        name: "",
        country: "",
        countryCode: "",
      });
      if (fetchData) {
        fetchData();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Zone Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            pattern="[A-Z]{1}"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country <span className="text-red-500">*</span>
          </label>
          {isLoadingCountries ? (
            <select
              disabled
              className="w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            >
              <option>Loading countries...</option>
            </select>
          ) : (
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country._id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label
            htmlFor="countryCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country Code
          </label>
          <input
            type="text"
            id="countryCode"
            name="countryCode"
            value={formData.countryCode}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoadingCountries}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSubmitting ? "Submitting..." : "Create Zone"}
        </button>
      </form>
    </div>
  );
}
