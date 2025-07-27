import React from "react";
import logo from "../../assets/book_forest.png";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <div className="bg-[#282828] text-white fontPoppins w-full">
  <div className="max-w-[1400px] w-full mx-auto px-4 py-10">
    <div className="gridCustom">
      {/* Logo & Address */}
      <div className="flex flex-col items-start">
        <img src={logo.src} alt="Bookforrest Logo" className="w-[150px] h-auto mb-4" />
        <p className="text-sm text-[#b3b3b3]">Sector-06, Uttara, Dhaka - 1230</p>
      </div>

      {/* Need Help */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Need Help</h2>
        <p className="text-2xl font-bold text-[#50C878] mb-2">+880-1763427561</p>
        <p className="text-sm text-[#b3b3b3]">Sunday - Friday: 9:00 - 20:00</p>
        <p className="text-sm text-[#b3b3b3]">Saturday: 11:00 - 15:00</p>
      </div>

      {/* Explore */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Explore</h2>
        <ul className="space-y-2 text-sm text-[#b3b3b3]">
          <li>About Us</li>
          <li>Sitemap</li>
          <li>Bookmarks</li>
          <li>Sign In / Join</li>
        </ul>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Our Services</h2>
        <ul className="space-y-2 text-sm text-[#b3b3b3]">
          <li>Help Center</li>
          <li>Returns</li>
          <li>Product Recalls</li>
          <li>Accessibility</li>
          <li>Contact Us</li>
          <li>Store Pickup</li>
        </ul>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <ul className="space-y-2 text-sm text-[#b3b3b3]">
          <li>Action</li>
          <li>Comedy</li>
          <li>Drama</li>
          <li>Horror</li>
          <li>Kids</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-[#444]">
    <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
      <p className="text-sm text-[#b3b3b3] text-center sm:text-left">
        © 2025 <span className="text-[#50C878]">Bookforrest</span>. All rights reserved.
      </p>
    </div>
  </div>
</div>

  );
};

export default Footer;
