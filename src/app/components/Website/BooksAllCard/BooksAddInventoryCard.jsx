"use client";
import Link from "next/link";
import { distance, motion } from "framer-motion";
import { toast } from "react-hot-toast"; // Optional: for showing notifications

const BooksAddInventoryCard = ({ product, onAddToInventory }) => {

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

  const handleAddInventory = () => {
    const productToAdd = {
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      singleImage: product.singleImage,
      deliveryCharge: product.deliveryCharge || 0,
      discountedPrice: discountedPrice,
      discountValue: product.discountValue,
      discountType: product.discountType, 
      numberOfPages: product.numberOfPages || null,
      weight: product.weight || null,
      categoryId: product.categoryId || null,
      subCategoryId: product.subCategoryId || null,
      childCategoryId: product.childCategoryId || null,
      publisherId: product.publisherId || null,
      authorId: product.authorId || null
    };
    
    onAddToInventory(productToAdd);
    toast.success(`${product.title} added to inventory`);
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



  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative group border flex flex-col justify-between border-gray-100 p-3"
    >
      <Link href="" prefetch={true}>
        <div className="flex flex-col gap-3  rounded-xl  bg-white  transition-all duration-300 ">
          {/* Image with overlay */}
          <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-100 ">
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
          <div className="flex flex-col gap-2 ">
            <h1 className="bangla-text font-semibold text-gray-900 ">
              {product.title}
            </h1>
             <h1 className="bangla-text  text-gray-600 ">
              {product.productId}
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
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>

            {/* Price */}
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
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
<motion.button
  onClick={handleAddInventory}
  className="relative overflow-hidden px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
  whileHover={{ 
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
  }}
  whileTap={{ 
    scale: 0.98,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }}
  initial={{ opacity: 0.9 }}
  animate={{ opacity: 1 }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 15
  }}
>
  {/* Ripple effect container */}
  <span className="absolute inset-0 overflow-hidden">
    <motion.span
      className="absolute bg-white opacity-0 rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 10, opacity: 0 }}
      transition={{ duration: 0.6 }}
      key={Math.random()} // Force re-render on each click
    />
  </span>
  
  {/* Button content with icon */}
  <div className="flex items-center justify-center gap-2">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
    <span>Add To Inventory</span>
  </div>
</motion.button>
    </motion.div>
  );
};

export default BooksAddInventoryCard;
