"use client";
import React, { useState } from "react";
import CategoryAllDataAdmin from "../../../AdminFetchDataPages/CategoryAllDataAdmin";
import ModalCreateMainCategory from "../../../components/ModalAdmin/ModalCreateMainCategory";

const page = () => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  return (
    <div className="p-5">
      <div className="bg-white border border-gray-200 shadow flex flex-col gap-5 p-5 rounded-2xl">
        <div className="flex justify-between ">
          <h1 className="fontPoppins font-semibold text-black text-xl">
            Add Category
          </h1>
          <div>
            <button
              onClick={() => setIsZoneModalOpen(true)}
              className="bg-blue-700 flex items-center gap-2 cursor-pointer text-white py-2.5 px-5 font-medium rounded-lg hover:bg-blue-900 transition-colors"
            >
             <span className="text-xl">+</span> Create Category
            </button>
          </div>
        </div>
        <div className="">
          <CategoryAllDataAdmin></CategoryAllDataAdmin>
        </div>
      </div>
      <ModalCreateMainCategory
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
      />
    </div>
  );
};

export default page;
