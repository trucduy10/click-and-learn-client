import React from "react";

const CategoryTagMod = ({ className = "", icon = "", children }) => {
  return (
    <div
      className={`flex items-center gap-x-2 tw-transition-all text-xs font-medium text-gray-400 mb-[1rem] ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
};

export default CategoryTagMod;
