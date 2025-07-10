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

  return (
    <div className="sticky top-4 fontPoppins">
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-৳{totalDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>৳{deliveryCharge.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
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
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={userInfo.phone}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={userInfo.address}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div> */}
        <Link href="/shipping">
          <button
            // onClick={handlePayment}
            className="w-full cursor-pointer bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
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
