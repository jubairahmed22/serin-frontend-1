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
    <div className="fontPoppins bangla-text flex flex-col gap-4 p-5">
      {/* <div className="in-stock w-20 py-1 rounded text-white flex justify-center items-center">
        <h1 className="font-semibold">Stock : {product.stock}</h1>
      </div> */}
      <h1 className="text-title fontGaramond font-bold">{product.title}</h1>
      <div className="flex flex-row gap-10">
        {/* <h1 className="text-author-data font-semibold">
          <span className="text-author">Author : </span>
          {product.author.name}
        </h1> */}
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
                You save BDT {(product.price - discountedPrice).toFixed(2)} (
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
<div
  className="description indent-8"
  dangerouslySetInnerHTML={{ __html: product.description }}
/>

      <hr className="des-line w-full"></hr>
      <div className="flex flex-col gap-2 ">
        <h1 className="quantity font-semibold fontPoppins">Quantity</h1>
        <div className="flex flex-row gap-5">
          <div className="flex flex-row items-center gap-1 rounded border border-gray-300 dark:border-gray-300 px-4 py-1 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-400 dark:bg-white">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className={`p-1 cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors duration-200 ${
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
              className={`p-1 cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-gray-50 focus:ring-opacity-50 transition-colors duration-200 ${
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
              className={` transition-colors duration-200 cursor-pointer addCartButtons hover:bg-[#414143]  px-6 py-3.5 rounded flex items-center justify-center gap-2 ${
                productInCart
                  ? "bg-[#414143] hover:bg-[#414143] text-white"
                  : "bg-emerald-600 hover:bg-[#414143] text-white"
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
        <h1 className="categoryText">
          <span>Category :</span> {product.parentCategory.title}
        </h1>
        <h1 className="categoryText">Tags : {product.tags.join(", ")}</h1>
      </div>
  
    </div>
  );
};

export default DataDetails;
