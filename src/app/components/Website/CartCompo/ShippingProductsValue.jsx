"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const ShippingProductsValue = ({
  itemCount,
  subtotal,
  totalDiscount,
  deliveryCharge,
  total,
}) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="sticky top-4 fontPoppins">
  <div className="border rounded-lg p-6 bg-white shadow-sm dark:bg-white dark:border-gray-300">
    <h3 className="text-xl font-semibold mb-4 dark:text-gray-900">Order Summary</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="dark:text-gray-800">
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
        <span className="dark:text-gray-800">৳{subtotal.toFixed(2)}</span>
      </div>

      {/* {totalDiscount > 0 && (
        <div className="flex justify-between text-pink-600 dark:text-pink-700">
          <span>Discount</span>
          <span>-৳{totalDiscount.toFixed(2)}</span>
        </div>
      )} */}

      <div className="flex justify-between">
        <span className="dark:text-gray-800">Online Fee</span>
        <span className="dark:text-gray-800">৳{deliveryCharge.toFixed(2)}</span>
      </div>

      <div className="border-t pt-3 flex justify-between font-bold text-lg dark:border-gray-400 dark:text-gray-900">
        <span>Total</span>
        <span>৳{total.toFixed(2)}</span>
      </div>
    </div>
  </div>
</div>
  );
};

export default ShippingProductsValue;
