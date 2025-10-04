"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useCart } from "../../../hooks/useCart";
import Swal from "sweetalert2";


const OrderConfirm = ({ deliveryCharge, deliveryLocation}) => {
    const { data: session, status } = useSession();
  const { cart, cartCount, clearCart } = useCart();

const [privacyAccepted, setPrivacyAccepted] = useState(false);


  const [editingQuantity, setEditingQuantity] = useState(null);
  const DELIVERY_CHARGE = deliveryCharge;

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
      brand: item.brand.name,
    //   authorId: item.author.id,
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
        "https://cosmetics-server-001.vercel.app/pay-sslcommerz",
        {
          total,
          deliveryLocation,
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
  //         "https://cosmetics-server-001.vercel.app/api/sent-cart-details",
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
        "https://cosmetics-server-001.vercel.app/pay-cashondelivery",
        {
          total,
          deliveryLocation: deliveryLocation,
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
            "https://cosmetics-server-001.vercel.app/api/sent-cart-details",
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
                  deliveryLocation: deliveryLocation,
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
            await Swal.fire({
              icon: 'success',
              title: 'Order Successful!',
              html: `Thank you for your order! We've successfully processed your purchase.<br>${result.message || 'Confirmation email sent.'}`,
              confirmButtonColor: '#3085d6',
            });
          } else {
            await Swal.fire({
              icon: 'success',
              title: 'Order Processed',
              html: `Thank you for your order! We've successfully processed your purchase.<br>${result.message || 'But failed to send confirmation email.'}`,
              confirmButtonColor: '#3085d6',
            });
            setIsLoading(false);
          }
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          await Swal.fire({
            icon: 'success',
            title: 'Order Processed',
            html: 'Thank you for your order! We\'ve successfully processed your purchase.<br>But failed to send confirmation email.',
            confirmButtonColor: '#3085d6',
          });
        }

        // Handle success (clear cart, redirect, etc.)
      clearCart();
      setUserInfo({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      address: "",
    });

    // Redirect to success page
    window.location.href = "/order-success"; // Change this to your success page U

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
    <div className="fontPoppins">
  <div className="flex flex-col md:flex-row gap-5 w-full">
    <div>
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

      {/* Privacy Policy Radio */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="radio"
          id="privacyPolicy"
          name="privacyPolicy"
          checked={privacyAccepted}
          onChange={() => setPrivacyAccepted(!privacyAccepted)}
          className="w-4 h-4"
        />
        <label htmlFor="privacyPolicy" className="text-sm text-gray-700">
          I agree to the{" "}
          <a href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </a>{" "}
          {/* &{" "} */}
          {/* <a href="/terms" className="text-blue-600 underline">
            Terms of Service
          </a> */}
        </label>
      </div>

      <div className="flex flex-row gap-5">
        <button
          onClick={handleCashOnDelivery}
          className={`w-full bg-[#F01F7B] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors flex justify-center items-center ${
            itemCount === 0 || isLoading || !privacyAccepted
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
          disabled={itemCount === 0 || isLoading || !privacyAccepted}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            `Cash On Delivery (৳${total.toFixed(2)})`
          )}
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default OrderConfirm;