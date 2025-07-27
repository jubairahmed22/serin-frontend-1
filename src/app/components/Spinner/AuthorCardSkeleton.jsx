import React from "react";

const AuthorCardSkeleton = () => {
  return (
    <div className="mb-10 flex justify-center items-center flex-col">
      <div className="w-[150px] h-[150px] rounded-2xl bg-gray-200 animate-pulse"></div>
      <div className="w-24 h-4 bg-gray-200 rounded mt-3 animate-pulse"></div>
    </div>
  );
};

export default AuthorCardSkeleton;
