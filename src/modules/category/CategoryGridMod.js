import React from "react";

const CategoryGridMod = ({ children }) => {
  return <div className="categories-grid grid grid-cols-4 gap-x-7 gap-y-16">{children}</div>;
};

export default CategoryGridMod;
