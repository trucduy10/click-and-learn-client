import React from "react";
import { Link } from "react-router-dom";
import { IconFolderCom } from "../../components/icon";
import { ImageCom } from "../../components/image";
import { convertIntToStrMoney, sliceText } from "../../utils/helper";
import { CategoryTagMod } from "../category";
import { CourseAuthorMod, CourseDescMod, CourseTitleMod } from "../course";

const CourseItemMod = ({ url = "/", isPaid = false, course }) => {
  return (
    <div className="c-card course-item col-md-4 col-xl-3">
      <Link to={url} className="tw-transition-all hover:opacity-80">
        <div className="c-card-header h-[158px]">
          <ImageCom srcSet={course?.image} alt={course?.slug}></ImageCom>
        </div>
        <div className="c-card-body py-[1rem]">
          <CategoryTagMod icon={<IconFolderCom />}>
            {course?.category_name}
          </CategoryTagMod>

          <CourseTitleMod className="font-tw-secondary">
            {sliceText(course?.name, 20)}
          </CourseTitleMod>

          <CourseDescMod>{sliceText(course?.description, 45)}</CourseDescMod>

          <div className="c-meta flex items-start justify-between gap-x-5 mb-5">
            {!isPaid ? (
              <div className="flex flex-col gap-y-1">
                <h4
                  className={`${
                    course?.price === 0 ? "text-tw-light-pink" : "text-gray-600"
                  } text-base font-semibold ${
                    course?.net_price > 0 ? "line-through" : ""
                  }`}
                >
                  {course?.price === 0
                    ? "Free"
                    : `$${convertIntToStrMoney(course?.price)}`}
                </h4>
                {course?.net_price > 0 && (
                  <span className="text-sm text-gray-400 ">
                    Sale only{" "}
                    <strong className="text-tw-light-pink">
                      ${convertIntToStrMoney(course?.net_price)}
                    </strong>
                  </span>
                )}
              </div>
            ) : (
              <p>Progress: {course?.progress}%</p>
            )}

            <div className="flex flex-col gap-y-1">
              <h4 className="text-gray-600 text-base font-semibold text-right">
                {course?.enrollmentCount}
              </h4>
              <span className="text-sm text-gray-400">Total Enrolled</span>
            </div>
          </div>

          <CourseAuthorMod
            authorName={course.author_name}
            image={course.author_image}
            rating={course?.rating}
          ></CourseAuthorMod>
        </div>
      </Link>
    </div>
  );
};

export default CourseItemMod;
