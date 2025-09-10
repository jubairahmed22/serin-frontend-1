"use client";
import React from "react";
import { useRouter } from "next/navigation";
import '../../../../styles/serin.css'

const HomeCategoryFilter = ({ subCategoryId, categoryId }) => {
  const router = useRouter();

  const handleCategoryClick = () => {
    // Create URLSearchParams with popularBooks=true
    const params = new URLSearchParams();
    params.set("subCategory", subCategoryId);
    params.set("category", categoryId);

    // Navigate to all-books page with the query parameter
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div>
      
      <button
  onClick={handleCategoryClick}
  className="fontPoppins text-sm font-medium seeMoreButton text-black cursor-pointer 
             bg-white border border-black px-8 py-2 rounded-full
             shadow-md hover:bg-[#F01F7B] hover:text-white hover:border-[#F01F7B] 
             hover:shadow-lg transition-all duration-300 ease-in-out 
             transform hover:scale-105 active:scale-95"
>
  Shop All Products asdf
</button>
    </div>
  );
};

export default HomeCategoryFilter;
