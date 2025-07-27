"use client";
import React from "react";
import { useRouter } from "next/navigation";

const HomeCategoryFilter = ({subCategoryId, categoryId}) => {
  const router = useRouter();

  const handleCategoryClick = () => {
    // Create URLSearchParams with popularBooks=true
    const params = new URLSearchParams();
    params.set("subCategory", subCategoryId);
    params.set("category", categoryId);

    // Navigate to all-books page with the query parameter
    router.push(`/all-books?${params.toString()}`);
  };

  return (
    <div>
      <button
        onClick={handleCategoryClick}
        className="px-6 py-3 buttonPopular hover:bg-green-600 cursor-pointer text-white font-medium rounded-full whitespace-nowrap transition-colors duration-300 shadow hover:shadow-md"
      >
        View All
      </button>
    </div>
  );
};

export default HomeCategoryFilter;
