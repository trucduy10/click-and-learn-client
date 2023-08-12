import React from "react";
import { AVATAR_DEFAULT } from "../../../constants/config";
import { convertDateTime, sliceText } from "../../../utils/helper";
import { ImageCom } from "../../image";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import { useDispatch } from "react-redux";
import { onUpdateUser } from "../../../store/admin/user/userSlice";
import ErrorCom from "../../common/ErrorCom";

const RowUserItem = ({ item, users = [] }) => {
  const dispatch = useDispatch();
  const handleClickStatus = (userId, isActive) => {
    //update new status of user
    const data = users.find((item) => item.id === userId);

    dispatch(
      onUpdateUser({
        ...data,
        status: isActive === 1 ? 0 : 1,
      })
    );
  };

  return (
    <tr>
      <td>
        <div className="w-10">
          <ImageCom
            srcSet={item?.imageUrl || AVATAR_DEFAULT}
            alt={item?.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {item?.status === 0 && <div className="status-circle bg-primary" />}
      </td>
      <td className="img-content-box">
        <span className="d-block">{sliceText(item?.name, 9)}</span>
        <span className="font-roboto">{item?.role}</span>
      </td>
      <td>
        <p className="m-0 text-tw-primary">
          {convertDateTime(item?.created_at, false)}
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

RowUserItem.propTypes = {
  item: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};

export default withErrorBoundary(RowUserItem, {
  FallbackComponent: ErrorCom,
});
