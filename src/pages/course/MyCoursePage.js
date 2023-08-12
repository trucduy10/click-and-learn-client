import { Pagination } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import EmptyDataCom from "../../components/common/EmptyDataCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH2Com } from "../../components/heading";
import { LIMIT_PAGE } from "../../constants/config";
import usePagination from "../../hooks/usePagination";
import { CourseGridMod, CourseItemMod } from "../../modules/course";
import { onMyCourseLoading } from "../../store/course/courseSlice";
import { formatNumber } from "../../utils/helper";

const MyCoursePage = () => {
  const { startIndex, endIndex, currentPage, handleChangePage } =
    usePagination(1);

  const { user } = useSelector((state) => state.auth);
  const { data } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(onMyCourseLoading(user.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <>
      <HeadingH1Com number={formatNumber(data?.length)}>
        My Courses
      </HeadingH1Com>
      <GapYCom></GapYCom>
      <CourseGridMod>
        {data?.length > 0 ? (
          data.map((course, index) => {
            if (index >= startIndex && index < endIndex) {
              return (
                <CourseItemMod
                  key={v4()}
                  isPaid={true}
                  url={`/learn/${course.slug}`}
                  course={course}
                ></CourseItemMod>
              );
            }
            return null;
          })
        ) : (
          <EmptyDataCom text="No data" />
        )}
      </CourseGridMod>
      {data?.length > LIMIT_PAGE && (
        <Pagination
          current={currentPage}
          defaultPageSize={LIMIT_PAGE}
          total={data?.length}
          onChange={handleChangePage}
          className="mt-[1rem] text-center"
        />
      )}
    </>
  );
};

export default MyCoursePage;
