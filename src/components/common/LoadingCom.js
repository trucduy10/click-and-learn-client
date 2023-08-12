import React from "react";
import OverlayCom from "./OverlayCom";

const LoadingCom = ({ isChild = false, loadingText }) => {
  return (
    <>
      {!isChild && <OverlayCom isShow />}
      <div className="fixed loading-spin">
        <span />
        <span />
        <span />
      </div>
    </>
  );
};

export default LoadingCom;
