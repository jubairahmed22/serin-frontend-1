"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const OrderSummary = ({
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

  const handlePayment = async () => {
    const { name, email, phone, address } = userInfo;
    if (!name || !email || !phone || !address) {
      return alert("Please fill in all the billing fields before checkout.");
    }

    try {
      const response = await axios.post(
        "https://books-server-001.vercel.app/pay-sslcommerz",
        {
          total,
          email,
          name,
          phone,
          address,
        }
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong while processing payment.");
    }
  };

  const mainPrice = subtotal - totalDiscount

  return (
   <div className="sticky top-4 fontPoppins">
  <div className="border rounded-lg p-6 bg-white shadow-sm dark:bg-white dark:border-gray-200">
    <h3 className="text-xl font-semibold mb-4 dark:text-gray-900">Order Summary</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="dark:text-gray-800">
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
        <span className="dark:text-gray-800">৳{subtotal.toFixed(2)}</span>
      </div>

      {/* {totalDiscount > 0 && (
        <div className="flex justify-between text-green-600 dark:text-green-700">
          <span>Discount</span>
          <span>-৳{totalDiscount.toFixed(2)}</span>
        </div>
      )} */}

      <div className="flex justify-between">
        <span className="dark:text-gray-800">Delivery Charge</span>
        <span className="dark:text-gray-800">৳{deliveryCharge.toFixed(2)}</span>
      </div>

      <div className="border-t pt-3 flex justify-between font-bold text-lg dark:border-gray-300">
        <span className="dark:text-gray-900">Total</span>
        <span className="dark:text-gray-900">৳{total.toFixed(2)}</span>
      </div>
    </div>

    {/* Billing Form */}
    {/* <div className="mt-6 space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={userInfo.name}
        onChange={handleInputChange}
        className="w-full border p-2 rounded dark:border-gray-300 dark:bg-white dark:text-gray-900 dark:placeholder-gray-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={userInfo.email}
        onChange={handleInputChange}
        className="w-full border p-2 rounded dark:border-gray-300 dark:bg-white dark:text-gray-900 dark:placeholder-gray-500"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={userInfo.phone}
        onChange={handleInputChange}
        className="w-full border p-2 rounded dark:border-gray-300 dark:bg-white dark:text-gray-900 dark:placeholder-gray-500"
      />
      <textarea
        name="address"
        placeholder="Shipping Address"
        value={userInfo.address}
        onChange={handleInputChange}
        className="w-full border p-2 rounded dark:border-gray-300 dark:bg-white dark:text-gray-900 dark:placeholder-gray-500"
      />
    </div> */}
    <Link href="/shipping">
      <button
        // onClick={handlePayment}
        className="w-full cursor-pointer bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors dark:bg-[#50C878] dark:hover:bg-[#3DAE60]"
        disabled={itemCount === 0}
      >
        Proceed to Checkout (৳{total.toFixed(2)})
      </button>
    </Link>
  </div>
</div>
  );
};

export default OrderSummary;
