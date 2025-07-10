import { useState } from "react";
import Link from "next/link"; // or your preferred Link component
import category from "../../../../assets/categories.png";
import DropdownPublication from "./DropdownPublication";
import { motion } from "framer-motion";

const PublicationCategory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer flex items-center gap-2"
        initial={false}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <motion.span className="text-[#282828]">
          Publications
        </motion.span>

        {/* Icon */}
        <motion.div
          animate={{ 
            rotate: isOpen ? 180 : 0,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500,
            damping: 15,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#282828]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* Modal Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content - Centered below button */}
          <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 border border-gray-300 w-[800px] h-[400px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  aria-label="Close categories"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Categories Grid */}
              <DropdownPublication setIsOpen={setIsOpen}></DropdownPublication>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicationCategory;