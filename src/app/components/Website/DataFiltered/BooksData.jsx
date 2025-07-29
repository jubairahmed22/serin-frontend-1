"use client";
import Link from "next/link";
import React from "react";
import BooksCard from '../BooksAllCard/BooksCard';
import '../../../../styles/allBooks.css';
import BookCardSkeleton from "../../../components/Spinner/BookCardSkeleton";

const BooksData = ({ products, initialLoading }) => {
  return (
    <div className="customGridBooks px-4 gap-4">
  {initialLoading ? (
    [...Array(8)].map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full">
        <BookCardSkeleton />
      </div>
    ))
  ) : products?.length > 0 ? (
    products.map((product) => (
      <BooksCard key={product._id} product={product} />
    ))
  ) : (
    <div className="col-span-full bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
        No products found matching your filters
      </div>
    </div>
  )}
</div>
  );
};

export default BooksData;