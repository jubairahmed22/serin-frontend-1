"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DailyDealsFilter = () => {
  const router = useRouter();

  const handlePopularBooksClick = () => {
    // Create URLSearchParams with popularBooks=true
    const params = new URLSearchParams();
    params.set("dailyDeals", "true");

    // Navigate to all-books page with the query parameter
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div>
      <button
        onClick={handlePopularBooksClick}
        className="px-6 py-3 buttonPopular hover:bg-pink-600 cursor-pointer text-white font-medium rounded-full whitespace-nowrap transition-colors duration-300 shadow hover:shadow-md"
      >
        View All
      </button>
    </div>
  );
};

export default DailyDealsFilter;
