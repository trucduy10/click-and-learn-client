import React from "react";
import { AVATAR_DEFAULT } from "../../../constants/config";
import { sliceText } from "../../../utils/helper";
import { ImageCom } from "../../image";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../../common/ErrorCom";
import { onPostBlog } from "../../../store/admin/blog/blogSlice";
import { useDispatch } from "react-redux";

const RowBlogItem = ({ item, blogs = [] }) => {
  const dispatch = useDispatch();
  const handleClickStatus = (blogId, isPublished) => {
    const data = blogs.find((item) => item.id === blogId);
    dispatch(
      onPostBlog({
        ...data,
        status: isPublished === 1 ? 2 : 1,
      })
    );
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
        {item?.status === 2 && <div className="status-circle bg-primary" />}
      </td>
      <td className="img-content-box">
        <span className="d-block">{sliceText(item?.name, 35)}</span>
        <span className="font-roboto">{item?.category_name}</span>
      </td>
      <td>
        <p
          className="m-0 text-tw-primary"
          dangerouslySetInnerHTML={{
            __html: sliceText(item?.description, 100),
          }}
        ></p>
      </td>
      <td>
        <p className="m-0 text-tw-light-pink">
          {sliceText(item?.createdBy, 12)}
        </p>
      </td>
      <td
        className="text-end"
        onClick={() => handleClickStatus(item?.id, item?.status)}
      >
        {item?.status === 1 ? (
          <div className="button btn btn-success">
            Published
            <i className="fa fa-check-circle ms-2" />
          </div>
        ) : (
          <div className="button btn btn-warning">
            Processing
            <i className="fa fa-clock-o ms-2" />
          </div>
        )}
      </td>
    </tr>
  );
};

RowBlogItem.propTypes = {
  item: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
};

export default withErrorBoundary(RowBlogItem, {
  FallbackComponent: ErrorCom,
});
