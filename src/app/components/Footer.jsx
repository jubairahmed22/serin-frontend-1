"use client"
import React from "react";
import logo from "../../assets/Logo-SERIN-white.png";
import "../../styles/footer.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhoneAlt, FaClock, FaMapMarkerAlt, FaEnvelope, FaTiktok } from 'react-icons/fa';
import {  FaXTwitter } from 'react-icons/fa6';
// Dynamically import the Categories component with SSR disabled
const Categories = dynamic(() => import("./Categories"), { ssr: false });

const Footer = () => {

  const socialLinks = [
    { icon: <FaFacebook size={24} />, url: "https://www.facebook.com/serinbeautyshop?rdid=wZ3jtuHh4GGj65ez&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EptJk4WW2%2F#" },
    { icon: <FaInstagram size={24} />, url: "https://www.instagram.com/serinbeautyshop?igsh=enBhbHExeGI4cnRs" },
    // { icon: <FaLinkedin size={24} />, url: "https://www.linkedin.com/in/book-forest-27502b379/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    // { icon: <FaXTwitter size={24} />, url: "https://x.com/BookForest2025?t=6H2hD3PaUSou4-kFFN_X9g&s=09" },
    // { icon: <FaTiktok size={24} />, url: "https://www.tiktok.com/@book.forest2?_t=ZS-8yeKXSCgzGE&_r=1", name: "TikTok" },

  ];
  return (
    <div className="bg-[#282828] text-white fontPoppins w-full">
      <div className="max-w-[1400px] w-full mx-auto px-4 py-10">
        <div className="gridCustom w-full">
          {/* Logo & Address */}
          <div className="flex flex-col items-start">
            <img src={logo.src} alt="BookforrestLogo" className="serinfoter  h-auto mb-4" />
            {/* <p className="text-sm text-pink-50">Octroy Mor, Kazla, Rajshahi-6204 (Beside University of Rajshahi)</p> */}
         
          </div>

          {/* Need Help */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Need Help</h2>
            <p className="text-2xl font-bold text-pink-100 mb-2">01734346050</p>
            <p className="text-sm text-pink-50">Sunday - Friday: 9:00 - 20:00</p>
            <p className="text-sm text-pink-50">Saturday: 11:00 - 15:00</p>
            <div>
              <div className="flex justify-start space-x-6 mt-5">
          {socialLinks.map((social, index) => (
            <div
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, color: "#50C878" }}
              className="text-gray-200 hover:text-pink-100 transition-colors duration-300"
            >
              {social.icon}
            </div>
          ))}
        </div>
            </div>
          </div>
 {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <Categories />
          </div>
          {/* Explore */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Explore</h2>
            <ul className="space-y-4 text-sm text-pink-50">
              <Link href="/products"><li>All Products</li></Link>
              {/* <Link href="/all-publishers"><li>Publications</li></Link> */}
              <Link href="/auth/login">Sign Up / Login</Link>
            </ul>
          </div>

          {/* Services */}
          {/* <div>
            <h2 className="text-lg font-semibold mb-4">Our Services</h2>
            <ul className="space-y-2 text-sm text-pink-50">
               <li>
        <Link target="_blank" href="/help-center">Help Center</Link>
      </li>
      <li>
        <Link target="_blank" href="/privacy-policy">Privacy Policy</Link>
      </li>
      <li>
        <Link target="_blank" href="/store-pickup">Store Pickup</Link>
      </li>
            <li>
        <Link target="_blank" href="/contact-us">Contact Us</Link>
      </li>
            </ul>
          </div> */}

         
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#444]">
        <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-pink-50 text-center sm:text-left">
            © 2025 <span className="text-pink-100">Bookforrest</span>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;