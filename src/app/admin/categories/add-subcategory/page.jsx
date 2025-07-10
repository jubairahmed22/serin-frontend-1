"use client";
import React, { useState } from "react";
import SubCategoryAllDataAdmin from "../../../AdminFetchDataPages/SubCategoryAllDataAdmin";
import ModalCreateSubCategory from "../../../components/ModalAdmin/ModalCreateSubCategory";

const page = () => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  return (
    <div className="p-5">
      <div className="bg-white border border-gray-200 shadow flex flex-col gap-5 p-5 rounded-2xl">
        <div className="flex justify-between ">
          <h1 className="fontPoppins font-semibold text-black text-xl">
            Add Sub Category
          </h1>
          <div>
            <button
              onClick={() => setIsZoneModalOpen(true)}
              className="bg-blue-700 flex items-center gap-2 cursor-pointer text-white py-2.5 px-5 font-medium rounded-lg hover:bg-blue-900 transition-colors"
            >
              <span className="text-xl">+</span> Create Sub Category
            </button>
          </div>
        </div>
        <div className="">
          <SubCategoryAllDataAdmin></SubCategoryAllDataAdmin>
        </div>
      </div>
      <ModalCreateSubCategory
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
      />
    </div>
  );
};

export default page;
