import React from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

// Sample items
// const items = [
//   {
//     value: "1",
//     label: "Not Identified",
//   },
//   {
//     value: "2",
//     label: "Closed",
//   },
//   {
//     value: "3",
//     label: "Communicated",
//   },
//   {
//     value: "4",
//     label: "Identified",
//   },
//   {
//     value: "5",
//     label: "Resolved",
//   },
//   {
//     value: "6",
//     label: "Cancelled",
//   },
// ];

// Select with search field
const SelectSearchAntCom = (props) => {
  const {
    listItems = [],
    onChange = () => {},
    status = "",
    errorMsg = "",
    className = "",
    selectedValue = null,
    isGetObject = false,
    ...rest
  } = props;
  return (
    <>
      <Select
        value={selectedValue}
        status={status}
        size="large"
        showSearch
        placeholder="Search your data"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? "").includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        onChange={(value) =>
          isGetObject
            ? onChange(listItems.find((r) => r.value === value))
            : onChange(value)
        }
        options={listItems}
        className={`${className}`}
        {...rest}
      />

      {errorMsg && errorMsg.length > 0 && (
        <span className="text-tw-danger text-sm">{errorMsg}</span>
      )}
    </>
  );
};

SelectSearchAntCom.propTypes = {
  listItems: PropTypes.array.isRequired,
  status: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  errorMsg: PropTypes.string,
};
export default withErrorBoundary(SelectSearchAntCom, {
  FallbackComponent: ErrorCom,
});
