import React from "react";

const ImageCom = ({
  srcSet = "",
  alt = "Default Thumb",
  className = "w-full h-full object-cover rounded-2xl",
}) => {
  return <img srcSet={srcSet} alt={alt} className={`${className}`} />;
};

export default ImageCom;
