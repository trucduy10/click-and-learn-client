import React from "react";

const CourseNumberMod = ({number}) => {
  return (
    <div className="flex flex-col gap-y-1">
      <h4 className="text-gray-600 text-sm font-semibold">$800</h4>
      <span className="text-xs text-gray-400">Sale only $300</span>
    </div>
  );
};

export default CourseNumberMod;
