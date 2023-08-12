import React from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

// const listItems = [
//   {
//     value: "Programming",
//     label: "Programming",
//   },
//   {
//     value: "PHP",
//     label: "PHP",
//   },
// ];
// Automatic tokenization
const SelectTagAntCom = ({
  listItems = [],
  onChange = () => {},
  status = "",
  errorMsg = "",
  placeholder = "Please input...",
  selectedValue = [],
  className = "",
}) => {
  return (
    <>
      <Select
        value={selectedValue}
        status={status}
        size="large"
        mode="tags"
        style={{
          width: "100%",
        }}
        placeholder={placeholder}
        onChange={onChange}
        options={listItems}
      />
      {errorMsg && errorMsg.length > 0 && (
        <span className="text-tw-danger text-sm">{errorMsg}</span>
      )}
    </>
  );
};

SelectTagAntCom.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  status: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  errorMsg: PropTypes.string,
};
export default withErrorBoundary(SelectTagAntCom, {
  FallbackComponent: ErrorCom,
});
