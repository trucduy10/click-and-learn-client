import React from "react";

const HeadingH5Com = ({ className = "", children }) => {
  return (
    <h5 className={`text-base font-bold text-tw-primary ${className}`}>
      {children}
    </h5>
  );
};

export default HeadingH5Com;
