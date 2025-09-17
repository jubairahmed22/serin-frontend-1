"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { HiMenuAlt3 } from "react-icons/hi";
import DropdownCategoryMobileData from './DropdownCategoryMobileData'

const NavbarMobileCategory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className=" text-pink-800 hover:text-pink-700 transition-colors"
      >
        <HiMenuAlt3 className="text-4xl scale-x-[-1]" />
      </button>

      {/* Sidebar with Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white z-50 shadow-xl overflow-y-auto"
            >
              <DropdownCategoryMobileData setIsOpen={setIsOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};



export default NavbarMobileCategory;