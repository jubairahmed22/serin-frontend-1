"use client";
import React from "react";
import { useRouter } from "next/navigation";

const NovelBookFilter = () => {
  const router = useRouter();

  const handlePopularBooksClick = () => {
    // Create URLSearchParams with popularBooks=true
    const params = new URLSearchParams();
    params.set("tag", "685eebc17843568eb9ec4bf3");

    // Navigate to all-books page with the query parameter
    router.push(`/all-books?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePopularBooksClick}
        className="w-full border cursor-pointer dark:text-black border-[#E6E6E6] rounded py-2 text-[14px] font-semibold"
      >View All
      </button>
    </div>
  );
};

export default NovelBookFilter;
