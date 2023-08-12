import React from "react";

const HeadingFormH1Com = ({ className = "", icon = "", children }) => {
  return (
    <h1 className={`text-3xl md:text-4xl font-bold text-center text-tw-primary mb-[1.25rem] ${className}`}>
      {icon}
      {children}
    </h1>
  );
};

export default HeadingFormH1Com;
