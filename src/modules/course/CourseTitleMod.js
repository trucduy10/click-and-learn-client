import React from "react";

const CourseTitleMod = ({ className = "mb-[0.25rem]", children }) => {
  return (
    <h3 className={`font-semibold text-black text-lg ${className}`}>
      {children}
    </h3>
  );
};

export default CourseTitleMod;
