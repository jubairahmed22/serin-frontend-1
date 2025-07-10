import React from "react";
import FictionData from "../../../components/Website/DataFiltered/FictionData"
import NonFictionData from "../../../components/Website/DataFiltered/NonFictionData"
import NovelData from "../../../components/Website/DataFiltered/NovelData"

const ShopByCategory = () => {
  return (
    <div>
      <div className="bg-white py-16 fontPoppins ">
        <div className="max-w-[1440px] mx-auto relative px-6">
          <h1 className="text-3xl text-center font-bold text-gray-900 whitespace-nowrap mr-4">
            Shop By Category
          </h1>
          <div className="grid grid-cols-3 gap-5 mt-16">
              <div className="flex flex-col justify-center items-center gap-3 border border-[#E6E6E6] rounded-xl p-5">
                  <h1 className="text-[#282828] font-bold text-2xl">Fiction</h1>
                  <FictionData></FictionData>
                  <button className="w-full border border-[#E6E6E6] rounded py-2 text-[14px] font-semibold">View All</button>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 border border-[#E6E6E6] rounded-xl p-5">
                  <h1 className="text-[#282828] font-bold text-2xl">Non-Fiction</h1>
                  <NonFictionData></NonFictionData>
                  <button className="w-full border border-[#E6E6E6] rounded py-2 text-[14px] font-semibold">View All</button>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 border border-[#E6E6E6] rounded-xl p-5">
                  <h1 className="text-[#282828] font-bold text-2xl">Novel</h1>
                  <NovelData></NovelData>
                  <button className="w-full border border-[#E6E6E6] rounded py-2 text-[14px] font-semibold">View All</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
