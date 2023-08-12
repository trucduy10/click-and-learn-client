import React from "react";
import { MESSAGE_GENERAL_FAILED } from "../../constants/config";

const ErrorCom = () => {
  return (
    <div className="text-danger bg-red-100 p-4 rounded-lg text-center">
      {MESSAGE_GENERAL_FAILED}
    </div>
  );
};

export default ErrorCom;
