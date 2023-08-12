import React from "react";

const HeadingFormH5Com = ({ className = "", icon = "", children }) => {
  return (
    <h5 className={`flex items-center font-[600] ${className}`}>
      {icon}
      {children}
    </h5>
  );
};

export default HeadingFormH5Com;
