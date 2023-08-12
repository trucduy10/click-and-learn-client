import React from "react";

const AdminCardCom = ({ className = "", children }) => {
  return <div className={`card p-3 bg-white ${className}`}>{children}</div>;
};

export default AdminCardCom;
