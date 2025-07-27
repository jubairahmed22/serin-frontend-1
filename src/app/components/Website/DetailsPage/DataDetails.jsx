import React, { useEffect, useState } from "react";
import "../../../../styles/productDetails.css";
import { motion } from "framer-motion";
import { useCart } from "../../../hooks/useCart";

const DataDetails = ({ product }) => {
  const { addToCart, removeFromCart, isInCart, updateCart, cart } = useCart();
  const productInCart = isInCart(product._id);
  const cartItem = cart.find((item) => item._id === product._id);
  const [quantity, setQuantity] = useState(1);

  // Calculate discounted price
  const calculateDiscount = () => {
    if (product.discount && product.discountValue) {
      if (product.discountType === "percentage") {
        return product.price - (product.price * product.discountValue) / 100;
      }
      return product.price - product.discountValue;
    }
    return product.price;
  };

  const discountedPrice = calculateDiscount();
  const hasDiscount = product.discount && product.discountValue;
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add to cart function

  // Render star rating (unchanged)
  const renderStars = () => {
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <svg
            className="absolute w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className="absolute w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  // Sync quantity with cart item when it changes
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  const handleCartAction = () => {
    if (productInCart) {
      removeFromCart(product._id);
    } else {
      addToCart({ ...product, quantity });
    }
  };

  const updateQuantity = (newQuantity) => {
    // Validate quantity
    newQuantity = Math.max(1, Math.min(newQuantity, product.stock));
    setQuantity(newQuantity);

    // If product is in cart, update cart immediately
    if (productInCart) {
      const updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: newQuantity } : item
      );
      updateCart(updatedCart);
    }
  };

  const handleIncrement = () => updateQuantity(quantity + 1);
  const handleDecrement = () => updateQuantity(quantity - 1);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    updateQuantity(value);
  };

  return (
    <div className="fontPoppins bangla-text flex flex-col gap-4 ">
      <div className="in-stock w-20 py-1 rounded text-white flex justify-center items-center">
        <h1 className="font-semibold">Stock : {product.stock}</h1>
      </div>
      <h1 className="text-title font-bold">{product.title}</h1>
      <div className="flex flex-row gap-10">
        <h1 className="text-author-data font-semibold">
          <span className="text-author">Author : </span>
          {product.author.name}
        </h1>
        <div className="flex items-center gap-1">
          <div className="flex">{renderStars()}</div>
          <span className="text-ratting ml-1 font-semibold">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
      <hr className="des-line w-full"></hr>
      <div className="mt-1">
              {hasDiscount ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      BDT {discountedPrice.toFixed(2)}
                    </span>
                    <del className="text-sm text-gray-500">
                      BDT {product.price.toFixed(2)}
                    </del>
                  </div>
                  {product.discountType === "percentage" && (
                    <span className="text-xs text-red-600">
                      You save BDT{" "}
                      {(product.price - discountedPrice).toFixed(2)} (
                      {product.discountValue}%)
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  BDT {product.price.toFixed(2)}
                </span>
              )}
            </div>
      <h1 className="description indent-8">{product.description} ...</h1>
      <hr className="des-line w-full"></hr>
      <div className="flex flex-col gap-2 ">
        <h1 className="quantity font-semibold fontPoppins">Quantity</h1>
        <div className="flex flex-row gap-5">
       <div className="flex flex-row items-center gap-1 rounded-full border border-gray-300 dark:border-gray-300 px-4 py-1 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-400 dark:bg-white">
  <button
    onClick={handleDecrement}
    disabled={quantity <= 1}
    aria-label="Decrease quantity"
    className={`p-1 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors duration-200 ${
      quantity <= 1
        ? "opacity-50 cursor-not-allowed text-gray-400"
        : "hover:bg-gray-100 dark:hover:bg-gray-100 text-gray-700 dark:text-gray-900"
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 12H4"
      />
    </svg>
  </button>

  <input
    type="number"
    value={quantity}
    min="1"
    max={product.stock}
    onChange={handleInputChange}
    aria-label="Quantity"
    className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:text-gray-900"
  />

  <button
    onClick={handleIncrement}
    disabled={quantity >= product.stock}
    aria-label="Increase quantity"
    className={`p-1 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 transition-colors duration-200 ${
      quantity >= product.stock
        ? "opacity-50 cursor-not-allowed text-gray-400"
        : "hover:bg-gray-100 dark:hover:bg-gray-100 text-gray-700 dark:text-gray-900"
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  </button>
</div>

        <div>
          <motion.button
            onClick={handleCartAction}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={` transition-colors duration-200 cursor-pointer addCartButtons px-6 py-3.5 rounded-full flex items-center justify-center gap-2 ${
              productInCart
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {productInCart ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              )}
            </svg>
            {productInCart ? "Remove from Cart" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
      </div>
      <hr className="des-line w-full mt-1"></hr>
      <div className="fontPoppins">
         <h1 className="categoryText"><span>Category :</span> {product.parentCategory.title}</h1>
         <h1 className="categoryText">Tags : {product.tags.join(', ')}</h1>
      </div>
      <div class="social-icons mt-4">
  
  <a href="#" aria-label="Facebook">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C878">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  </a>

  
  <a href="#" aria-label="Instagram">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C878">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  </a>

  
  <a href="#" aria-label="LinkedIn">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C878">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  </a>

  
  <a href="#" aria-label="YouTube">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C878">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  </a>

  
  <a href="#" aria-label="Twitter">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C878">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  </a>
</div>
    </div>
  );
};

export default DataDetails;
