import { Select } from "antd";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import { mainColor } from "../../constants/mainTheme";
import ErrorCom from "../common/ErrorCom";

// const handleChange = (value) => {
//   console.log(`selected ${value}`);
// };

// Basic Usage
const SelectDefaultAntCom = ({
  listItems = [],
  onChange = () => {},
  defaultValue,
  status = "",
  errorMsg = "",
  className = "",
  selectedValue = null,
  ...rest
}) => {
  return (
    <>
      <style>
        {`
          .custom-dropdown .ant-select-selector {
            background: ${mainColor.light} !important;
            color: ${mainColor.primary} !important;
          }
          .custom-dropdown .ant-select-arrow {
            color: ${mainColor.primary} !important;
          }

          .blog-dropdown-dark .ant-select-selector{
            background: ${mainColor.dark} !important;
            color: ${mainColor.white} !important;
          }
          .blog-dropdown-success .ant-select-selector{
            background: ${mainColor.success} !important;
            color: ${mainColor.white} !important;
          }
          .blog-dropdown-warning .ant-select-selector{
            background: ${mainColor.warning} !important;
            color: ${mainColor.white} !important;
          }
          .footer-background{
            background: ${mainColor.dark} !important;
            color: ${mainColor.white} !important;
          }
       
        `}
      </style>
      <Select
        size="large"
        defaultValue={defaultValue}
        onChange={onChange}
        options={listItems}
        className={`${className} w-full`}
        {...rest}
      />

      {errorMsg && errorMsg.length > 0 && (
        <span className="text-tw-danger text-sm">{errorMsg}</span>
      )}
    </>
  );
};

SelectDefaultAntCom.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultValue: PropTypes.any,
  status: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  errorMsg: PropTypes.string,
};
export default withErrorBoundary(SelectDefaultAntCom, {
  FallbackComponent: ErrorCom,
});
