import React from "react";

const CourseGridMod = ({ children, type = "col-4" }) => {
  return <div className="courses-grid row gap-y-16">{children}</div>;
};

export default CourseGridMod;
