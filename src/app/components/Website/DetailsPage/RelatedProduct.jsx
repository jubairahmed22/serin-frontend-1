import React, { useEffect, useState } from "react";
import BooksCardVertical from "../../../components/Website/BooksAllCard/BooksCardVertical";
import axios from "axios";
import './../../../../styles/productDetails.css'

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
          `https://books-server-001.vercel.app/api/web/all-child-category-product/${dataId}`,
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

  if (loading && currentPage === 1)
    return <div>Loading related products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!relatedProducts.length) return <div>No related products found</div>;

  return (
    <div className="bg-[#F5F5F5] py-10 fontPoppins">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="RelatedProduct font-semibold">Related Products</h3>
          <button
            className="button-view-all-product px-6 py-3 cursor-pointer rounded-full text-white"
            onClick={() =>
              handleChildCategoryClick(
                product.parentChildCategory,
                product.parentCategory.id
              )
            }
          >
            View All
          </button>
        </div>

        <div className="relative">
          <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide">
            {relatedProducts.map((product, index) => (
              <div className="flex-shrink-0 w-[400px] bg-white" key={index}>
                <BooksCardVertical product={product}></BooksCardVertical>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProduct;
