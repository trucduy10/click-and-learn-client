import { Spin } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

const SpinAntCom = ({ loadingText }) => {
  return (
    <>
      <div className="text-center">
        <Spin size="large" tip={loadingText}>
          {loadingText && <div className="content" />}
        </Spin>
      </div>
    </>
  );
};

SpinAntCom.propTypes = {
  loadingText: PropTypes.string,
};
export default withErrorBoundary(SpinAntCom, {
  FallbackComponent: ErrorCom,
});
