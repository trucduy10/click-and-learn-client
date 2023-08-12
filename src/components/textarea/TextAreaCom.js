import PropTypes from "prop-types";
import React from "react";
import { withErrorBoundary } from "react-error-boundary";
import { useController } from "react-hook-form";
import ErrorCom from "../common/ErrorCom";

const TextAreaCom = (props) => {
  const { register = () => {}, control, name, ...rest } = props;

  const { fields } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <textarea
      className="form-control dark:!placeholder-gray-300 dark:text-white"
      id={name}
      rows="5"
      {...register(name)}
      {...fields}
      {...rest}
    />
  );
};

TextAreaCom.propTypes = {
  control: PropTypes.any.isRequired,
  register: PropTypes.func.isRequired,
  name: PropTypes.string,
};
export default withErrorBoundary(TextAreaCom, {
  FallbackComponent: ErrorCom,
});
