import React from "react";
import { RatingMuiCom } from "../../components/mui";
import { AVATAR_DEFAULT } from "../../constants/config";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../../components/common/ErrorCom";

const CourseAuthorMod = ({
  authorName = "",
  image = AVATAR_DEFAULT,
  rating = 5,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-3">
        <img
          srcSet={image}
          className="w-8 h-8 rounded-full object-cover"
          alt="User Avatar"
        />
        <p className="text-xs text-gray-400">
          {authorName && (
            <>
              By{" "}
              <span className="text-gray-600 font-semibold">{authorName}</span>
            </>
          )}
        </p>
      </div>
      <RatingMuiCom defaultValue={rating} readOnly></RatingMuiCom>
    </div>
  );
};

CourseAuthorMod.propTypes = {
  authorName: PropTypes.string,
  image: PropTypes.string,
  rating: PropTypes.number,
};
export default withErrorBoundary(CourseAuthorMod, {
  FallbackComponent: ErrorCom,
});
