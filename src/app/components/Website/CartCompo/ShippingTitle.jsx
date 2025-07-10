import Link from "next/link";
import React from "react";

const ShippingTitle = ({ cartCount }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Left side - Features */}
      <div className="w-full lg:w-[55%] flex flex-row sm:flex-row gap-4">
        {/* Return policy badge */}
        <div className="flex-1 p-5 bg-[#defde8] rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-lg font-semibold text-gray-800">
              7 Days Happy Return
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Not satisfied? Easy returns within 7 days
          </p>
        </div>

        {/* Cart summary */}

        <div className="flex-1 p-5 bg-[#defde8] rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Link className="w-full" href="/cart">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h1 className="text-lg font-semibold text-gray-800">
                  Your Cart ({cartCount} items)
                </h1>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Review or checkout your items
            </p>
          </Link>
        </div>
      </div>

      {/* Right side - Empty for now */}
      <div className="w-full lg:w-[45%]">
        {/* Content can be added here later */}
      </div>
    </div>
  );
};

export default ShippingTitle;
