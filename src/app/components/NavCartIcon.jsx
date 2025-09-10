// app/components/NavCartIcon.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CartItemCompo from "./Website/CartCompo/CartItemCompo";
import useCon from "../hooks/useCon";
import '../../styles/serin.css'

const NavCartIcon = () => {
  const {
    cartCount,
    getTotalPrice,
    cartItems,
    cart,
    removeFromCart,
    updateCart,
  } = useCart();

  const totalPrice = getTotalPrice();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const controls = useAnimation();

  // Trigger animation whenever cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      controls.start({
        scale: [1, 1.2, 0.95, 1],
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    }
  }, [cartCount, controls]);

  const { config, loading, error } = useCon();
  const [editingQuantity, setEditingQuantity] = useState(null);
  const DELIVERY_CHARGE = config.deliveryCharge;

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

  const handleInputChange = (productId, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      handleQuantityChange(productId, numValue);
    }
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <motion.div
  className="fixed right-1 top-1/2 -translate-y-1/2 z-50 cursor-pointer"
  animate={controls}
  onClick={toggleDrawer}
>
  <div className="relative flex flex-col items-center gap-2">
    {/* Main Cart Button */}
    <div
      className="bg-gradient-to-br from-[#F01F7B] to-[#D4145A] p-4 rounded-full shadow-lg border border-pink-200 
      hover:shadow-2xl hover:scale-110 transition-transform duration-300 flex justify-center items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Item count badge */}
      {cartCount > 0 && (
        <motion.span
          key="cart-count-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute -top-1 -right-1 bg-[#414143] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md border-2 border-white"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </motion.span>
      )}
    </div>

    {/* Total Price */}
    {cartCount > 0 && (
      <motion.div
        key="cart-total"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#414143] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md border border-white"
      >
        BDT {totalPrice}
      </motion.div>
    )}
  </div>
</motion.div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeDrawer}
            />

            {/* Cart Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-[620px] bg-white shadow-xl z-50 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">
                  Your Cart ({cartCount} items)
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <CartItemCompo
                cart={cart}
                editingQuantity={editingQuantity}
                handleQuantityChange={handleQuantityChange}
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                setEditingQuantity={setEditingQuantity}
                removeFromCart={removeFromCart}
                calculateFinalPrice={calculateFinalPrice}
              />

              {/* Cart Footer */}
              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">BDT {totalPrice}</span>
                </div>
                <Link
                  href="/cart"
                  className="block w-full cursor-pointer bg-[#F01F7B] text-white text-center py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
                  onClick={closeDrawer}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavCartIcon;
