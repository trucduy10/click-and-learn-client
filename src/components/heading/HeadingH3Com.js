import React from "react";

const HeadingH3Com = ({ className = "", children }) => {
  return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
};

export default HeadingH3Com;
