import React, { useEffect, useState } from "react";
import BooksCard from "../../../components/Website/BooksAllCard/BooksCard";
import axios from "axios";
import './../../../../styles/productDetails.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import BookCardSkeleton from "../../../components/Spinner/BookCardSkeleton";

const RelatedProduct = ({ product, handleChildCategoryClick }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const dataId = product?.parentChildCategory?.objectId;

  useEffect(() => {
    const fetchRelatedProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://cosmetics-server-001.vercel.app/api/web/all-child-category-product/${dataId}`,
          {
            params: {
              page: currentPage,
              limit: 10, // You can adjust this if needed
            },
          }
        );

        if (response.data.success) {
          // If it's the first page, replace the products, otherwise append
          if (currentPage === 1) {
            setRelatedProducts(response.data.products);
          } else {
            setRelatedProducts((prevProducts) => [
              ...prevProducts,
              ...response.data.products,
            ]);
          }
          setTotalPages(response.data.pagination.totalPages);
          setTotalProducts(response.data.pagination.totalProducts);
          setError(null);
        } else {
          setError(response.data.message || "No related products found");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch related products"
        );
      } finally {
        setLoading(false);
      }
    };

    if (dataId) {
      fetchRelatedProductData();
    } else {
      setLoading(false);
      setError("No category ID found");
    }
  }, [dataId, currentPage]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="bg-white py-16 fontPoppins">
        <div className="max-w-[1440px] mx-auto relative px-6">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="fontGaramond text-3xl font-bold text-[#414143] mb-8">
              Related Products
            </h2>
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
    );
  }

  if (error) return <div className="text-center py-16 text-red-500">Error: {error}</div>;
  if (!relatedProducts.length) return <div className="text-center py-16">No related products found</div>;

  return (
    <div className="w-full">
      <div className="bg-pink-50 py-16 fontPoppins forWeb">
      <div className="max-w-[1440px] mx-auto relative px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-row items-center justify-between mb-8">
            <h2 className="fontGaramond lg:text-3xl md:text-3xl sm:text-sm font-bold text-[#414143]">
            Related Products
          </h2>
          <button
                className="fontPoppins h-10 text-black seeMoreButton cursor-pointer bg-white border border-black px-6 py-2 rounded 
             shadow-md hover:bg-[#F01F7B] hover:text-white hover:shadow-lg 
             transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
      
            onClick={() =>
              handleChildCategoryClick(
                product.parentChildCategory,
                product.parentCategory.id
              )
            }
          >
            View All Products
          </button>
          </div>
          
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: `.next-related`,
                prevEl: `.prev-related`,
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={relatedProducts.length > 5}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {relatedProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <BooksCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            {relatedProducts.length > 5 && (
              <>
                <div className="prev-related absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#414143] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <div className="next-related absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#414143] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </>
            )}
          </div>

          {currentPage < totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-[#414143] text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="bg-pink-50 py-8  rounded-t-3xl fontPoppins forMobile">
      <div className="max-w-[1440px] mx-auto relative px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className="fontGaramond lg:text-3xl md:text-3xl sm:text-sm font-bold text-[#414143]">
            Related Products
          </h2>
          <button
                className="fontPoppins h-6 text-black seeMoreButton cursor-pointer bg-white border border-black px-6 py-2 rounded 
             shadow-md hover:bg-[#F01F7B] hover:text-white hover:shadow-lg 
             transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
      
            onClick={() =>
              handleChildCategoryClick(
                product.parentChildCategory,
                product.parentCategory.id
              )
            }
          >
            View All Products
          </button>
          </div>
          
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: `.next-related`,
                prevEl: `.prev-related`,
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={relatedProducts.length > 5}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {relatedProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <BooksCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            {relatedProducts.length > 5 && (
              <>
                <div className="prev-related absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#414143] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <div className="next-related absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-[#414143] hover:bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              </>
            )}
          </div>

          {currentPage < totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-[#414143] text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default RelatedProduct;