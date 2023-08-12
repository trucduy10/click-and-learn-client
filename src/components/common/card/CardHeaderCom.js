import PropTypes from "prop-types";
import React from "react";
import { withErrorBoundary } from "react-error-boundary";
import { HeadingH2Com } from "../../heading";
import ErrorCom from "../ErrorCom";

const CardHeaderCom = ({ title, subText = "", className = "" }) => {
  return (
    <div className={`card-header p-4 ${className}`}>
      <HeadingH2Com className="text-tw-light-pink text-">{title}</HeadingH2Com>
      {subText?.length > 0 && (
        <span className="text-xs text-[#2B2B2BB3] font-medium">{subText}</span>
      )}
    </div>
  );
};

CardHeaderCom.propTypes = {
  title: PropTypes.string.isRequired,
  subText: PropTypes.string,
  className: PropTypes.string,
};
export default withErrorBoundary(CardHeaderCom, {
  FallbackComponent: ErrorCom,
});
