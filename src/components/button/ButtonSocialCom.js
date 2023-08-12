import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

const ButtonSocialCom = ({
  url = "",
  className = "",
  onClick = () => {},
  children,
}) => {
  return (
    <Link className={`btn btn-light ${className}`} to={url} onClick={onClick}>
      {children}
    </Link>
  );
};

ButtonSocialCom.propTypes = {
  url: PropTypes.string,
  onClick: PropTypes.func,
};

export default withErrorBoundary(ButtonSocialCom, {
  FallbackComponent: ErrorCom,
});
