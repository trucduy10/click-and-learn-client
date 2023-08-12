import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";
import { v4 } from "uuid";

const BreadcrumbCom = ({ items = [] }) => {
  return (
    <ol className="breadcrumb mb-0">
      {items.map((item, i) => (
        <li
          key={v4()}
          className={`breadcrumb-item ${item.isActive ? "active" : ""}`}
        >
          {item.isActive ? (
            item.title
          ) : (
            <Link
              to={item.slug}
              title={`${item.title} Page`}
              className={`${item.isActive ? "" : "text-tw-primary"}`}
            >
              {item.title}
            </Link>
          )}
        </li>
      ))}
    </ol>
  );
};

BreadcrumbCom.propTypes = {
  items: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
};
export default withErrorBoundary(BreadcrumbCom, {
  FallbackComponent: ErrorCom,
});
