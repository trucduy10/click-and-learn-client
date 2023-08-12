import * as React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";

const RatingMuiCom = ({ defaultValue, ...rest }) => {
  // attr = readOnly will cannot edit Rating
  // defaultValue is a float number like 4.5
  return (
    <Stack spacing={1}>
      <Rating
        name="half-rating"
        defaultValue={defaultValue}
        precision={0.5}
        {...rest}
      />
    </Stack>
  );
};

RatingMuiCom.propTypes = {
  defaultValue: PropTypes.number.isRequired,
};
export default withErrorBoundary(RatingMuiCom, {
  FallbackComponent: ErrorCom,
});
