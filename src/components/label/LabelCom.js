import React from "react";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

const LabelCom = ({
  htmlFor = "",
  className = "",
  isRequired = false,
  subText = "",
  children,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`col-form-label pt-0 cursor-pointer ${className}`}
    >
      {children} {isRequired && <span className="text-tw-danger">*</span>}{" "}
      {subText.length > 0 && (
        <span className="text-gray-400 text-xs">{subText}</span>
      )}
    </label>
  );
};

LabelCom.propTypes = {
  children: PropTypes.node,
  htmlFor: PropTypes.string,
};
export default withErrorBoundary(LabelCom, {
  FallbackComponent: ErrorCom,
});
