import React from "react";
import { HeadingH2Com } from "../heading";

const EmptyDataCom = ({
  text = "No data",
  className = "text-black text-4xl text-center py-10",
}) => {
  return <HeadingH2Com className={className}>{text}</HeadingH2Com>;
};

export default EmptyDataCom;
