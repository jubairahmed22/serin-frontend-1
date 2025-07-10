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
            <span>Online Fee</span>
            <span>৳{deliveryCharge.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingProductsValue;
