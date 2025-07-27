"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Website/DetailsPage/Breadcrumbs";
import ImageManagement from "../../components/Website/DetailsPage/ImageManagement";
import DataDetails from "../../components/Website/DetailsPage/DataDetails";
import Specification from "../../components/Website/DetailsPage/Specification";
import RelatedProduct from "../../components/Website/DetailsPage/RelatedProduct";
import "../../../styles/productDetails.css";
import Link from "next/link";

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://books-server-001.vercel.app/api/web/all-products/${id}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubCategoryClick = (subCategory, parentCategoryId) => {
    if (!subCategory?.objectId || !parentCategoryId) {
      console.error("Invalid parameters", { subCategory, parentCategoryId });
      return;
    }

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("subCategory", subCategory.objectId);
    params.set("category", parentCategoryId); // Using the parent category's id
    router.push(`/all-books?${params.toString()}`);
  };

  const handleChildCategoryClick = (childCategory, parentCategoryId) => {
    if (!childCategory?.objectId || !parentCategoryId) {
      console.error("Invalid parameters", { childCategory, parentCategoryId });
      return;
    }

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("childCategory", childCategory.objectId);
    params.set("category", parentCategoryId); // Using the parent category's id
    router.push(`/all-books?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full  flex flex-col gap-10 px-4">
      <div className="max-w-[1400px] mx-auto fontPoppins">
        <Breadcrumbs
          product={product}
          handleSubCategoryClick={handleSubCategoryClick}
          handleChildCategoryClick={handleChildCategoryClick}
        />
        <div className="flex flex-row layoutFlexOne gap-5">
          <div className="lg:w-[60%] md:w-full sm:w-full rounded-xl  my-2">
            <ImageManagement product={product}></ImageManagement>
          </div>
          <div className="lg:w-[60%] md:w-full sm:w-full rounded-xl border border-[#E6E6E6] my-7 p-5">
            <DataDetails product={product}></DataDetails>
          </div>
        </div>
        <Specification product={product}></Specification>
      </div>
      <RelatedProduct
      handleSubCategoryClick={handleSubCategoryClick}
      handleChildCategoryClick={handleChildCategoryClick}
      product={product}></RelatedProduct>
    </div>
  );
};

export default ProductDetails;
