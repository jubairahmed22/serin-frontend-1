import Link from "next/link";
import React from "react";
import BooksCard from '../BooksAllCard/BooksCard'
const BooksData = ({ products, initialLoading }) => {
  if (initialLoading)
    return <div className="w-full mx-auto">Loading products...</div>;

  return (
    <div className="grid grid-cols-4 ">
      {products?.length > 0 ? (
        products.map((product) => (
          <BooksCard product={product} ></BooksCard>
          ))
      ) : (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td
            colSpan="9"
            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            No products found matching your filters
          </td>
        </tr>
      )}
    </div>
  );
};

export default BooksData;
