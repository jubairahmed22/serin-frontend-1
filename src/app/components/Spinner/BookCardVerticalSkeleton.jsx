"use client";
import React from 'react';

const BookCardVerticalSkeleton = () => {
  return (
    <div className="relative w-full border flex flex-col justify-between border-gray-100 p-3 animate-pulse">
      <div className="flex flex-row w-full items-center gap-3 rounded-xl bg-white transition-all duration-300">
        {/* Image placeholder - exact same dimensions as real card */}
        <div className="relative w-[120px] h-[160px] overflow-hidden rounded-lg bg-gray-200"></div>

        {/* Content placeholder - takes remaining space */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Title - full width */}
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          
          {/* Rating - matches real card */}
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
          </div>

          {/* Stock */}
          <div className="w-16 h-3 bg-gray-200 rounded"></div>

          {/* Price section - matches real layout */}
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>

          {/* Button - matches real button size */}
          <div className="w-[140px] h-9 bg-gray-200 rounded-lg mt-3"></div>
        </div>
      </div>
    </div>
  );
};

export default BookCardVerticalSkeleton;