"use client";
import React, { useState } from "react";
import BannerAllDataAdmin from "../../../AdminFetchDataPages/BannerAllDataAdmin";
import ModalCreateBannerOne from "../../../components/ModalAdmin/ModalCreateBannerOne";

const page = () => {
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  return (
    <div className="p-5">
      <div className="bg-white border border-gray-200 shadow flex flex-col gap-5 p-5 rounded-2xl">
        <div className="flex justify-between ">
          <h1 className="fontPoppins font-semibold text-black text-xl">
            Add Banner One
          </h1>
          <div>
            <button
              onClick={() => setIsBannerModalOpen(true)}
              className="bg-blue-700 flex items-center gap-2 cursor-pointer text-white py-2.5 px-5 font-medium rounded-lg hover:bg-blue-900 transition-colors"
            >
             <span className="text-xl">+</span> Create Banner
            </button>
          </div>
        </div>
        <div className="">
          <BannerAllDataAdmin></BannerAllDataAdmin>
        </div>
      </div>
      <ModalCreateBannerOne
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
      />
    </div>
  );
};

export default page;
