import React from "react";
import whatsapp from "../../assets/bx_phone-call.png";
import facebook from "../../assets/ic_baseline-facebook.png";
import instagram from "../../assets/mdi_instagram.png";
import logo from "../../assets/book_forest.png";
import category from "../../assets/categories.png";
import cartIcon from "../../assets/cartIcon2.png";
import NavbarCategory from "../components/Website/Dropdown/NavbarCategory";
import NavbarMobileCategory from "../components/Website/Dropdown/NavbarMobileCategory";
import PublicationCategory from "../components/Website/Dropdown/PublicationCategory";
import WriterCategory from "../components/Website/Dropdown/WriterCategory";
import InputFilter from "../components/Website/Filters/InputFilter";
import "../../styles/globals.css";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
// import {CartCount} from '../hooks/CartCount'

const NavbarInfo = () => {
  const { data: session, status } = useSession();
  const { cartCount } = useCart();

  if (status === "loading") {
    return <div className="bg-white p-4">Loading...</div>;
  }

  return (
    <div>
      <div className="w-full bg-black fontPoppins px-4">
        <div className="max-w-[1400px] mx-auto flex justify-between">
          <div className=" py-2 flex flex-row items-center gap-5">
            <h1 className="navInfoText">Customer Support</h1>
            <div className="flex flex-row gap-2">
              <img src={whatsapp.src} alt="" className="w-4 h-4"></img>
              <h1 className="navInfoText">+880 1763427561</h1>
            </div>
          </div>
          <div className=" flex justify-end items-center">
            <div className="flex flex-row gap-4 items-center">
              <img src={facebook.src} alt="" className="w-4 h-4"></img>
              <img src={instagram.src} alt="" className="w-4 h-4"></img>
            </div>
          </div>
        </div>
      </div>
      {/* section two of navbar */}
      <div className="w-full categorySection bg-white border-b border-b-[#E6E6E6]">
        <div className="max-w-[1400px] h-[138px]  mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex flex-row items-center gap-5">
              <img src={logo.src} alt="" className="w-[149px] h-[140px]"></img>
              <h1 className="text-2xl dark:text-black font-bold text-[#414143]">Book Forest</h1>
            </div>
          </Link>
          <div className="w-[650px] h-[52px] flex flex-row justify-between gap-5">
            <NavbarCategory></NavbarCategory>
            <InputFilter></InputFilter>
          </div>
          <div className="w-56 h-10 flex items-center justify-end gap-4">
            <div className="flex items-center gap-4 ml-2">
              <Link href="/cart">
                <button
                  className="relative cursor-pointer flex items-center justify-center dark:text-black p-2 text-gray-600 transition-colors duration-200 ease-in-out hover:text-green-600  dark:hover:text-green-400"
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

              {/* <button className="text-gray-600 dark:text-black hover:text-green-600 dark:hover:text-green-400 transition-colors p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button> */}
              {status === "authenticated" ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    {session?.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="p-1  text-gray-600 dark:text-black hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        aria-label="Admin dashboard"
                        title="Admin"
                        prefetch={true}
                      >
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="bg-[#414143] hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                      aria-label="Sign out"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-[#414143] hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="phoneShow ">
         <div className="w-full flex flex-row items-center justify-between fontPoppins bg-green-100 py-2 px-4">
            <div className="flex flex-row items-center gap-4">
          <NavbarMobileCategory></NavbarMobileCategory>
          <Link href="/">
            <div className="flex flex-row items-center gap-1">
              <img src={logo.src} alt="" className="w-[44px] h-[45px]"></img>
              <h1 className="text-sm font-bold dark:text-black">Book Forest</h1>
            </div>
          </Link>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
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

            {status === "authenticated" ? (
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
            )}
          </div>
        </div>
         </div>
         <div className="w-full bg-[#414143] px-8 py-2">
            <InputFilter></InputFilter>
         </div>
      </div>
      {/* bottom category */}
      <div className="w-full bg-white border-b categorySection border-b-[#E6E6E6]">
        <div className="max-w-[1400px] h-[75px] fontPoppins font-semibold  mx-auto flex justify-between  items-center">
          <div>
          </div>
          <div className="flex flex-row gap-10 textLink">
            <Link href="/">Home</Link>
            <WriterCategory></WriterCategory>
            <PublicationCategory></PublicationCategory>

            <Link href="/">Contact</Link>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default NavbarInfo;
