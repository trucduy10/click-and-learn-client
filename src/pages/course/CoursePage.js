import { Pagination } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { BreadcrumbCom } from "../../components/breadcrumb";
import EmptyDataCom from "../../components/common/EmptyDataCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH2Com } from "../../components/heading";
import { LIMIT_PAGE } from "../../constants/config";
import usePagination from "../../hooks/usePagination";
import { CourseGridMod, CourseItemMod } from "../../modules/course";
import { onCourseLoading } from "../../store/course/courseSlice";
import { formatNumber } from "../../utils/helper";

const CoursePage = () => {
  const { startIndex, endIndex, currentPage, handleChangePage } =
    usePagination(1);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(onCourseLoading());
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com number={formatNumber(data?.length)}>
          All Courses
        </HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Course",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      {data && data.length > 0 ? (
        <>
          <CourseGridMod>
            {data.map((course, index) => {
              if (index >= startIndex && index < endIndex) {
                return (
                  <CourseItemMod
                    key={v4()}
                    isPaid={false}
                    course={course}
                    url={`/courses/${course?.slug}`}
                  ></CourseItemMod>
                );
              }
              return null;
            })}
          </CourseGridMod>
          {data.length > LIMIT_PAGE && (
            <Pagination
              current={currentPage}
              defaultPageSize={LIMIT_PAGE}
              total={data?.length}
              onChange={handleChangePage}
              className="mt-[1rem] text-center"
            />
          )}
        </>
      ) : (
        <EmptyDataCom text="No data" />
      )}
    </>
  );
};

export default CoursePage;
