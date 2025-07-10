"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar({ isCollapsed, toggleSidebar }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Initialize ALL submenus as closed (empty object)
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [openNestedSubmenus, setOpenNestedSubmenus] = useState({});

  // Automatically open the submenu if the current path matches
  useEffect(() => {
    const navItems = [
       {
        name: "Dashboard",
        href: "/admin/dashboard",
      },
      {
        name: "Products",
        submenu: [
          { href: "/admin/products/all-products" },
          { href: "/admin/products/add-author" },
          { href: "/admin/products/add-tag" },
          { href: "/admin/products/add-publisher" },
        ],
      },
      {
        name: "Orders",
        submenu: [
          { href: "/admin/orders/all-orders" },
          { href: "/admin/orders/refund-request" },
        ],
      },
      {
        name: "Categories",
        submenu: [
          { href: "/admin/categories/category-list" },
          { href: "/admin/categories/add-category" },
          { href: "/admin/categories/subcategory-list" },
          { href: "/admin/categories/add-subcategory" },
          { href: "/admin/categories/childcategory-list" },
          { href: "/admin/categories/add-childcategory" },
        ],
      },
      {
        name: "Customers",
        href: "/admin/customers",
      },
    ];

    // Find which menu item should be open based on current path
    const activeMenu = navItems.find(item => 
      item.submenu?.some(subItem => pathname.startsWith(subItem.href))
    )?.name;

    // Find which nested submenu should be open
    const activeNestedMenu = navItems.find(item => 
      item.submenu?.some(subItem => 
        subItem.submenu?.some(nestedItem => pathname.startsWith(nestedItem.href))
    )?.name);

    // If found, open that menu
    if (activeMenu) {
      setOpenSubmenus(prev => ({
        ...prev,
        [activeMenu]: true
      }));
    }

    if (activeNestedMenu) {
      setOpenNestedSubmenus(prev => ({
        ...prev,
        [activeNestedMenu]: true
      }));
    }
  }, [pathname]);

  // Toggle ONLY the clicked submenu (others stay closed)
  const toggleSubmenu = (menuName) => {
    setOpenSubmenus(prev => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false; // Close all other menus
        return acc;
      }, {}),
      [menuName]: !prev[menuName] // Toggle only the clicked menu
    }));
  };

  // Toggle nested submenu
  const toggleNestedSubmenu = (menuName) => {
    setOpenNestedSubmenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navItems = [
      {
      name: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      href: "/admin/dashboard",
    },
    {
      name: "Products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      submenu: [
        { name: "All Products", href: "/admin/products/all-products" },
        { name: "Add Author", href: "/admin/products/add-author" },
        { name: "Add Product Tag", href: "/admin/products/add-tag" },
        { name: "Add Publisher", href: "/admin/products/add-publisher" },
      ],
    },
    {
      name: "Orders",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      submenu: [
        { name: "All Orders", href: "/admin/orders/all-orders" },
        { name: "Refund Request", href: "/admin/orders/refund-request" },
      ],
    },
    {
      name: "Categories",
      icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
      submenu: [
        { name: "Add New Category", href: "/admin/categories/add-category" },
        { name: "Add New Subcategory", href: "/admin/categories/add-subcategory" },
        { name: "Add New Child Category", href: "/admin/categories/add-childcategory" },
      ],
    },
    {
      name: "Customers",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      href: "/admin/customers",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      toggleSidebar();
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button with fixed position */}
      {isMobile && (
        <button
          onClick={handleToggle}
          className="fixed z-50 left-4 font-semibold text-gray-600 top-4 p-2 rounded-md bg-white shadow-md md:hidden transition-all duration-300 hover:bg-gray-100"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="h-6 w-6 transform transition-transform duration-300"
            style={{
              transform: isMobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      )}

      {/* Sidebar with z-20 */}
      <div
        className={`fixed z-20 border-r border-r-gray-200 fontPoppins h-full bg-white text-black shadow-lg transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        } ${isMobile && !isMobileMenuOpen ? "-left-full md:left-0" : "left-0"}`}
      >
        {/* Sidebar header with animation */}
        <Link href="/">
        <div className="p-4 flex items-center justify-center overflow-hidden h-20 border-b border-gray-200">
          <h2
            className={`text-2xl font-bold whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            }`}
          >
            Book Forest
          </h2>
        </div>
        </Link>

        {/* Navigation items */}
        <nav className="mt-6 overflow-y-auto h-[calc(100vh-80px)]">
          {navItems.map((item, index) => (
            <div key={item.name} className="mb-1 mx-2">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex rounded-lg font-semibold text-gray-600 hover:text-black cursor-pointer items-center w-full px-4 py-3 transition-all duration-300 hover:bg-gray-100 ${
                      pathname.startsWith(`/${item.name.toLowerCase()}`)
                        ? "bg-gray-100"
                        : ""
                    } ${
                      isCollapsed ? "px-0 justify-center" : "justify-between"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 min-w-[20px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={item.icon}
                        />
                      </svg>
                      <span
                        className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                          isCollapsed
                            ? "opacity-0 w-0 overflow-hidden"
                            : "opacity-100 w-auto"
                        }`}
                        style={{
                          transitionDelay: isCollapsed
                            ? "0ms"
                            : `${index * 50}ms`,
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    {!isCollapsed && (
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 ${
                          openSubmenus[item.name] ? "rotate-90" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </button>
                  <div
                    className={`overflow-hidden mt-2 transition-all duration-300 ${
                      openSubmenus[item.name] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {item.submenu.map((subItem) => (
                      <div key={subItem.name || subItem.href}>
                        {subItem.submenu ? (
                          <>
                            <button
                              onClick={() => toggleNestedSubmenu(subItem.name || subItem.href)}
                              className={`flex items-center rounded-lg mx-2 text-gray-700 hover:text-black w-full py-3 px-4 pl-12 text-sm transition-all duration-300 ${
                                pathname.startsWith(subItem.href)
                                  ? "bg-gray-100 font-medium"
                                  : "hover:bg-gray-50"
                              } ${
                                isCollapsed ? "px-0 justify-center" : "justify-between"
                              }`}
                            >
                              <span
                                className={`whitespace-nowrap transition-all duration-300 ${
                                  isCollapsed
                                    ? "opacity-0 w-0 overflow-hidden"
                                    : "opacity-100 w-auto"
                                }`}
                              >
                                {subItem.name}
                              </span>
                              {!isCollapsed && (
                                <svg
                                  className={`h-4 w-4 transform transition-transform duration-200 ${
                                    openNestedSubmenus[subItem.name || subItem.href] ? "rotate-90" : ""
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              )}
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                openNestedSubmenus[subItem.name || subItem.href] ? "max-h-96" : "max-h-0"
                              }`}
                            >
                              {subItem.submenu.map((nestedItem) => (
                                <Link
                                  key={nestedItem.href}
                                  href={nestedItem.href}
                                  onClick={handleLinkClick}
                                  className={`flex items-center rounded-lg mt-2 mx-2 text-gray-700 hover:text-black py-3 px-4 pl-16 text-sm transition-all duration-300 ${
                                    pathname === nestedItem.href
                                      ? "bg-gray-100 font-medium"
                                      : "hover:bg-gray-50"
                                  } ${
                                    isCollapsed ? "px-0 justify-center" : "justify-start"
                                  }`}
                                  prefetch={true}
                                >
                                  <span
                                    className={`whitespace-nowrap transition-all duration-300 ${
                                      isCollapsed
                                        ? "opacity-0 w-0 overflow-hidden"
                                        : "opacity-100 w-auto"
                                    }`}
                                  >
                                    {nestedItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={subItem.href}
                            onClick={handleLinkClick}
                            className={`flex items-center rounded-lg mx-2 text-gray-700 hover:text-black py-3 px-4 pl-12 text-sm transition-all duration-300 ${
                              pathname === subItem.href
                                ? "bg-gray-100 font-medium"
                                : "hover:bg-gray-50"
                            } ${
                              isCollapsed ? "px-0 justify-center" : "justify-start"
                            }`}
                            prefetch={true}
                          >
                            <span
                              className={`whitespace-nowrap transition-all duration-300 ${
                                isCollapsed
                                  ? "opacity-0 w-0 overflow-hidden"
                                  : "opacity-100 w-auto"
                              }`}
                            >
                              {subItem.name}
                            </span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex w-full justify-start items-center font-semibold rounded-lg text-gray-600 hover:text-black md:justify-start px-4 py-3 transition-all duration-300 ${
                    pathname === item.href ? "bg-gray-100" : "hover:bg-gray-100"
                  } ${isCollapsed ? "px-0" : ""}`}
                  title={isCollapsed ? item.name : ""}
                >
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "justify-center w-full" : ""
                    }`}
                    prefetch={true}
                  >
                    <svg
                      className="h-5 w-5 min-w-[20px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={item.icon}
                      />
                    </svg>
                    <span
                      className={`ml-3 whitespace-nowrap flex justify-start transition-all duration-300 ${
                        isCollapsed
                          ? "opacity-0 w-0 overflow-hidden"
                          : "opacity-100 w-auto"
                      }`}
                      style={{
                        transitionDelay: isCollapsed
                          ? "0ms"
                          : `${index * 50}ms`,
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}