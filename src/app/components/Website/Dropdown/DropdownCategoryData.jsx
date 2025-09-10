"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const DropdownCategoryData = ({setIsOpen}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, childRes] = await Promise.all([
          fetch("https://cosmetics-server-001.vercel.app/api/admin/sub-category"),
          fetch("https://cosmetics-server-001.vercel.app/api/admin/child-category"),
        ]);

        const subData = await subRes.json();
        const childData = await childRes.json();

        const filteredSubCategories = (subData.products || []).filter(
          (subCat) => !subCat.title.toLowerCase().includes("featured")
        );

        setSubCategories(filteredSubCategories);
        setChildCategories(childData.products || []);

        if (filteredSubCategories.length > 0) {
          setActiveItem(filteredSubCategories[0]._id);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChildCategories = (subCategoryId) => {
    return childCategories.filter(
      (child) => child.parentSubCategory?.id === subCategoryId
    );
  };

  const handleSubCategoryHover = (subCategoryId) => {
    clearTimeout(hoverTimeout.current);
    setActiveItem(subCategoryId);
  };

  const handleNavLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      if (!dropdownRef.current?.matches(":hover")) {
        setActiveItem(subCategories[0]?._id || null);
      }
    }, 300);
  };

  const handleDropdownLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      if (!navRef.current?.matches(":hover")) {
        setActiveItem(subCategories[0]?._id || null);
      }
    }, 300);
  };

  const handleSubCategoryClick = (subCategory) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("subCategory", subCategory._id);
    params.set("category", subCategory.parentCategory.id);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false)
  };

  const handleChildCategoryClick = (childCategory) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("childCategory", childCategory._id);
    params.set("subCategory", childCategory.parentSubCategory.id);
    params.set("category", childCategory.parentCategory.id);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading categories: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white relative bangla-text">
      {/* Sub-categories navigation bar */}
      <div
        className="max-w-8xl mx-auto px-4"
        ref={navRef}
        onMouseLeave={handleNavLeave}
      >
        <div className="flex h-full flex-wrap justify-center gap-1 md:gap-4 py-4 border-b border-gray-200">
          {subCategories.map((subCategory) => {
            const hasChildren = getChildCategories(subCategory._id).length > 0;

            return (
              <div
                key={subCategory._id}
                className="relative"
                onMouseEnter={() =>
                  hasChildren && handleSubCategoryHover(subCategory._id)
                }
              >
                <div
                  className={`px-3 py-2 text-sm md:text-base font-medium rounded-md transition-all duration-200 ${
                    hasChildren
                      ? "hover:bg-gray-100 cursor-pointer"
                      : "cursor-pointer"
                  } ${
                    activeItem === subCategory._id
                      ? "text-green-600 bg-green-50"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  onClick={() => handleSubCategoryClick(subCategory)}
                >
                  {subCategory.title}
                  {hasChildren && (
                    <svg
                      className={`w-4 h-4 ml-1 inline-block transition-transform ${
                        activeItem === subCategory._id
                          ? "transform rotate-180"
                          : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>

                {activeItem === subCategory._id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t"
                    layoutId="activeIndicator"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dropdown container */}
      <AnimatePresence>
        {activeItem && getChildCategories(activeItem).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 bg-white shadow-lg z-50"
            ref={dropdownRef}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="py-4 px-4">
              <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getChildCategories(activeItem).map((child, index) => (
                  <motion.div
                    key={child._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:text-green-600 cursor-pointer"
                    onClick={() => handleChildCategoryClick(child)}
                  >
                    <h4 className="font-medium text-gray-800 mb-1 hover:text-green-600">
                      {child.title}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownCategoryData;
