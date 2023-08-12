import PropTypes from "prop-types";
import React from "react";
import { withErrorBoundary } from "react-error-boundary";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { AVATAR_DEFAULT } from "../../../constants/config";
import { onUpdateCourse } from "../../../store/admin/course/courseSlice";
import { convertIntToStrMoney, sliceText } from "../../../utils/helper";
import { helperChangeStatusCourse } from "../../../utils/helperCourse";
import ErrorCom from "../../common/ErrorCom";
import { ImageCom } from "../../image";

const RowCourseItem = ({ item, courses = [] }) => {
  const dispatch = useDispatch();
  const handleClickStatus = (courseId, isActive) => {
    if (!isActive) {
      Swal.fire({
        title: "Are you sure?",
        html: "After change, this course will public to client",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7366ff",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, please continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const fd = helperChangeStatusCourse(isActive, courseId, courses);
          dispatch(onUpdateCourse(fd));
        }
      });
    } else {
      const fd = helperChangeStatusCourse(isActive, courseId, courses);
      dispatch(onUpdateCourse(fd));
    }
  };

  return (
    <tr>
      <td>
        <div className="w-10">
          <ImageCom
            srcSet={item?.image || AVATAR_DEFAULT}
            alt={item?.slug}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {item?.status === 0 && <div className="status-circle bg-primary" />}
      </td>
      <td className="img-content-box">
        <span className="d-block">{sliceText(item?.name, 50)}</span>
        <span className="font-roboto">{item?.category_name}</span>
      </td>
      <td>
        <p className="m-0 text-tw-primary">
          {item?.price === 0
            ? "Free"
            : item?.net_price > 0
            ? `$${convertIntToStrMoney(item?.net_price)}`
            : `$${convertIntToStrMoney(item?.price)}`}
        </p>
      </td>
      <td
        className="text-end"
        onClick={() => handleClickStatus(item?.id, item?.status)}
      >
        {item?.status === 1 ? (
          <div className="button btn btn-success">
            Approve
            <i className="fa fa-check-circle ms-2" />
          </div>
        ) : (
          <div className="button btn btn-danger">
            Not yet
            <i className="fa fa-clock-o ms-2" />
          </div>
        )}
      </td>
    </tr>
  );
};

RowCourseItem.propTypes = {
  item: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
};

export default withErrorBoundary(RowCourseItem, {
  FallbackComponent: ErrorCom,
});
