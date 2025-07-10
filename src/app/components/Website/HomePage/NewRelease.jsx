"use client"
import React, { useState, useEffect } from "react";
import "../../../../styles/homePage.css";
import NewReleasedFilter from "../../../components/Website/Filters/NewReleasedFilter";
import BooksCard from "../BooksAllCard/BooksCard"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const NewRelease = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await fetch('https://books-server-001.vercel.app/api/web/new-released');
        if (!response.ok) {
          throw new Error('Failed to fetch popular books');
        }
        const data = await response.json();
        setPopularBooks(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error) return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white py-16 fontPoppins ">
      <div className="max-w-[1440px] mx-auto relative px-6">
        <div className="max-w-[1400px] mx-auto ">
        <div className="flex items-center w-full mb-8">
          <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap mr-4">
            New Release
          </h1>

          <div className="flex-grow h-px bg-gray-200 mx-8"></div>

          <NewReleasedFilter />
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={5}
          navigation={{
            nextEl: '.new-books-next',
            prevEl: '.new-books-prev',
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20
            }
          }}
        >
          {popularBooks.map((product) => (
            <SwiperSlide>
               <BooksCard product={product}></BooksCard>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="new-books-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#50C878] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="new-books-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#50C878] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NewRelease;