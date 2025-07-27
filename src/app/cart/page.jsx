"use client";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import useCon from '../hooks/useCon';
import { toast } from "react-hot-toast";
import CartItemCompo from "../components/Website/CartCompo/CartItemCompo";
import OrderSummery from "../components/Website/CartCompo/OrderSummery";
import '../../styles/cart.css';

const Page = () => {
  const { cart, cartCount, removeFromCart, updateCart } = useCart();
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


  return (
    <div className="min-h-screen bg-white max-w-[1400px] mx-auto py-10 fontPoppins px-4">
      <div className="flex flex-row cartCustomLayout  gap-5 w-full">
        <div className="w-[55%] customWidthFull">
          <h1 className="lg:text-xl md:text-lg sm:text-sm mb-6 py-6 px-4 bg-[#defde8] rounded-2xl text-black font-semibold ">
            Your Cart ({cartCount} items)
          </h1>
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
        </div>
        <div className="w-[45%] customWidthFull">
 
            <OrderSummery
              itemCount={cartSummary.itemCount}
              subtotal={cartSummary.subtotal}
              totalDiscount={cartSummary.totalDiscount}
              deliveryCharge={DELIVERY_CHARGE}
              total={total}
            />

        </div>
      </div>
    </div>
  );
};

export default Page;
