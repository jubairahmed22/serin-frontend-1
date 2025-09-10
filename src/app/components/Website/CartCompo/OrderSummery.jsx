"use client";
import React from "react";
import Link from "next/link";
import OrderConfirm from "./OrderConfirm";

const OrderSummary = ({
  itemCount,
  subtotal,
  total,
  deliveryCharge,
  deliveryChargeInsideDhaka,
  deliveryChargeOutsideDhaka,
  deliveryLocation,
  setDeliveryLocation,
  cart,
  cartCount,
  clearCart
}) => {
  const deliveryOptions = [
    { id: 'insideDhaka', label: 'Inside Dhaka', charge: deliveryChargeInsideDhaka, time: '1 / 2 Days' },
    { id: 'outsideDhaka', label: 'Outside Dhaka', charge: deliveryChargeOutsideDhaka, time: '2 / 3 Days' }
  ];

  return (
    <div className="sticky top-4">
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
        

        <div className="space-y-6 mb-6">
  {/* Subtotal */}
  <div className="flex justify-between items-center">
    <span className="text-gray-700">
      Subtotal ({itemCount} item{itemCount !== 1 && 's'})
    </span>
    <span className="font-semibold text-gray-800">৳{subtotal.toFixed(2)}</span>
  </div>

  {/* Delivery Options */}
  <div>
    <h3 className="text-md font-semibold text-gray-800 mb-3">Select Delivery Location</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {deliveryOptions.map((option) => (
        <label
          key={option.id}
          htmlFor={option.id}
          className={`cursor-pointer p-4  justify-between rounded-lg border-2 transition-all flex flex-row  items-start sm:items-center sm:flex-row sm:justify-between gap-2 ${
            deliveryLocation === option.id
              ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between flex-row gap-4">
            <input
              type="radio"
              name="deliveryLocation"
              id={option.id}
              checked={deliveryLocation === option.id}
              onChange={() => setDeliveryLocation(option.id)}
              className="form-radio text-pink-600 focus:ring-pink-500"
            />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{option.label} Shipping Charge</span>
              <span className="font-medium text-sm">Shipping Time {option.time}</span>
            </div>
          </div>
          <span className="text-sm font-bold">{option.charge}৳</span>
        </label>
      ))}
    </div>
  </div>

  {/* Total */}
  <div className="border-t pt-4 flex justify-between items-center font-bold text-lg text-gray-800">
    <span>Total</span>
    <span>৳{total.toFixed(2)}</span>
  </div>
</div>


        {/* <Link href="/shipping">
          <button
            className={`w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors ${
              itemCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={itemCount === 0}
          >
            Proceed to Checkout (৳{total.toFixed(2)})
          </button>
        </Link> */}
        <OrderConfirm cart={cart} clearCart={clearCart} cartCount={cartCount} deliveryLocation={deliveryLocation} deliveryCharge={deliveryCharge}></OrderConfirm>

      </div>
    </div>
  );
};

export default OrderSummary;