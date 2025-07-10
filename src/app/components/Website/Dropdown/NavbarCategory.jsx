import { useState } from "react";
import Link from "next/link"; // or your preferred Link component
import category from "../../../../assets/categories.png";
import DropdownCategoryData from "./DropdownCategoryData";
import { motion } from "framer-motion";

const NavbarCategory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button */}
        <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="relative cursor-pointer w-[180px] h-[51px] flex justify-between px-8 items-center rounded-full overflow-hidden"
      initial={false}
      animate={{
        backgroundColor: isOpen ? "#40B06B" : "#50C878", // Slightly darker when open
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 5px 15px rgba(80, 200, 120, 0.4)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Animated background highlight (subtle pulse effect) */}
      <motion.span 
        className="absolute cursor-pointer inset-0 bg-white opacity-0"
        animate={{ opacity: isOpen ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.span
        className="buttonText"
        animate={{ x: isOpen ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Categories
      </motion.span>

      {/* Enhanced icon animation */}
      <motion.div
        animate={{ 
          rotate: isOpen ? 180 : 0,
          scale: isOpen ? 1.1 : 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500,
          damping: 15,
          scale: { duration: 0.2 }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
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
            className="fixed inset-0  bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content - Changed positioning */}
          <div className="absolute z-50 top-full left-0 mt-2 border border-gray-300 w-[800px] h-[400px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                {/* <h2 className="text-xl font-bold text-gray-800">
                  All Categories
                </h2> */}
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
              <DropdownCategoryData setIsOpen={setIsOpen}></DropdownCategoryData>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavbarCategory;
