"use client";

import Link from "next/link";
import '../../../../styles/productDetails.css'

const Breadcrumbs = ({
  product,
  handleSubCategoryClick,
  handleChildCategoryClick,
  handleCategoryClick
}) => {
  return (
    <div className="flex flex-row items-center gap-2 text-sm textBread mt-6">
      <Link href="/" className="text-blue-600 hover:underline">
        Home
      </Link>

      {product.parentCategory?.id && (
        <>
          <span className="text-gray-400">→</span>
          <button
            onClick={() =>
              handleCategoryClick(
                product.parentCategory,
                // product.parentCategory.id
              )
            }
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {product.parentCategory.title}
          </button>
        </>
      )}
      {product.parentSubCategory?.objectId && product.parentCategory?.id && (
        <>
          <span className="text-gray-400">→</span>
          <button
            onClick={() =>
              handleSubCategoryClick(
                product.parentSubCategory,
                product.parentCategory.id
              )
            }
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {product.parentSubCategory.title}
          </button>
        </>
      )}

      {product.parentChildCategory?.objectId && product.parentCategory?.id && (
        <>
          <span className="text-gray-400">→</span>
          <button
            onClick={() =>
              handleChildCategoryClick(
                product.parentChildCategory,
                product.parentCategory.id
              )
            }
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {product.parentChildCategory.title}
          </button>
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;
