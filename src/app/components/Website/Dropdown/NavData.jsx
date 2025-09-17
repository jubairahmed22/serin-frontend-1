"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

// --- Global Cache Object ---
const navigationDataCache = {
  categories: [],
  subCategories: [],
  childCategories: [],
  brands: [],
  timestamp: 0,
  isFetching: false,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
};

const NavData = ({ setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Cache validation
  const cacheValid =
    navigationDataCache.timestamp &&
    Date.now() - navigationDataCache.timestamp < navigationDataCache.cacheDuration;

  // --- States ---
  const [categories, setCategories] = useState(
    cacheValid ? navigationDataCache.categories : []
  );
  const [subCategories, setSubCategories] = useState(
    cacheValid ? navigationDataCache.subCategories : []
  );
  const [childCategories, setChildCategories] = useState(
    cacheValid ? navigationDataCache.childCategories : []
  );
  const [brands, setBrands] = useState(
    cacheValid ? navigationDataCache.brands : []
  );
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const [loading, setLoading] = useState(!cacheValid);
  const [error, setError] = useState(null);

  const navRef = useRef(null);
  const hoverTimeout = useRef(null);

  // --- Fetch data with caching ---
  const fetchData = useCallback(async () => {
    if (navigationDataCache.isFetching) return;

    const now = Date.now();
    if (
      navigationDataCache.timestamp &&
      now - navigationDataCache.timestamp < navigationDataCache.cacheDuration
    ) {
      // Cache still valid
      setCategories(navigationDataCache.categories);
      setSubCategories(navigationDataCache.subCategories);
      setChildCategories(navigationDataCache.childCategories);
      setBrands(navigationDataCache.brands);
      setLoading(false);
      return;
    }

    navigationDataCache.isFetching = true;
    if (!cacheValid) setLoading(true);

    try {
      const [catRes, subRes, childRes, brandsRes] = await Promise.all([
        fetch("https://cosmetics-server-001.vercel.app/api/admin/category"),
        fetch("https://cosmetics-server-001.vercel.app/api/admin/sub-category"),
        fetch("https://cosmetics-server-001.vercel.app/api/admin/child-category"),
        fetch("https://cosmetics-server-001.vercel.app/api/admin/all-brands"),
      ]);

      const [catData, subData, childData, brandsData] = await Promise.all([
        catRes.json(),
        subRes.json(),
        childRes.json(),
        brandsRes.json(),
      ]);

      // ✅ Update cache
      navigationDataCache.categories = catData.products || [];
      navigationDataCache.subCategories = subData.products || [];
      navigationDataCache.childCategories = childData.products || [];
      navigationDataCache.brands = brandsData.products || [];
      navigationDataCache.timestamp = Date.now();

      // ✅ Update state
      setCategories(navigationDataCache.categories);
      setSubCategories(navigationDataCache.subCategories);
      setChildCategories(navigationDataCache.childCategories);
      setBrands(navigationDataCache.brands);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      navigationDataCache.isFetching = false;
    }
  }, [cacheValid]);

  useEffect(() => {
    if (!cacheValid) {
      fetchData();
    } else {
      // use cache immediately
      setLoading(false);
    }
  }, [fetchData, cacheValid]);

  // --- Helpers ---
  const getSubCategories = useCallback(
    (categoryId) => subCategories.filter((sub) => sub.parentCategory?.id === categoryId),
    [subCategories]
  );

  const getChildCategories = useCallback(
    (subCategoryId) =>
      childCategories.filter((child) => child.parentSubCategory?.id === subCategoryId),
    [childCategories]
  );

  const getChildCategoryCount = useCallback(
    (subCategoryId) => getChildCategories(subCategoryId).length,
    [getChildCategories]
  );

  const organizeSubCategories = useCallback(
    (subCats) => {
      const subCategoriesWithCount = subCats.map((subCat) => ({
        ...subCat,
        childCount: getChildCategoryCount(subCat._id),
      }));

      const sortedSubCategories = [...subCategoriesWithCount].sort(
        (a, b) => b.childCount - a.childCount
      );

      const columns = [[], [], [], [], []];
      sortedSubCategories.forEach((subCat) => {
        const columnHeights = columns.map((col) =>
          col.reduce((sum, item) => sum + item.childCount, 0)
        );
        const minIndex = columnHeights.indexOf(Math.min(...columnHeights));
        columns[minIndex].push(subCat);
      });

      return columns;
    },
    [getChildCategoryCount]
  );

  // --- Hover Handling ---
  const handleCategoryHover = (id) => {
    clearTimeout(hoverTimeout.current);
    setActiveCategory(id);
    setActiveSubCategory(null);
    setActiveBrand(null);
  };

  const handleBrandHover = () => {
    clearTimeout(hoverTimeout.current);
    setActiveBrand(true);
    setActiveCategory(null);
    setActiveSubCategory(null);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveCategory(null);
      setActiveSubCategory(null);
      setActiveBrand(null);
    }, 300);
  };

  // --- Navigation Handlers ---
  const handleCategoryClick = (category) => {
    const params = new URLSearchParams({ page: "1", category: category._id });
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleSubCategoryClick = (subCategory) => {
    const params = new URLSearchParams({
      page: "1",
      category: subCategory.parentCategory.id,
      subCategory: subCategory._id,
    });
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleChildCategoryClick = (childCategory) => {
    const params = new URLSearchParams({
      page: "1",
      category: childCategory.parentCategory.id,
      subCategory: childCategory.parentSubCategory.id,
      childCategory: childCategory._id,
    });
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const handleBrandClick = (brand) => {
    const params = new URLSearchParams({ page: "1", brand: brand._id });
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
    <div className="w-full h-full relative bangla-text">
      <div className="w-full mx-auto px-4" ref={navRef} onMouseLeave={handleLeave}>
        <div className="flex h-full flex-wrap justify-center gap-2 md:gap-6 py-4 ">
          {/* --- Brands --- */}
          <div className="relative" onMouseEnter={handleBrandHover}>
            <div
              className={`px-3 py-2 text-lg md:text-base font-medium rounded-md cursor-pointer transition-all ${
                activeBrand ? "text-[#414143]" : "text-gray-700 hover:text-[#414143]"
              }`}
            >
              BRAND
            </div>
            <AnimatePresence>
              {activeBrand && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed left-0 right-0 shadow-lg z-50 bg-white backdrop-blur-3xl"
                  style={{ width: "100vw", marginLeft: "-50vw", left: "50%" }}
                  onMouseLeave={handleLeave}
                >
                  <div className="w-full max-w-8xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
                      {brands
                        .filter((b) => b.showWebsite)
                        .map((brand) => (
                          <div
                            key={brand._id}
                            onClick={() => handleBrandClick(brand)}
                            className="group cursor-pointer py-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border"
                          >
                            <img
                              src={brand.singleImage}
                              alt={brand.title}
                              className="w-full h-20 object-contain p-2 group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- Categories --- */}
          {categories
            .filter((cat) => cat.showWebsite)
            .map((category) => {
              const subCats = getSubCategories(category._id);
              const hasSub = subCats.length > 0;
              const organizedColumns = hasSub ? organizeSubCategories(subCats) : [];

              return (
                <div
                  key={category._id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category._id)}
                >
                  <div
                    className={`px-3 py-2 uppercase text-lg md:text-base font-medium cursor-pointer ${
                      activeCategory === category._id
                        ? "text-[#414143]"
                        : "text-gray-700 hover:text-[#414143]"
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.title}
                  </div>
                  <AnimatePresence>
                    {activeCategory === category._id && hasSub && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-0 right-0 shadow-lg z-50 bg-white backdrop-blur-3xl"
                        style={{ width: "100vw", marginLeft: "-50vw", left: "50%" }}
                        onMouseLeave={handleLeave}
                      >
                        <div className="max-w-8xl mx-auto p-6 w-full">
                          <div className="grid grid-cols-5 w-full">
                            {organizedColumns.map((column, idx) => (
                              <div key={idx}>
                                {column.map((subCat) => {
                                  const children = getChildCategories(subCat._id);
                                  return (
                                    <div
                                      key={subCat._id}
                                      className="p-4"
                                      onMouseEnter={() => setActiveSubCategory(subCat._id)}
                                    >
                                      <h4
                                        className="font-medium text-black mb-2 cursor-pointer hover:text-[#414143] border-b pb-1"
                                        onClick={() => handleSubCategoryClick(subCat)}
                                      >
                                        {subCat.title}
                                      </h4>
                                      {children.length > 0 && (
                                        <div className="space-y-1 mt-2">
                                          {children.map((child) => (
                                            <div
                                              key={child._id}
                                              className="text-sm text-gray-600 hover:text-black cursor-pointer py-1 rounded hover:bg-pink-50 p-2"
                                              onClick={() => handleChildCategoryClick(child)}
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
