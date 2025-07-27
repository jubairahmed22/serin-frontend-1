import React from "react";
import FictionData from "../../../components/Website/DataFiltered/FictionData"
import NonFictionData from "../../../components/Website/DataFiltered/NonFictionData"
import NovelData from "../../../components/Website/DataFiltered/NovelData";
import FictionBookFilter from "../Filters/FictionBookFilter";
import NonFictionBookFilter from "../Filters/NonFictionBookFilter";
import NovelBookFilter from "../Filters/NovelBookFilter";
import '../../../../styles/homePage.css';

const ShopByCategory = () => {
  return (
    <div>
      <div className="bg-white  pageHeightShopPY fontPoppins ">
        <div className="max-w-[1440px] mx-auto relative px-6">
          <h1 className="shopTitle pb-16 lg:text-3xl md:text-3xl sm:text-sm lg:text-center md:text-center sm:text-left font-bold text-gray-900 whitespace-nowrap ">
            Shop By Category
          </h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
              <div className="flex flex-col justify-center items-center gap-3 border border-[#E6E6E6] rounded-xl p-5">
                  <h1 className="text-[#282828] font-bold lg:text-2xl md:text-2xl sm:text-sm">Fiction</h1>
                  <FictionData></FictionData>
                  <FictionBookFilter></FictionBookFilter>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 border border-[#E6E6E6] rounded-xl p-5">
                  <h1 className="text-[#282828] font-bold lg:text-2xl md:text-2xl sm:text-sm">Non-Fiction</h1>
                  <NonFictionData></NonFictionData>
                  <NonFictionBookFilter></NonFictionBookFilter>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 border border-[#E6E6E6] rounded-xl p-5">
                  <h1 className="text-[#282828] font-bold lg:text-2xl md:text-2xl sm:text-sm">Novel</h1>
                  <NovelData></NovelData>
                  <NovelBookFilter></NovelBookFilter>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
