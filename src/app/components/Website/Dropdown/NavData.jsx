"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { FiChevronRight, FiBook, FiGrid } from "react-icons/fi";

const NavData = ({ setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navRef = useRef(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes, childRes, brandsRes] = await Promise.all([
          fetch("https://cosmetics-server-001.vercel.app/api/admin/category"),
          fetch("https://cosmetics-server-001.vercel.app/api/admin/sub-category"),
          fetch("https://cosmetics-server-001.vercel.app/api/admin/child-category"),
          fetch("https://cosmetics-server-001.vercel.app/api/admin/all-brands"),
        ]);

        const catData = await catRes.json();
        const subData = await subRes.json();
        const childData = await childRes.json();
        const brandsData = await brandsRes.json();

        setCategories(catData.products || []);
        setSubCategories(subData.products || []);
        setChildCategories(childData.products || []);
        setBrands(brandsData.products || []);

        // REMOVED: Don't set any category as active on load
        // if (catData.products?.length > 0) {
        //   setActiveCategory(catData.products[0]._id);
        // }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveSubCategory(null);
        setActiveCategory(null);
        setActiveBrand(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Helpers ---
  const getSubCategories = (categoryId) => {
    return subCategories.filter((sub) => sub.parentCategory?.id === categoryId);
  };

  const getChildCategories = (subCategoryId) => {
    return childCategories.filter(
      (child) => child.parentSubCategory?.id === subCategoryId
    );
  };

  // Count child categories for each subcategory
  const getChildCategoryCount = (subCategoryId) => {
    return getChildCategories(subCategoryId).length;
  };

  // Organize subcategories into balanced columns
  const organizeSubCategories = (subCats) => {
    // Calculate child count for each subcategory
    const subCategoriesWithCount = subCats.map((subCat) => ({
      ...subCat,
      childCount: getChildCategoryCount(subCat._id),
    }));

    // Sort by child count (descending)
    const sortedSubCategories = [...subCategoriesWithCount].sort(
      (a, b) => b.childCount - a.childCount
    );

    // Create 5 columns
    const columns = [[], [], [], [], []];

    // Distribute subcategories to balance column heights
    sortedSubCategories.forEach((subCat, index) => {
      // Find the column with the least total child count
      const columnHeights = columns.map((column) =>
        column.reduce((sum, item) => sum + item.childCount, 0)
      );

      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[minHeightIndex].push(subCat);
    });

    return columns;
  };

  // --- Hover Handling ---
  const handleCategoryHover = (categoryId) => {
    clearTimeout(hoverTimeout.current);
    setActiveCategory(categoryId);
    setActiveSubCategory(null);
    setActiveBrand(null);
  };

  const handleSubCategoryHover = (subCategoryId) => {
    clearTimeout(hoverTimeout.current);
    setActiveSubCategory(subCategoryId);
  };

  const handleBrandHover = () => {
    clearTimeout(hoverTimeout.current);
    setActiveBrand(true);
    setActiveCategory(null);
    setActiveSubCategory(null);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveSubCategory(null);
      setActiveCategory(null);
      setActiveBrand(null);
    }, 300);
  };

  // --- Navigation ---
  const handleCategoryClick = (category) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("category", category._id);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleSubCategoryClick = (subCategory) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("subCategory", subCategory._id);
    params.set("category", subCategory.parentCategory.id);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleChildCategoryClick = (childCategory) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("childCategory", childCategory._id);
    params.set("subCategory", childCategory.parentSubCategory.id);
    params.set("category", childCategory.parentCategory.id);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleBrandClick = (brand) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("brand", brand._id);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  // --- UI States ---
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
    <div className="w-full h-full relative bangla-text ">
      {/* --- Categories Nav --- */}
      <div
        className="w-full mx-auto px-4"
        ref={navRef}
        onMouseLeave={handleLeave}
      >
        <div className="flex h-full flex-wrap justify-center gap-2 md:gap-6 py-4 ">
          {/* Brands Menu Item */}
          <div className="relative" onMouseEnter={handleBrandHover}>
            <div
              className={`px-3 py-2 text-lg md:text-base font-medium rounded-md cursor-pointer transition-all duration-200 ${
                activeBrand
                  ? "text-[#414143] "
                  : "text-gray-700 hover:text-[#414143]"
              }`}
            >
              <div className="flex items-center">BRAND</div>
            </div>

            {/* Brands Dropdown - Full Width */}
            <AnimatePresence>
              {activeBrand && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed left-0 right-0  shadow-lg z-50 bg-white backdrop-blur-3xl"
                  style={{
                    width: "100vw",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                  }}
                  onMouseLeave={handleLeave}
                >
                  <div className="w-full max-w-8xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
                      {brands
                        .filter((brand) => brand.showWebsite)
                        .map((brand) => (
                          <div
                            key={brand._id}
                            onClick={() => handleBrandClick(brand)}
                            className="relative group cursor-pointer py-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50"
                          >
                            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
                              <img
                                className="w-full h-20 object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                src={brand.singleImage}
                                alt={brand.title}
                                loading="lazy"
                              />
                            </div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-pink-500/10 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg"></div>
                          </div>
                        ))}
                    </div>

                    {brands.filter((brand) => brand.showWebsite).length ===
                      0 && (
                      <div className="text-center py-12 text-gray-500">
                        <p>No brands available at the moment.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories */}
          {categories
            .filter((cat) => cat.showWebsite)
            .map((category) => {
              const subCats = getSubCategories(category._id);
              const hasSubCategories = subCats.length > 0;

              // Organize subcategories into balanced columns
              const organizedColumns = hasSubCategories
                ? organizeSubCategories(subCats)
                : [];

              return (
                <div
                  key={category._id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category._id)}
                >
                  <div
                    className={`px-3 py-2 uppercase text-lg md:text-base font-medium rounded-md cursor-pointer transition-all duration-200 ${
                      activeCategory === category._id
                        ? "text-[#414143] "
                        : "text-gray-700 hover:text-[#414143]"
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="flex items-center">{category.title}</div>
                  </div>

                  {/* SubCategory Dropdown - Full Width */}
                  <AnimatePresence>
                    {activeCategory === category._id && hasSubCategories && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-0 right-0 shadow-lg z-50 bg-white backdrop-blur-3xl"
                        style={{
                          width: "100vw",
                          left: "50%",
                          right: "50%",
                          marginLeft: "-50vw",
                          marginRight: "-50vw",
                        }}
                        onMouseLeave={handleLeave}
                      >
                        <div className="max-w-8xl mx-auto p-6 w-full">
                          <div className="grid grid-cols-5  w-full">
                            {organizedColumns.map((column, colIndex) => (
                              <div key={colIndex} className="">
                                {column.map((subCat) => {
                                  const children = getChildCategories(
                                    subCat._id
                                  );
                                  const hasChildren = children.length > 0;

                                  return (
                                    <div
                                      key={subCat._id}
                                      className="relative p-4  rounded-lg"
                                      onMouseEnter={() =>
                                        handleSubCategoryHover(subCat._id)
                                      }
                                    >
                                      <h4
                                        className="font-medium text-black mb-2 cursor-pointer hover:text-[#414143] border-b border-gray-400 pb-1"
                                        onClick={() =>
                                          handleSubCategoryClick(subCat)
                                        }
                                      >
                                        {subCat.title}
                                      </h4>

                                      {/* Child Categories */}
                                      {hasChildren && (
                                        <div className="space-y-1 mt-2">
                                          {children.map((child) => (
                                            <div
                                              key={child._id}
                                              className="text-sm text-gray-600 hover:text-black cursor-pointer py-1 rounded hover:bg-pink-50 p-2"
                                              onClick={() =>
                                                handleChildCategoryClick(child)
                                              }
                                            >
                                              {child.title}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NavData;