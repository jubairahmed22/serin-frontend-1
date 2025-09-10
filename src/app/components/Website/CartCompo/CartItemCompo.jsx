import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";
import '../../../../styles/cart.css'

const CartItemCompo = ({
  cart,
  editingQuantity,
  handleQuantityChange,
  handleInputChange,
  handleInputBlur,
  setEditingQuantity,
  removeFromCart,
}) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const cartContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
    <div className="overflow-hidden itePositionWeb">
  {cart.length === 0 ? (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 text-gray-500 text-lg dark:text-gray-700"
    >
      Your cart is empty
    </motion.p>
  ) : (
    <motion.div
      variants={cartContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      <AnimatePresence>
        {cart.map((item) => {
          const finalPrice = Math.max(
            item.discountType === "percentage"
              ? item.price * (1 - item.discountValue / 100)
              : item.discountType === "fixed"
              ? item.price - item.discountValue
              : item.price,
            0
          );
          const itemSubtotal = finalPrice * item.quantity;

          return (
            <motion.div
              key={item._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="grid grid-cols-11 bg-[#F01F7B]/10 gap-4 items-center border-b border-gray-100 p-4 rounded-lg shadow-sm dark:bg-white dark:border-gray-200"
            >
              <div className="md:col-span-5 flex items-center space-x-4">
                {item.singleImage && (
                  <motion.img
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={item.singleImage}
                    className="w-16 h-20 md:w-20 md:h-28 object-cover rounded-lg"
                    alt={item.title}
                  />
                )}
                <div className="flex flex-col gap-1">
                  <Link href={`/all-books/${item._id}`}>
                    <h3 className="font-medium text-gray-800 hover:underline duration-300 hover:text-blue-500 w-fit dark:text-gray-900">
                      {item.title}
                    </h3>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => removeFromCart(item._id)}
                    className="flex items-center text-red-500 cursor-pointer text-start fontPoppins text-sm hover:underline hover:text-red-700 w-fit dark:text-red-600 dark:hover:text-red-800"
                  >
                    <FiTrash2 className="mr-1" size={14} />
                    Remove
                  </motion.button>
                </div>
              </div>

              <div className="md:col-span-2 text-center">
                {item.discount ? (
                  <div className="flex flex-col items-center">
                    <span className="text-red-600 font-medium dark:text-red-700">
                      ৳{finalPrice.toFixed(2)}
                    </span>
                    <del className="text-gray-500 text-xs md:text-sm dark:text-gray-600">
                      ৳{item.price.toFixed(2)}
                    </del>
                  </div>
                ) : (
                  <span className="text-gray-700 dark:text-gray-800">
                    ৳{item.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center border rounded-lg max-w-[140px] mx-auto overflow-hidden dark:border-gray-300"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-center dark:hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus size={14} className="dark:text-gray-900" />
                  </motion.button>

                  {editingQuantity === item._id ? (
                    <motion.input
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleInputChange(item._id, e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputBlur(item._id, e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleInputBlur(item._id, e.target.value)
                      }
                      className="w-12 cursor-pointer text-center border-0 focus:ring-0 focus:outline-none bg-transparent dark:text-gray-900"
                      autoFocus
                    />
                  ) : (
                    <motion.span
                      whileHover={{ backgroundColor: "#f0f0f0" }}
                      className="px-3 cursor-text flex-1 text-center py-2 dark:text-gray-900"
                      onClick={() => setEditingQuantity(item._id)}
                    >
                      {item.quantity}
                    </motion.span>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-center dark:hover:bg-gray-100"
                  >
                    <FiPlus size={14} className="dark:text-gray-900" />
                  </motion.button>
                </motion.div>
              </div>

              <div className="md:col-span-2 text-center font-medium text-gray-800 dark:text-gray-900">
                ৳{itemSubtotal.toFixed(2)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  )}
</div>
    <div className="overflow-hidden itePositionMobile">
  {cart.length === 0 ? (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 text-gray-500 text-lg dark:text-gray-700"
    >
      Your cart is empty
    </motion.p>
  ) : (
    <motion.div
      variants={cartContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3 md:space-y-4"
    >
      {/* Column Headers (Visible on desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 dark:bg-white dark:text-gray-800 dark:border dark:border-gray-200">
        <div className="col-span-5">Product</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-center">Subtotal</div>
      </div>

      <AnimatePresence>
        {cart.map((item) => {
          const finalPrice = Math.max(
            item.discountType === "percentage"
              ? item.price * (1 - item.discountValue / 100)
              : item.discountType === "fixed"
              ? item.price - item.discountValue
              : item.price,
            0
          );
          const itemSubtotal = finalPrice * item.quantity;

          return (
            <motion.div
              key={item._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="grid grid-cols-1 md:grid-cols-12 bg-[#F01F7B]/10 gap-3 md:gap-4 items-center border border-gray-100 p-3 md:p-4 rounded-lg shadow-sm dark:bg-white dark:border-gray-200"
            >
              {/* Product Info (Mobile: Full width, Desktop: 5 columns) */}
              <div className="md:col-span-5 flex items-start space-x-3">
                {item.singleImage && (
                  <motion.img
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={item.singleImage}
                    className="w-16 h-20 md:w-20 md:h-28 object-cover rounded-lg flex-shrink-0"
                    alt={item.title}
                  />
                )}
                <div className="flex flex-col gap-1 flex-grow">
                  <Link href={`/all-books/${item._id}`}>
                    <h3 className="font-medium text-gray-800 hover:underline duration-300 hover:text-blue-500 line-clamp-2 dark:text-gray-900 dark:hover:text-blue-600">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="md:hidden flex items-center justify-between mt-1">
                    <div>
                      {item.discount ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600 font-medium dark:text-red-700">
                            ৳{finalPrice.toFixed(2)}
                          </span>
                          <del className="text-gray-500 text-xs dark:text-gray-600">
                            ৳{item.price.toFixed(2)}
                          </del>
                        </div>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-800">
                          ৳{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium dark:text-gray-900">
                      ৳{itemSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => removeFromCart(item._id)}
                    className="flex items-center text-red-500 cursor-pointer text-start fontPoppins text-sm hover:underline hover:text-red-700 w-fit mt-1 dark:text-red-600 dark:hover:text-red-800"
                  >
                    <FiTrash2 className="mr-1" size={14} />
                    <span className="md:hidden">Remove</span>
                  </motion.button>
                </div>
              </div>

              {/* Price (Hidden on mobile, shown on desktop) */}
              <div className="hidden md:flex md:col-span-2 flex-col items-center">
                {item.discount ? (
                  <>
                    <span className="text-red-600 font-medium dark:text-red-700">
                      ৳{finalPrice.toFixed(2)}
                    </span>
                    <del className="text-gray-500 text-xs md:text-sm dark:text-gray-600">
                      ৳{item.price.toFixed(2)}
                    </del>
                  </>
                ) : (
                  <span className="text-gray-700 dark:text-gray-800">
                    ৳{item.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Quantity (Mobile: Full width, Desktop: 3 columns) */}
              <div className="md:col-span-3 w-[40%]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between md:justify-center border rounded-lg max-w-full md:max-w-[140px] mx-auto overflow-hidden dark:border-gray-300"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-center dark:hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus size={14} className="dark:text-gray-900" />
                  </motion.button>

                  {editingQuantity === item._id ? (
                    <motion.input
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleInputChange(item._id, e.target.value)
                      }
                      onBlur={(e) =>
                        handleInputBlur(item._id, e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleInputBlur(item._id, e.target.value)
                      }
                      className="w-12 cursor-pointer text-center border-0 focus:ring-0 focus:outline-none bg-transparent dark:text-gray-900"
                      autoFocus
                    />
                  ) : (
                    <motion.span
                      whileHover={{ backgroundColor: "#f0f0f0" }}
                      className="px-3 cursor-text flex-1 text-center py-2 dark:text-gray-900"
                      onClick={() => setEditingQuantity(item._id)}
                    >
                      {item.quantity}
                    </motion.span>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-center dark:hover:bg-gray-100"
                  >
                    <FiPlus size={14} className="dark:text-gray-900" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Subtotal (Hidden on mobile, shown on desktop) */}
              <div className="hidden md:flex md:col-span-2 justify-center font-medium text-gray-800 dark:text-gray-900">
                ৳{itemSubtotal.toFixed(2)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  )}
</div>
    </div>
  );
};

export default CartItemCompo;