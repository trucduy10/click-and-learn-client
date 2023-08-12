import { Checkbox } from "antd";
import React from "react";
import { HeadingFormH5Com } from "../heading";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

const CheckBoxAntCom = ({
  onChange = () => {},
  children,
  isChecked = false,
  ...rest
}) => {
  return (
    <Checkbox onChange={onChange} checked={isChecked} size="large" {...rest}>
      <HeadingFormH5Com
        className={`text-xl font-bold tw-transition-all ${
          isChecked && "text-tw-success"
        }`}
      >
        {children}
      </HeadingFormH5Com>
    </Checkbox>
  );
};

CheckBoxAntCom.propTypes = {
  onChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  children: PropTypes.node,
  rest: PropTypes.any,
};

export default withErrorBoundary(CheckBoxAntCom, {
  FallbackComponent: ErrorCom,
});
