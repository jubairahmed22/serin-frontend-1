"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HomeSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  // Sample slides data
  const slides = [
    {
      id: 1,
      title: "Welcome to Our Platform",
      subtitle: "Discover amazing features",
      bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
      image:
        "https://www.panjeree.org/DIR/Com/ECO/banner/main_banner/HomeBanner80.webp?id=20250628",
    },
    {
      id: 2,
      title: "Premium Services",
      subtitle: "Quality you can trust",
      bgColor: "bg-gradient-to-r from-emerald-500 to-teal-600",
      
        image:
        "https://prothoma.gumlet.io/sliderImages/2025/06/685f80c8ee361_1751089352.jpeg?w=1880&dpr=2.0",
    },
    {
      id: 3,
      title: "Innovative Solutions",
      subtitle: "Cutting-edge technology",
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-600",
      image:
        "https://www.panjeree.org/DIR/Com/ECO/banner/main_banner/HomeBanner78.webp?id=20250628",
    },
  ];

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Auto-advance slides every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Variants for animation
  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 1,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 1,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.32, 0.72, 0, 1],
      },
    },
    exit: {
      x: direction === "right" ? "-100%" : "100%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.32, 0.72, 0, 1],
      },
    },
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden  ">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={slides[currentIndex].id}
          variants={slideVariants}
          initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <div className="absolute inset-0  bg-opacity-30"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2  bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
        aria-label="Previous slide"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          whileHover={{ scale: 1.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </motion.svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2  bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
        aria-label="Next slide"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          whileHover={{ scale: 1.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </motion.svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-6" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;