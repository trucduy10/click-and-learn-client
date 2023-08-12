import PropTypes from "prop-types";
import React from "react";
import { withErrorBoundary } from "react-error-boundary";
import { NavLink } from "react-router-dom";
import ErrorCom from "../common/ErrorCom";

const ButtonCom = (props) => {
  const {
    type = "button",
    className = "",
    isLoading = false,
    children,
    backgroundColor = "primary",
    padding = "px-8",
    minHeight = "min-h-[42px]",
    icon = "",
    ...rest
  } = props;

  // If isLoading will show animate loadding spin
  // <div class="loader-box">
  //   <div class="loader-15"></div>
  // </div>;

  // !!isLoading convert to boolean
  const child = !!isLoading ? (
    <div className="w-6 h-6 rounded-full border-4 border-t-transparent border-b-transparent animate-spin mx-auto"></div>
  ) : (
    children
  );

  let defaultClassName = `btn-block rounded-md transition-all duration-300 ${
    rest.disabled ? "cursor-not-allowed" : ""
  } ${minHeight} ${padding} ${className} ${
    !!isLoading ? "opacity-80 pointer-events-none" : "hover:opacity-80"
  }`;
  switch (backgroundColor) {
    case "primary":
      defaultClassName += " bg-tw-primary text-white";
      break;
    case "success":
      defaultClassName += " bg-tw-success text-white";
      break;
    case "info":
      defaultClassName += " bg-tw-info text-white";
      break;
    case "danger":
      defaultClassName += " bg-tw-danger text-white";
      break;
    case "pink":
      defaultClassName += " bg-tw-light-pink text-white";
      break;
    case "dark":
      defaultClassName += " bg-tw-dark text-white";
      break;
    case "light":
      defaultClassName += " bg-tw-light text-white";
      break;
    case "gray":
      defaultClassName += " bg-gray-200 text-white";
      break;
    case "gradient":
      defaultClassName +=
        " hover:bg-contain bg-gradient-to-r from-pink-500 to-violet-500 text-white transition-all duration-300 hover:bg-gradient-to-l";
      break;
    case "finish":
      defaultClassName +=
        " hover:cursor-default hover:opacity-100 bg-tw-success text-white";
      break;
    default:
      // defaultClassName += ` ${backgroundColor}`;
      break;
  }

  // If existed rest.to
  if (rest.to) {
    return (
      <NavLink
        to={rest.to}
        className={({ isActive }) =>
          isActive
            ? `active ${defaultClassName} !bg-tw-light-pink text-white`
            : defaultClassName
        }
      >
        {child}
      </NavLink>
    );
  }

  return (
    <button className={defaultClassName} type={type} {...rest}>
      {icon ? (
        <div className="flex items-center gap-x-2">
          {icon}
          {child}
        </div>
      ) : (
        child
      )}
    </button>
  );
};

ButtonCom.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  rest: PropTypes.any,
  backgroundColor: PropTypes.oneOf([
    "primary",
    "success",
    "info",
    "danger",
    "pink",
    "light",
    "dark",
    "gray",
    "gradient",
    "finish",
  ]),
  padding: PropTypes.string,
  minHeight: PropTypes.string,
  children: PropTypes.node,
};

export default withErrorBoundary(ButtonCom, {
  FallbackComponent: ErrorCom,
});
