"use client";
import React, { useState, useEffect } from "react";
import "../../../../styles/homePage.css";
import PublisherCard from "../BooksAllCard/PublisherCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../../../../styles/productDetails.css";
import Link from "next/link";
import AuthorCardSkeleton from "../../../components/Spinner/AuthorCardSkeleton";

const FeaturedPublishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://books-server-001.vercel.app/api/web/all-publisher");
        if (!response.ok) {
          throw new Error("Failed to fetch publishers");
        }
        const data = await response.json();
        setPublishers(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishers();
  }, []);

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        Error: {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 fontPoppins pageHeightPY">
      <div className="max-w-[1440px] mx-auto relative px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center w-full mb-8">
            <h1 className="lg:text-3xl md:text-3xl sm:text-sm font-bold text-gray-900 whitespace-nowrap mr-4">
              Featured Publishers
            </h1>

            <div className="flex-grow h-px bg-gray-200 mx-8"></div>

            <Link href="/all-publishers">
              <button className="px-6 py-3 buttonPopular hover:bg-green-600 cursor-pointer text-white font-medium rounded-full whitespace-nowrap transition-colors duration-300 shadow hover:shadow-md">
                View All
              </button>
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={6}
            navigation={{
              nextEl: ".publisher-books-next",
              prevEl: ".publisher-books-prev",
            }}
            autoplay={!loading ? {
              delay: 3000,
              disableOnInteraction: false,
            } : false}
            loop={!loading}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
            }}
          >
            {loading ? (
              [...Array(6)].map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <AuthorCardSkeleton />
                </SwiperSlide>
              ))
            ) : (
              publishers.map((publisher) => (
                <SwiperSlide key={publisher._id}>
                  <PublisherCard product={publisher} />
                </SwiperSlide>
              ))
            )}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="publisher-books-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#50C878] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <div className="publisher-books-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#50C878] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPublishers;