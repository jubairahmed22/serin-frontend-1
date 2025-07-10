"use client";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";
import CartItemCompo from "../components/Website/CartCompo/CartItemCompo";
import OrderSummery from "../components/Website/CartCompo/OrderSummery";
import ProtectedRoute from "../components/ProtectedRoute";
import ShippingTitle from "../components/Website/CartCompo/ShippingTitle";
import ShippingProductsValue from "../components/Website/CartCompo/ShippingProductsValue";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
const Page = () => {
  const { data: session, status } = useSession();

  const { cart, cartCount, removeFromCart, updateCart } = useCart();
  const [editingQuantity, setEditingQuantity] = useState(null);
  const DELIVERY_CHARGE = 112; // TKA online fee constant

  const calculateFinalPrice = (item) => {
    return Math.max(
      item.discountType === "percentage"
        ? item.price * (1 - item.discountValue / 100)
        : item.discountType === "fixed"
        ? item.price - item.discountValue
        : item.price,
      0
    );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const handleInputBlur = (productId, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      handleQuantityChange(productId, 1);
    }
    setEditingQuantity(null);
  };

  // Calculate cart values
  const cartSummary = cart.reduce(
    (acc, item) => {
      const finalPrice = calculateFinalPrice(item);
      const itemTotal = finalPrice * item.quantity;

      return {
        subtotal: acc.subtotal + itemTotal,
        totalDiscount:
          acc.totalDiscount + (item.price * item.quantity - itemTotal),
        itemCount: acc.itemCount + item.quantity,
      };
    },
    { subtotal: 0, totalDiscount: 0, itemCount: 0 }
  );

  const total = cartSummary.subtotal + DELIVERY_CHARGE;

  const [userInfo, setUserInfo] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const processCartForBackend = (cart) => {
  return cart.map(item => ({
    _id: item._id,
    productId: item.productId,
    title: item.title,
    price: item.price,
    stock: item.stock,
    numberOfPages: item.numberOfPages,
    weight: item.weight,
    rating: item.rating,
    categoryId : item.parentCategory.id,
    subCategoryId : item.parentSubCategory.objectId,
    childCategoryId : item.parentChildCategory.objectId,
    publisherId: item.publisher.id,
    authorId: item.author.id,
    singleImage: item.singleImage,
    popularBooks: item.popularBooks,
    trendingNow: item.trendingNow,
    newReleased: item.newReleased,
    discount: item.discount,
    discountType: item.discountType,
    discountValue: item.discountValue,
    dailyDeals: item.dailyDeals,
    quantity: item.quantity,
    discountedPrice: item.discountedPrice,
    deliveryCharge: DELIVERY_CHARGE
  }));
};

  const handlePayment = async () => {
    const processedCart = processCartForBackend(cart);
    const name = session?.user?.name || userInfo.name;
    const email = session?.user?.email || userInfo.email;
    const { phone, address } = userInfo;
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
          cart: processedCart,
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

  

 const handleCashOnDelivery = async () => {
  const processedCart = processCartForBackend(cart);
  const name = session?.user?.name || userInfo.name;
  const email = session?.user?.email || userInfo.email;
  const { phone, address } = userInfo;
  
  // Validate required fields
  if (!name || !email || !phone || !address) {
    return alert("Please fill in all the billing fields before checkout.");
  }

  try {
    const response = await axios.post(
      "https://books-server-001.vercel.app/pay-cashondelivery",
      {
        total,
        email,
        name,
        phone,
        address,
        cart: processedCart,
        method: "Cash On Delivery" // Explicitly setting the method
      }
    );

    if (response.data.success) {
      alert('Order placed successfully!');
      // Handle success (clear cart, redirect, etc.)
    }

  } catch (error) {
    console.error("Order Error:", error);
    alert(error.response?.data?.error || "Order failed");
  }
};
  const itemCount = cartSummary.itemCount;


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white max-w-[1400px] mx-auto py-10 fontPoppins">
        <div className="flex flex-row lg:flex-row gap-5 w-full">
          <div>
            {/* Billing Form */}
            <div className="mt-6 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={session?.user?.name || userInfo.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                disabled={!!session?.user?.name} // Disable if session name exists
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={session?.user?.email || userInfo.email}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                disabled={!!session?.user?.email} // Disable if session email exists
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
            </div>

            <div className="flex flex-row gap-5">
              <button
                onClick={handleCashOnDelivery}
                className="w-full bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                disabled={itemCount === 0}
              >
                Cash On Delivery (৳{total.toFixed(2)})
              </button>
              <button
                onClick={handlePayment}
                className="w-full bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                disabled={itemCount === 0}
              >
                Mobile Wallet (৳{total.toFixed(2)})
              </button>
            </div>
          </div>
          <div className="w-[55%] flex flex-col gap-5">
            <ShippingTitle cartCount={cartCount}></ShippingTitle>
            <ShippingProductsValue
              itemCount={cartSummary.itemCount}
              subtotal={cartSummary.subtotal}
              totalDiscount={cartSummary.totalDiscount}
              deliveryCharge={DELIVERY_CHARGE}
              total={total}
            ></ShippingProductsValue>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
