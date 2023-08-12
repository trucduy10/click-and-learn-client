import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { withErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ErrorCom from "../components/common/ErrorCom";

const LayoutAuthentication = () => {
  const { user, lastUrlAccess } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (lastUrlAccess) {
        navigate(lastUrlAccess);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lastUrlAccess]);
  if (user) return <></>;

  return (
    // Dark Mode: add dark:bg-tw-dark, then in HTML tag add class="dark"
    <div className="container-fluid p-0">
      <div className="row m-0">
        <div className="col-12 p-0">
          <div className="login-card">
            <div>
              <div>
                <Link to="/">
                  <img
                    className="img-fluid for-light w-[300px] object-cover mx-auto"
                    srcSet="/logo_click_light.png"
                    alt="Click and Learn Logo"
                  />
                </Link>
              </div>
              <div className="login-main">
                <Outlet></Outlet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LayoutAuthentication.propTypes = {
  children: PropTypes.node,
};
export default withErrorBoundary(LayoutAuthentication, {
  FallbackComponent: ErrorCom,
});
