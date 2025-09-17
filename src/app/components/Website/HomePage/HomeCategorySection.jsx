"use client";
import React, { useEffect, useState } from "react";
import "../../../../styles/homePage.css";
import BooksCard from "../BooksAllCard/BooksCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HomeCategoryFilter from "../Filters/HomeCategoryFilter";
import BookCardSkeleton from "../../../components/Spinner/BookCardSkeleton";

const HomeCategorySection = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("https://cosmetics-server-001.vercel.app/api/admin/sub-categories-with-products");
        if (!res.ok) throw new Error("Failed to load data");
        const json = await res.json();
        setCategoryData(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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

  if (loading) {
    return (
      <div className="w-full">
        {[...Array(3)].map((_, index) => (
          <div key={`skeleton-category-${index}`} className="bg-white py-4 fontPoppins">
            <div className="max-w-[1440px] mx-auto relative px-6">
              <div className="max-w-[1400px] mx-auto">
               
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={20}
                  slidesPerView={5}
                  breakpoints={{
                    320: { slidesPerView: 2, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 20 },
                    1280: { slidesPerView: 5, spaceBetween: 20 },
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <SwiperSlide key={`skeleton-slide-${i}`}>
                      <BookCardSkeleton />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {categoryData.map((category, index) => {
        if (!category.products || category.products.length === 0) return null;

        const autoplayDelay = 2500 + index * 1500; // Each category has increasing delay

        return (
          <div
            key={category._id}
            className="bg-white   fontPoppins"
          >
            <div className="max-w-[1440px] mx-auto relative px-6">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-row justify-between items-center w-full ">
                  <h1 className="fontGaramond lg:text-3xl md:text-3xl sm:text-sm font-bold text-[#414143] whitespace-nowrap mr-4">
                    {category.title} 
                  </h1>

                  <div className="flex-grow h-0.5 bg-[#414143]/20 lg:mx-8 sm:mx-4"></div>
                  <HomeCategoryFilter
                    categoryId={category.parentCategory?.id}
                    subCategoryId={category._id}
                  />
                </div>

                <div className="relative titlePY">
                  <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation={{
                      nextEl: `.next-${category._id}`,
                      prevEl: `.prev-${category._id}`,
                    }}
                    autoplay={{
                      delay: autoplayDelay,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    loop={category.products.length > 5}
                    spaceBetween={20}
                    breakpoints={{
                      320: { slidesPerView: 2, spaceBetween: 10 },
                      640: { slidesPerView: 2, spaceBetween: 15 },
                      768: { slidesPerView: 3, spaceBetween: 20 },
                      1024: { slidesPerView: 4, spaceBetween: 20 },
                      1280: { slidesPerView: 5, spaceBetween: 20 },
                    }}
                  >
                    {category.products.map((product) => (
                      <SwiperSlide key={product._id}>
                        <BooksCard product={product} />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Navigation Buttons */}
                  {category.products.length > 5 && (
                    <>
                      <div className={`prev-${category._id} absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#414143] hover:bg-pink-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg`}>
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </div>
                      <div className={`next-${category._id} absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#414143] hover:bg-pink-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg`}>
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeCategorySection;
