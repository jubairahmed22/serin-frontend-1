"use client"
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const page = () => {
    return (
        <div className='min-h-screen  max-w-[1400px] mx-auto py-10 px-4'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-3xl"
            >
                <div className="p-8">
                    <div className="flex flex-col items-center">
                        {/* Animated Checkmark */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="mb-6"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg 
                                        className="w-16 h-16 text-pink-500" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M5 13l4 4L19 7" 
                                        />
                                    </svg>
                                </div>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.5, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 border-4 border-pink-200 rounded-full"
                                />
                            </div>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl font-bold text-gray-800 mb-2 text-center"
                        >
                            Order Confirmed!
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-600 mb-8 text-center"
                        >
                            Thank you for your purchase! Your order has been received and is being processed.
                        </motion.p>
                        
                       
            
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto"
                        >
                            <Link 
                                href="/products"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#F01F7B] hover:bg-pink-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                            >
                                Browse More Products
                                <svg 
                                    className="ml-2 w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7" 
                                    />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default page;