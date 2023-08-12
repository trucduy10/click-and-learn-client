import { Progress } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

// type = circle or ""
const ProgressAntCom = ({ percent = 100, ...rest }) => {
  return (
    <Progress
      // type="circle"
      percent={percent}
      strokeColor={{
        "0%": "#7366ff",
        "100%": "#0be8ab",
      }}
      {...rest}
    />
  );
};

ProgressAntCom.propTypes = {
  percent: PropTypes.number.isRequired,
  rest: PropTypes.node,
};
export default withErrorBoundary(ProgressAntCom, {
  FallbackComponent: ErrorCom,
});
