import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";

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
    <div className="overflow-hidden">
      {cart.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 text-lg"
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
                  className="grid grid-cols-11 bg-[#f0fff5] gap-4 items-center border-b border-gray-100 p-4 rounded-lg shadow-sm"
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
                      <Link href={`/all-books/${item._id}`}><h3 className="font-medium text-gray-800 hover:underline duration-300 hover:text-blue-500 w-fit">{item.title}</h3></Link>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center text-red-500 cursor-pointer text-start fontPoppins text-sm hover:underline hover:text-red-700 w-fit"
                      >
                        <FiTrash2 className="mr-1" size={14} />
                        Remove
                      </motion.button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center">
                    {item.discount ? (
                      <div className="flex flex-col items-center">
                        <span className="text-red-600 font-medium">
                          ৳{finalPrice.toFixed(2)}
                        </span>
                        <del className="text-gray-500 text-xs md:text-sm">
                          ৳{item.price.toFixed(2)}
                        </del>
                      </div>
                    ) : (
                      <span className="text-gray-700">
                        ৳{item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-center border rounded-lg max-w-[140px] mx-auto overflow-hidden"
                    >
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleQuantityChange(
                            item._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
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
                          className="w-12 cursor-pointer text-center border-0 focus:ring-0 focus:outline-none bg-transparent"
                          autoFocus
                        />
                      ) : (
                        <motion.span
                          whileHover={{ backgroundColor: "#f0f0f0" }}
                          className="px-3 cursor-text flex-1 text-center py-2"
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
                        className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                      >
                        <FiPlus size={14} />
                      </motion.button>
                    </motion.div>
                  </div>

                  <div className="md:col-span-2 text-center font-medium text-gray-800">
                    ৳{itemSubtotal.toFixed(2)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default CartItemCompo;