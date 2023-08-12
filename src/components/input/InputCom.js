import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";
import useClickToggleBoolean from "../../hooks/useClickToggleBoolean";

const InputCom = (props) => {
  const {
    register = () => {},
    control,
    name,
    type = "text",
    errorMsg = "",
    children,
    defaultValue = "",
    readOnly = false,
    ...rest
  } = props;

  const { fields } = useController({
    control,
    name,
    defaultValue,
  });

  const {
    value: showPassword,
    handleToggleBoolean: handleClickToggleShowHide,
  } = useClickToggleBoolean();

  return (
    <>
      <div className="form-input position-relative">
        <input
          id={name}
          className={`form-control tw-transition-all placeholder:italic ${
            readOnly && "cursor-not-allowed"
          } ${
            errorMsg &&
            errorMsg.length > 0 &&
            "is-invalid border-tw-danger text-tw-danger"
          }`}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          readOnly={readOnly ? true : undefined}
          {...register(name)}
          {...fields}
          {...rest}
        />
        {type === "password" && (
          <div className="show-hide">
            <span
              className={`mr-2 px-1 bg-tw-light ${showPassword ? "" : "show"}`}
              onClick={handleClickToggleShowHide}
            ></span>
          </div>
        )}
        {children}
      </div>
      {errorMsg && errorMsg.length > 0 && (
        <span className="text-tw-danger text-sm">{errorMsg}</span>
      )}
    </>
  );
};

InputCom.propTypes = {
  control: PropTypes.any.isRequired,
  register: PropTypes.func.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  errorMsg: PropTypes.string,
  readOnly: PropTypes.bool,
  children: PropTypes.node,
};
export default withErrorBoundary(InputCom, {
  FallbackComponent: ErrorCom,
});
