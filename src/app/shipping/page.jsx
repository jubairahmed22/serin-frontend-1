"use client";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import useCon from "../hooks/useCon";
import { toast } from "react-hot-toast";
import CartItemCompo from "../components/Website/CartCompo/CartItemCompo";
import OrderSummery from "../components/Website/CartCompo/OrderSummery";
import ProtectedRoute from "../components/ProtectedRoute";
import ShippingTitle from "../components/Website/CartCompo/ShippingTitle";
import ShippingProductsValue from "../components/Website/CartCompo/ShippingProductsValue";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import "../../styles/cart.css";
const Page = () => {
  const { data: session, status } = useSession();

  const { cart, cartCount, removeFromCart, updateCart } = useCart();
  const { config, loading, error } = useCon();

  const [editingQuantity, setEditingQuantity] = useState(null);
  const DELIVERY_CHARGE = config.deliveryCharge; // TKA online fee constant

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

  const deliveryCharge = DELIVERY_CHARGE;

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
    return cart.map((item) => ({
      _id: item._id,
      productId: item.productId,
      title: item.title,
      price: item.price,
      stock: item.stock,
      numberOfPages: item.numberOfPages,
      weight: item.weight,
      rating: item.rating,
      categoryId: item.parentCategory.id,
      subCategoryId: item.parentSubCategory.objectId,
      childCategoryId: item.parentChildCategory.objectId,
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
          customerTotal: total,
          email,
          name,
          phone,
          address,
          cart: processedCart,
          deliveryCharge,
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

  //     const handleSendEmail = async () => {
  //     const processedCart = processCartForBackend(cart);
  //     const name = session?.user?.name || userInfo.name;
  //     const email = session?.user?.email || userInfo.email;
  //     const { phone, address } = userInfo;
  //     // Generate a 6-digit random number
  // const randomCode = Math.floor(100000 + Math.random() * 900000);

  // // Create invoice ID with prefix "INV-" and the random code
  // const invoiceId = `INV-${randomCode}`;
  //     if (!name || !email || !phone || !address) {
  //       return alert("Please fill in all the billing fields before checkout.");
  //     }

  //     try {
  //       const response = await fetch(
  //         "https://books-server-001.vercel.app/api/sent-cart-details",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             email: email,
  //             subject: name,
  //             cartItems: processedCart,
  //             formData: {
  //               // Group form-related data together
  //               name: name,
  //               email: email,
  //               number: phone,
  //               address: address,
  //               deliveryCharge: deliveryCharge,
  //               invoiceId : invoiceId
  //             },
  //           }),
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();

  //       if (result.success) {
  //         alert(result.message || "Email sent successfully!");
  //       } else {
  //         alert(result.message || "Failed to send email");
  //       }
  //     } catch (error) {
  //       console.error("Error sending email:", error);
  //       alert(error.message || "Failed to send email. Please try again later.");
  //     }
  //   };

  const [isLoading, setIsLoading] = useState(false);

  const handleCashOnDelivery = async () => {
    setIsLoading(true); // Start loading

    const processedCart = processCartForBackend(cart);
    const name = session?.user?.name || userInfo.name;
    const email = session?.user?.email || userInfo.email;
    const { phone, address } = userInfo;

    // Generate invoice ID once for both operations
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const invoiceId = `INV-${randomCode}`;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return alert("Please fill in all the billing fields before checkout.");
    }

    try {
      // First make the cash on delivery order request
      const orderResponse = await axios.post(
        "https://books-server-001.vercel.app/pay-cashondelivery",
        {
          total,
          customerTotal: total,
          email,
          name,
          phone,
          address,
          cart: processedCart,
          method: "Cash On Delivery",
          deliveryCharge,
          invoiceId, // Include the same invoice ID in order request
        }
      );

      if (orderResponse.data.success) {
        // Then send the email confirmation
        try {
          const emailResponse = await fetch(
            "https://books-server-001.vercel.app/api/sent-cart-details",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email,
                subject: name,
                cartItems: processedCart,
                formData: {
                  name: name,
                  email: email,
                  number: phone,
                  address: address,
                  deliveryCharge: deliveryCharge,
                  invoiceId: invoiceId, // Use the same invoice ID
                },
              }),
            }
          );

          if (!emailResponse.ok) {
            throw new Error(`HTTP error! status: ${emailResponse.status}`);
          }

          const result = await emailResponse.json();

          if (result.success) {
            alert(
              "Order placed successfully! " +
                (result.message || "Confirmation email sent.")
            );

          } else {
            alert(
              "Order placed successfully! " +
                (result.message || "But failed to send confirmation email.")
            );
           setIsLoading(false); // Stop loading if order fails

          }
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          alert(
            "Order placed successfully! But failed to send confirmation email."
          );
        }

        // Handle success (clear cart, redirect, etc.)
      } else {
        throw new Error(orderResponse.data.error || "Order failed");
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
        <div className="flex flex-row  gap-5 w-full px-4 itePositionWeb">
          <div>
            {/* Billing Form */}
            <div className="mt-6 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={session?.user?.name || userInfo.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500 disabled:dark:bg-gray-100 disabled:dark:text-gray-700"
                disabled={!!session?.user?.name}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={session?.user?.email || userInfo.email}
                onChange={handleInputChange}
                className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500 disabled:dark:bg-gray-100 disabled:dark:text-gray-700"
                disabled={!!session?.user?.email}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={userInfo.phone}
                onChange={handleInputChange}
                className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500"
              />
              <textarea
                name="address"
                placeholder="Shipping Address"
                value={userInfo.address}
                onChange={handleInputChange}
                className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500"
                rows="3"
              />
            </div>

            <div className="flex flex-row gap-5">
              <button
  onClick={handleCashOnDelivery}
  className={`w-full bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors flex justify-center items-center ${
    (itemCount === 0 || isLoading) ? 'opacity-70 cursor-not-allowed' : ''
  }`}
  disabled={itemCount === 0 || isLoading}
>
  {isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </>
  ) : (
    `Cash On Delivery (৳${total.toFixed(2)})`
  )}
</button>
              {/* <button
                onClick={handlePayment}
                className="w-full bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                disabled={itemCount === 0}
              >
                Mobile Wallet (৳{total.toFixed(2)})
              </button> */}
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
        <div className="itePositionMobile px-4">
          <div className="w-[55%] customWidthFull flex flex-col gap-5">
            <ShippingTitle cartCount={cartCount}></ShippingTitle>
            <ShippingProductsValue
              itemCount={cartSummary.itemCount}
              subtotal={cartSummary.subtotal}
              totalDiscount={cartSummary.totalDiscount}
              deliveryCharge={DELIVERY_CHARGE}
              total={total}
            ></ShippingProductsValue>
          </div>
          {/* Billing Form */}
          <div className="mt-6 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={session?.user?.name || userInfo.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500 disabled:dark:bg-gray-100 disabled:dark:text-gray-700"
              disabled={!!session?.user?.name}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={session?.user?.email || userInfo.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500 disabled:dark:bg-gray-100 disabled:dark:text-gray-700"
              disabled={!!session?.user?.email}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500"
            />
            <textarea
              name="address"
              placeholder="Shipping Address"
              value={userInfo.address}
              onChange={handleInputChange}
              className="w-full border p-2 rounded dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500"
              rows="3"
            />
          </div>
          <div className="flex flex-row gap-5">
            <button
  onClick={handleCashOnDelivery}
  className={`w-full bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors flex justify-center items-center ${
    (itemCount === 0 || isLoading) ? 'opacity-70 cursor-not-allowed' : ''
  }`}
  disabled={itemCount === 0 || isLoading}
>
  {isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </>
  ) : (
    `Cash On Delivery (৳${total.toFixed(2)})`
  )}
</button>
            {/* <button
                onClick={handlePayment}
                className="w-full bg-[#50C878] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
                disabled={itemCount === 0}
              >
                Mobile Wallet (৳{total.toFixed(2)})
              </button> */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
