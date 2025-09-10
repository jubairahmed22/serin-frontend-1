"use client";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import useCon from '../hooks/useCon';
import CartItemCompo from "../components/Website/CartCompo/CartItemCompo";
import '../../styles/cart.css';
import OrderSummary from "../components/Website/CartCompo/OrderSummery";

const CartPage = () => {
  const { cart, cartCount, clearCart, removeFromCart, updateCart } = useCart();
  const { config } = useCon();
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState('insideDhaka');
  
  const { 
    deliveryChargeOutsideDhaka: outsideCharge,
    deliveryChargeInsideDhaka: insideCharge 
  } = config;

  const deliveryCharge = deliveryLocation === 'insideDhaka' ? insideCharge : outsideCharge;

  const calculateFinalPrice = (item) => {
    if (!item.discountType) return item.price;
    
    return Math.max(
      item.discountType === "percentage"
        ? item.price * (1 - item.discountValue / 100)
        : item.price - item.discountValue,
      0
    );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCart(cart.map(item => 
      item._id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const { subtotal, totalDiscount, itemCount } = cart.reduce(
    (acc, item) => {
      const finalPrice = calculateFinalPrice(item);
      const itemTotal = finalPrice * item.quantity;
      return {
        subtotal: acc.subtotal + itemTotal,
        totalDiscount: acc.totalDiscount + (item.price * item.quantity - itemTotal),
        itemCount: acc.itemCount + item.quantity,
      };
    },
    { subtotal: 0, totalDiscount: 0, itemCount: 0 }
  );

  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-white max-w-[1400px] mx-auto py-10 fontPoppins px-4">
      <div className="flex flex-row cartCustomLayout gap-5 w-full">
        <div className="w-[55%] customWidthFull">
          <h1 className="lg:text-xl md:text-lg sm:text-sm mb-6 py-6 px-4 bg-[#F01F7B]/10 rounded-2xl text-black font-semibold">
            Your Cart ({cartCount} items)
          </h1>
          <CartItemCompo
            cart={cart}
            editingQuantity={editingQuantity}
            setEditingQuantity={setEditingQuantity}
            removeFromCart={removeFromCart}
            calculateFinalPrice={calculateFinalPrice}
            handleQuantityChange={handleQuantityChange}
          />
        </div>
        
        <div className="w-[45%] customWidthFull">
          <OrderSummary
            cart={cart}
            clearCart={clearCart}
            itemCount={itemCount}
            cartCount={cartCount}
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            total={total}
            deliveryCharge={deliveryCharge}
            deliveryChargeInsideDhaka={insideCharge}
            deliveryChargeOutsideDhaka={outsideCharge}
            deliveryLocation={deliveryLocation}
            setDeliveryLocation={setDeliveryLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;