import React from "react";

const HeadingH4Com = ({ className = "", children }) => {
  return (
    <h4 className={`font-medium text-sm text-tw-light-pink ${className}`}>
      {children}
    </h4>
  );
};

export default HeadingH4Com;
