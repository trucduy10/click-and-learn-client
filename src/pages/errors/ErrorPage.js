import React from "react";
import { Link } from "react-router-dom";
import {
  MESSAGE_BAD_REQUEST,
  MESSAGE_FORBIDDEN,
  MESSAGE_GENERAL_FAILED,
  MESSAGE_NOT_FOUND,
  MESSAGE_UNAUTHORIZE,
} from "../../constants/config";

const ErrorPage = ({
  status = 400,
  message = MESSAGE_BAD_REQUEST,
  className = "danger",
}) => {
  switch (status) {
    case 400:
      break;
    case 404:
      message = MESSAGE_NOT_FOUND;
      className = "primary";
      break;
    case 401:
      message = MESSAGE_UNAUTHORIZE;
      className = "warning";
      break;
    case 403:
      message = MESSAGE_FORBIDDEN;
      break;
    case 500:
      message = MESSAGE_GENERAL_FAILED;
      className = "secondary";
      break;
    default:
      break;
  }
  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <div className="error-wrapper">
        <div className="container">
          <img
            className="img-100 mx-auto"
            srcSet="/assets/images/other-images/sad.png"
            alt="Error Page Thumb"
          />
          <div className="error-heading">
            <h2 className={`headline font-${className}`}>{status}</h2>
          </div>
          <div className="col-md-8 offset-md-2">
            <p className="sub-content">{message}</p>
          </div>
          <div>
            <Link className={`btn btn-${className}-gradien btn-lg`} to="/">
              BACK TO HOME PAGE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
