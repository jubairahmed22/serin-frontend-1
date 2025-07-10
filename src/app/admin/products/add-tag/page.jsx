"use client";
import React, { useState } from "react";
import TagListAllDataAdmin from "../../../AdminFetchDataPages/TagListAllDataAdmin";
import AddTagForm from "../../../Form/AddTagForm";

const page = () => {
  return (
    <div className="p-5">
      <div className="bg-white border border-gray-200 shadow flex flex-col gap-5 p-5 rounded-2xl">
        <div className="flex justify-between ">
          <h1 className="fontPoppins font-semibold text-black text-xl">
            Add Tag
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <AddTagForm></AddTagForm>
          <TagListAllDataAdmin></TagListAllDataAdmin>
        </div>
      </div>
         
    </div>
  );
};

export default page;
