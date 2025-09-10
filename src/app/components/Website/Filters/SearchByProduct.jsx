"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SearchByProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      const params = new URLSearchParams();
      params.set("title", searchTerm.trim());

      router.push(`/products?${params.toString()}`);
    }
  }, [searchTerm, router]);

  return (
    <div className="flex-1 w-full px-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 rounded-full bg-white border border-[#414143] focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-3 top-2.5 text-pink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchByProduct;
