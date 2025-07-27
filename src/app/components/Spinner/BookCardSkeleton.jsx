"use client"
import React from "react";

const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-full flex flex-col">
      {/* Image placeholder with fixed aspect ratio */}
      <div className="w-full h-[200px] bg-gray-200"></div>
      
      {/* Content placeholder */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;