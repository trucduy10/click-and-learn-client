import PropTypes from "prop-types";
import React from "react";
import { withErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ErrorCom from "../../components/common/ErrorCom";
import { HeadingH5Com } from "../../components/heading";
import { ImageCom } from "../../components/image";
import { IMAGE_DEFAULT } from "../../constants/config";
import { convertCoreObjectItems } from "../../utils/helper";

const BlogItemMod = ({
  item,
  type,
  objectOriginal,
  isShowType = false,
  isSearchPage = false,
}) => {
  const { userSubcribes } = useSelector((state) => state.author);
  if (type === "AUTHOR") {
    item = {
      ...item,
      userSubcribes,
    };
  }

  const newItem = convertCoreObjectItems(item, type, objectOriginal, 250);

  return (
    <div
      className={`${
        isSearchPage ? "" : "card-item"
      } duration-300 bg-white rounded-lg`}
    >
      <Link to={newItem.slug} className="relative">
        <div className="blog-box blog-list row">
          <div className="col-md-2">
            <div className="w-full h-[150px] relative">
              <div className="absolute w-full h-full top-0 bg-opacity-20 bg-black"></div>
              <ImageCom
                srcSet={newItem.image ?? IMAGE_DEFAULT}
                alt={newItem.name}
              ></ImageCom>
            </div>
          </div>
          <div className="col-md-10">
            <div className="blog-details">
              <HeadingH5Com>{newItem.name}</HeadingH5Com>
              <div className="blog-bottom-content">
                <ul className="blog-social">
                  <li
                    dangerouslySetInnerHTML={{
                      __html: newItem.createdBy,
                    }}
                  ></li>
                  <li
                    dangerouslySetInnerHTML={{
                      __html: newItem.countText,
                    }}
                  ></li>
                </ul>
                <hr />
                <p className="mt-0">{newItem.description}</p>
              </div>
            </div>
          </div>
        </div>
        {isShowType && (
          <div
            className={`absolute top-2 left-5 text-white ${
              type === "COURSE"
                ? "bg-tw-primary"
                : type === "BLOG"
                ? "bg-tw-light-green"
                : "bg-tw-light-pink"
            } px-3 py-1`}
          >
            {type}
          </div>
        )}
      </Link>
    </div>
  );
};

BlogItemMod.propTypes = {
  item: PropTypes.object,
  type: PropTypes.oneOf(["BLOG", "COURSE", "AUTHOR"]),
  objectOriginal: PropTypes.array,
  //   children: PropTypes.node,
};
export default withErrorBoundary(BlogItemMod, {
  FallbackComponent: ErrorCom,
});
