import React from "react";

const CourseDescMod = ({ className = "", children }) => {
  return (
    <p
      dangerouslySetInnerHTML={{ __html: children }}
      className={`mb-[1rem] text-sm text-gray-400 whitespace-pre-wrap ${className}`}
    ></p>
  );
};

export default CourseDescMod;
