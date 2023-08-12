import React from "react";

const OverlayCom = ({ onClick = () => {}, isShow = false }) => {
  return (
    <div
      className={`overlay fixed inset-0 z-40 bg-black bg-opacity-20 tw-transition-all ${
        isShow ? "opacity-100" : "opacity-0 invisible"
      } `}
      onClick={onClick}
    ></div>
  );
};

export default OverlayCom;
