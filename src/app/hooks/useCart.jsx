"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const useCart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      try {
        if (typeof window !== "undefined") {
          const storedCart = localStorage.getItem("booksCart");
          setCart(storedCart ? JSON.parse(storedCart) : []);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCart([]);
      }
    };

    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const updateCart = (newCart) => {
    try {
      setCart(newCart);
      if (typeof window !== "undefined") {
        localStorage.setItem("booksCart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
      }
      return true;
    } catch (error) {
      console.error("Failed to update cart:", error);
      return false;
    }
  };

  const addToCart = (product) => {
    try {
      const existingItemIndex = cart.findIndex(
        (item) => item._id === product._id
      );
      let newCart;

      if (existingItemIndex >= 0) {
        newCart = [...cart];
        newCart[existingItemIndex].quantity += product.quantity || 1;
      } else {
        newCart = [
          ...cart,
          {
            ...product,
            quantity: product.quantity || 1,
            discountedPrice: calculateDiscount(product),
          },
        ];
      }

      const success = updateCart(newCart);
      if (success) {
        toast.success(`${product.title} added to cart!`);
      }
      return success;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return false;
    }
  };

  const removeFromCart = (productId) => {
    try {
      const newCart = cart.filter((item) => item._id !== productId);
      const success = updateCart(newCart);
      if (success) {
        toast.success("Product removed from cart!");
      }
      return success;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      return false;
    }
  };

  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  const calculateDiscount = (product) => {
    try {
      if (!product) return 0;

      if (product.discount && product.discountValue) {
        if (product.discountType === "percentage") {
          return product.price - (product.price * product.discountValue) / 100;
        }
        return product.price - product.discountValue;
      }
      return product.price;
    } catch (error) {
      console.error("Failed to calculate discount:", error);
      return product?.price || 0;
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("booksCart");
        window.dispatchEvent(new Event("cartUpdated"));
      }
      toast.success("Cart cleared successfully!");
      return true;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
      return false;
    }
  };

  // NEW FUNCTION: Calculate total price of all items in cart
  const getTotalPrice = () => {
    try {
      return cart.reduce((total, item) => {
        // Use discountedPrice if available, otherwise use regular price
        const price =
          item.discountedPrice !== undefined
            ? item.discountedPrice
            : item.price;
        return total + price * (item.quantity || 1);
      }, 0);
    } catch (error) {
      console.error("Failed to calculate total price:", error);
      return 0;
    }
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
    cartCount: cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    updateCart,
    getTotalPrice,
  };
};
