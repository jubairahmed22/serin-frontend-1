"use client";
import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import Link from "next/link";
import "../../styles/globals.css";
import NavData from "../components/Website/Dropdown/NavData";
import SearchByProduct from "../components/Website/Filters/SearchByProduct";
import serinLogo from "../../assets/serin-logo.png";
import serinMobileLogo from "../../assets/mobileLogo.png";
import NavbarMobileCategory from "./Website/Dropdown/NavbarMobileCategory";
import '../../styles/serin.css';

const NavbarSerin = () => {
  const { data: session, status } = useSession();
  const { cartCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === "loading") {
    return <div className="bg-white p-4">Loading...</div>;
  }

  return (
    <div className="w-full sticky top-0 z-40">
      <div className="w-full bigDisplay  z-40 bg-white fontPoppins border-b border-pink-200 shadow-sm">
        {/* Top Navigation Bar */}
        <div className="max-w-[1440px] mx-auto px-4 flex flex-row justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex flex-row items-center gap-8">
            <Link href="/" className="flex items-center">
              <img
                src={serinLogo.src}
                className="w-28 h-16 object-contain"
                alt="Serin Logo"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <SearchByProduct></SearchByProduct>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-5">
            {/* Wishlist Button */}
            {/* <button className="flex flex-col items-center text-pink-900 hover:text-pink-700 transition-colors p-2 relative group">
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
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-xs mt-1 hidden sm:block">Wishlist</span>
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">0</span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button> */}

            {/* Account Button */}
            <div className="flex items-center">
              {status === "authenticated" ? (
                <div className="flex items-center gap-2">
                  {session?.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center text-pink-900 hover:text-pink-700 transition-colors p-2 group relative"
                      aria-label="Admin dashboard"
                      title="Admin"
                      prefetch={true}
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
                          strokeWidth={1.5}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-xs mt-1 hidden sm:block">
                        Admin
                      </span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </Link>
                  )}

                  <div className="flex flex-col items-center text-pink-900 p-2 group relative">
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
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs mt-1 hidden sm:block">
                      Account
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-[#414143] hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                    aria-label="Sign out"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="text-pink-900 hover:text-pink-700 transition-colors px-4 py-2 rounded-full text-sm font-medium border border-pink-300 hover:border-pink-500"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-[#414143] hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Shopping Bag Button with Cart Count */}
            <Link
              href="/cart"
              className="flex flex-col items-center text-pink-900 hover:text-pink-700 transition-colors p-2 relative group"
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
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-xs mt-1 hidden sm:block">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </div>
        </div>

        {/* Category Section */}
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center h-16">
            <NavData />
          </div>
        </div>
      </div>
      <div className="mobileDisplay top-0">
        <div className="w-full flex flex-row items-center justify-between fontPoppins bg-white py-3 px-4">
          <div className="flex flex-row justify-between items-center gap-4 w-full">
            <NavbarMobileCategory></NavbarMobileCategory>
            <Link href="/">
              <div className="flex flex-row gap-5">
                
              <div className="flex flex-row items-center gap-1">
                <img src={serinMobileLogo.src} alt="" className="w-[90px] h-[32px]"></img>
           
              </div>
            
              </div>
              </Link>
              <Link href="/cart">
                <button
                  className="relative cursor-pointer flex items-center justify-center p-2 text-gray-600 transition-colors duration-200 ease-in-out hover:text-green-600 dark:text-black dark:hover:text-green-400"
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>

                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#414143] text-xs font-medium text-white shadow-sm transition-all duration-200 group-hover:scale-110 dark:bg-green-500">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>
              </Link>
          </div>
          <div className="">
            <div className="flex items-center gap-1">
              

              {/* {status === "authenticated" ? (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {session?.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="p-1 text-[10px]  text-gray-600 dark:text-black hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        aria-label="Admin dashboard"
                        title="Admin"
                        prefetch={true}
                      >
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="bg-[#414143] text-[10px] hover:bg-green-700 text-white px-2 py-1.5 rounded-md transition-colors text-sm font-medium"
                      aria-label="Sign out"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 text-[10px] dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-[#414143] text-[10px] hover:bg-green-700 text-white px-2 py-1.5 rounded-md transition-colors text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )} */}
            </div>
          </div>
        </div>
        <div className="w-full pb-4 bg-white">
                    <SearchByProduct></SearchByProduct>

        </div>
      </div>
    </div>
  );
};
export default NavbarSerin;
