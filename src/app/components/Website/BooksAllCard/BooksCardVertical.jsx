"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; // Optional: for showing notifications
import '../../../../styles/homePage.css';

import { useCart } from "../../../hooks/useCart";

const BooksCardVertical = ({ product }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const productInCart = isInCart(product._id);

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

  const handleCartAction = () => {
    if (productInCart) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  };

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

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative group border flex flex-col justify-between border-gray-100 p-3"
    >
      <Link href={`/products/${product._id}`} prefetch={true}>
        <div className="flex flex-row items-center gap-3  rounded-xl  bg-white  transition-all duration-300 ">
          {/* Image with overlay */}
          <div className="relative w-[45%] overflow-hidden rounded-lg aspect-[3/4] bg-gray-100 ">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={product.singleImage}
              alt={product.title}
            />

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              <motion.span
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
                className="text-white font-medium text-sm bg-black/70 px-3 py-1.5 rounded-full"
              >
                View Details
              </motion.span>
            </motion.div>

            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {product.discountType === "percentage"
                  ? `${product.discountValue}% OFF`
                  : "SALE"}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 ">
              <h1 className="bangla-text font-semibold text-gray-900 truncate">
          {product?.title.split(" ").slice(0, 2).join(" ")}
          {product?.title.split(" ").length > 2 && "..."}
        </h1>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">{renderStars()}</div>
                <span className="text-xs text-gray-500 ml-1">
                  ({rating.toFixed(1)})
                </span>
              </div>

              {/* Stock */}
              <div className="text-xs text-gray-600">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </div>

              {/* Price */}
              <div className="mt-1">
                {hasDiscount ? (
                  <div className="flex flex-col">
                    <div className="flex flex-col items-start">
                      <span className="text-lg PriceTextSizeMain font-bold text-gray-900">
                        BDT {discountedPrice.toFixed(2)}
                      </span>
                      <del className="text-sm PriceTextSize text-gray-500">
                        BDT {product.price.toFixed(2)}
                      </del>
                    </div>
                    {product.discountType === "percentage" && (
                      <span className="text-xs text-red-600 mt-2 PriceTextSize">
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
            </div>
            <motion.button
              onClick={handleCartAction}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-36 cursor-pointer cartButton mt-3 py-2 px-2 rounded-lg text-[10px] font-semibold transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 ${
                productInCart
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-[#414143] hover:bg-pink-700 text-white"
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
      </Link>
    </motion.div>
  );
};

export default BooksCardVertical;
