import React from "react";

const FormGroupCom = ({ className = "", children }) => {
  return <div className={`form-group ${className}`}>{children}</div>;
};

export default FormGroupCom;
