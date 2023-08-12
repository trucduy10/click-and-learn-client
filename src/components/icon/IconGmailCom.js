import React from "react";

const IconGmailCom = ({ className = "" }) => {
  return (
    <img
      srcSet="assets/images/icon/gmail.png"
      className={`w-5 h-5 object-cover inline ${className}`}
      alt="Gmail Icon"
    />
  );
};

export default IconGmailCom;
