"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import '../../../../styles/homePage.css'

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('https://books-server-001.vercel.app/api/admin/bannerTwo');
        if (!response.ok) {
          throw new Error('Failed to fetch slides');
        }
        const data = await response.json();
        
        // Transform the API data into the format our component expects
        const formattedSlides = data.products.map(product => ({
          id: product._id,
          title: product.title, // This will be used as the link
          image: product.singleImage,
          showWebsite: product.showWebsite
        }));
        
        setSlides(formattedSlides);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, slides]);

  const slideVariants = {
    hiddenRight: { x: "100%", opacity: 1 },
    hiddenLeft: { x: "-100%", opacity: 1 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
    },
    exit: {
      x: direction === "right" ? "-100%" : "100%",
      opacity: 1,
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
    },
  };

  if (loading) {
    return (
      <div className="relative w-full sliderImgSize overflow-hidden flex items-center justify-center bg-gray-200">
        <div className="animate-pulse text-gray-500">Loading slides...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full sliderImgSize overflow-hidden flex items-center justify-center bg-red-100">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full sliderImgSize overflow-hidden flex items-center justify-center bg-gray-200">
        <div className="text-gray-500">No slides available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full sliderImgSize overflow-hidden mt-10">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={slides[currentIndex].id}
          variants={slideVariants}
          initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          <a 
            href={slides[currentIndex].title} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <motion.img
              src={slides[currentIndex].image}
              alt=""
              className="w-full h-full object-fill cursor-pointer"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </a>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Only show if there are multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#50C878] bg-opacity-40 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-60 z-20"
            aria-label="Previous slide"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ scale: 1.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#50C878] bg-opacity-40 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-60 z-20"
            aria-label="Next slide"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ scale: 1.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </button>

          {/* Dots - Only show if there are multiple slides */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-white w-6" : "bg-white bg-opacity-50 w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerSlider;