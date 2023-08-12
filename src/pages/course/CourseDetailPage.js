import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { axiosBearer } from "../../api/axiosInstance";
import { CollapseAntCom } from "../../components/ant";
import { BreadcrumbCom } from "../../components/breadcrumb";
import { ButtonCom } from "../../components/button";
import EmptyDataCom from "../../components/common/EmptyDataCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH2Com } from "../../components/heading";
import {
  IconCheckCom,
  IconCircleCom,
  IconClockCom,
  IconImportantCom,
  IconLearnCom,
  IconStarCom,
} from "../../components/icon";
import { ImageCom } from "../../components/image";
import {
  categoryItems,
  MESSAGE_LOGIN_REQUIRED,
  NOT_FOUND_URL,
} from "../../constants/config";
import { API_ENROLLMENT_URL } from "../../constants/endpoint";
import { ALLOWED_ADMIN_MANAGER_EMPLOYEE } from "../../constants/permissions";
import usePagination from "../../hooks/usePagination";
import { CourseGridMod, CourseItemMod } from "../../modules/course";
import { onGetLastUrlAccess } from "../../store/auth/authSlice";
import {
  selectAllCourseState,
  selectEnrollIdAndCourseId,
} from "../../store/course/courseSelector";
import {
  onGetEnrollId,
  onGetLearning,
  onMyCourseLoading,
  onReady,
  onRelatedCourseLoading,
  onReload,
} from "../../store/course/courseSlice";
import {
  convertIntToStrMoney,
  convertSecondToDiffForHumans,
  convertStrToSlug,
  showMessageError,
} from "../../utils/helper";

// const sectionItems = [
//   {
//     id: 1,
//     name: "Introduce",
//   },
//   {
//     id: 2,
//     name: "How to install PHP",
//   },
// ];

// const lessionItems = [
//   {
//     id: 1,
//     name: "What is PHP",
//     duration: 178,
//     sectionId: 1,
//   },
//   {
//     id: 2,
//     name: "What is Laravel",
//     duration: 358,
//     sectionId: 1,
//   },
//   {
//     id: 3,
//     name: "Install XamPP",
//     duration: 138,
//     sectionId: 2,
//   },
//   {
//     id: 4,
//     name: "Install phpMyAdmin",
//     duration: 378,
//     sectionId: 2,
//   },
// ];

const CourseDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();
  const { user } = useSelector((state) => state.auth);

  const { learning, sectionId } = useSelector(selectAllCourseState);
  const { isEnrolled } = useSelector(selectEnrollIdAndCourseId);

  const relatedCourseLimitPage = 4;
  const { startIndex, endIndex, currentPage, handleChangePage } = usePagination(
    1,
    relatedCourseLimitPage
  );

  const { data, relatedCourse } = useSelector((state) => state.course);

  const courseBySlug = data.find((item, index) => item.slug === slug);

  useEffect(() => {
    if (!courseBySlug) navigate(NOT_FOUND_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseBySlug]);

  useEffect(() => {
    if (user?.id && courseBySlug?.id) {
      dispatch(
        onGetEnrollId({ course_id: courseBySlug?.id, user_id: user?.id })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, courseBySlug?.id]);

  // useEffect(() => {

  // }, [dispatch, user]);

  useEffect(() => {
    if (isEnrolled && user?.role === "USER") {
      dispatch(onMyCourseLoading(user.id));
      navigate(`/learn/${courseBySlug?.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnrolled]);

  const newRelatedCourse = relatedCourse.filter(
    (course) => course.id !== courseBySlug?.id
  );

  useEffect(() => {
    if (courseBySlug?.id) {
      // dispatch(onGetEnrollId({ course_id: courseId, user_id: userId }));
      dispatch(onGetLearning(courseBySlug?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseBySlug?.id]);

  useEffect(() => {
    if (courseBySlug)
      dispatch(
        onRelatedCourseLoading({ categoryId: courseBySlug.category_id })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseBySlug]);

  const [openKeys, setOpenKeys] = useState(
    String(learning.sectionDto.length > 0 ? learning.sectionDto[0].id : 0)
  );

  useEffect(() => {
    if (sectionId) setOpenKeys(sectionId);
  }, [sectionId]);

  const handleChangeCollapse = (keys) => {
    setOpenKeys(keys);
    setIsOpen(false);
    if (keys.length === learning.sectionDto.length) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setOpenKeys([]);
    }
  };

  const category = categoryItems.find(
    (item) => item.slug === convertStrToSlug(courseBySlug?.category_name)
  );

  const handleEnroll = async () => {
    const slug = courseBySlug?.slug;
    if (courseBySlug?.price === 0 && user?.role === "USER") {
      try {
        setIsLoading(true);
        if (ALLOWED_ADMIN_MANAGER_EMPLOYEE.includes(user?.role)) {
          navigate(`/learn/${slug}`);
        } else {
          const res = await axiosBearer.post(API_ENROLLMENT_URL, {
            user_id: user?.id,
            course_id: courseBySlug?.id,
          });
          if (res?.data?.type === "success") {
            setTimeout(() => {
              toast.success(res?.data?.message);
              setIsLoading(false);
              navigate(`/learn/${slug}`);
            }, 1000);
          }
        }
      } catch (error) {
        showMessageError(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!user) {
        toast.warn(MESSAGE_LOGIN_REQUIRED);
        dispatch(onGetLastUrlAccess(window.location.pathname));
        navigate("/login");
      } else {
        navigate(`/checkout/${slug}`);
      }
    }
  };

  return (
    <>
      <div
        className="course-detail-banner bg-cover bg-no-repeat bg-center bg-opacity-40 text-white h-32 rounded-3xl flex items-center justify-center mb-5"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(54, 12, 46, 0) -1.75%, #000 90%),url(${
            category?.coverImage ?? category?.image
          })`,
        }}
      >
        <HeadingH2Com className="bg-gradient-to-r from-tw-light-pink to-tw-primary bg-clip-text text-transparent !text-4xl !font-bold">
          <Link
            to={`/categories/${convertStrToSlug(courseBySlug?.category_name)}`}
            className="tw-transition-all hover:text-white"
          >
            {courseBySlug?.category_name}
          </Link>
        </HeadingH2Com>
      </div>
      <div className="flex justify-between items-center">
        <HeadingH1Com className="course-detail-title text-4xl">
          {courseBySlug?.name}
        </HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Course",
              slug: "/courses",
            },
            {
              title: "Detail",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="course-detail-body">
        <div className="row">
          <div className="col-sm-7 relative">
            <div className="course-detail-header">
              {/* <HeadingH1Com className="course-detail-title !mb-3">
                {courseBySlug?.name}
              </HeadingH1Com>
              <GapYCom></GapYCom> */}
              <div
                className="course-detail-description"
                dangerouslySetInnerHTML={{ __html: courseBySlug?.description }}
              ></div>
            </div>
            <GapYCom></GapYCom>
            <hr />
            <GapYCom></GapYCom>
            <div className="course-detail-body">
              {courseBySlug?.achievements &&
                courseBySlug.achievements.trim() !== "" && (
                  <>
                    <HeadingH2Com>What will you achieve?</HeadingH2Com>
                    <GapYCom></GapYCom>
                    <div className="course-detail-archives row">
                      {(courseBySlug?.achievements)
                        .split(",")
                        // eslint-disable-next-line array-callback-return
                        .map((item, index) => {
                          if (index <= 3)
                            return (
                              <ArchiveItems
                                key={v4()}
                                title={item}
                              ></ArchiveItems>
                            );
                        })}
                    </div>
                    <GapYCom></GapYCom>
                  </>
                )}
              <div className="course-detail-description">
                <HeadingH2Com className="text-tw-primary">
                  Course Description
                </HeadingH2Com>
                <GapYCom></GapYCom>
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="flex gap-x-3">
                    <span className="">
                      Sections:{" "}
                      <strong className="text-tw-light-pink">
                        {learning?.sectionDto.length}
                      </strong>
                    </span>
                    <span className="">
                      Lessions:{" "}
                      <strong className="text-tw-light-pink">
                        {learning?.lessonDto.length}
                      </strong>
                    </span>
                    <span className="">
                      Timing:{" "}
                      <strong className="text-tw-light-pink">
                        {convertSecondToDiffForHumans(courseBySlug?.duration)}
                      </strong>
                    </span>
                  </div>
                  <div
                    onClick={handleToggleOpen}
                    className={`transition-all duration-300 cursor-pointer p-2 font-medium ${
                      isOpen ? "text-tw-light-pink" : "text-tw-success"
                    }`}
                  >
                    {isOpen ? "Close all" : "Open All"}
                  </div>
                </div>
                <CollapseAntCom
                  isOpen={isOpen}
                  onChange={handleChangeCollapse}
                  openKeys={openKeys}
                  parentItems={learning.sectionDto}
                  childItems={learning.lessonDto}
                  slug={slug}
                ></CollapseAntCom>
              </div>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="sticky top-0 pt-3">
              <div className="course-detail-image h-60">
                <ImageCom
                  srcSet={courseBySlug?.image}
                  alt="Default Course Detail Thumb"
                ></ImageCom>
              </div>
              <GapYCom></GapYCom>
              <div className="text-center mx-auto">
                {courseBySlug?.price === 0 ? (
                  <HeadingH2Com className="text-tw-light-pink !text-3xl">
                    Free Course
                  </HeadingH2Com>
                ) : (
                  <HeadingH2Com className="!text-3xl">
                    Buy only{" "}
                    <span className="text-tw-light-pink">
                      $
                      {courseBySlug?.net_price > 0
                        ? convertIntToStrMoney(courseBySlug?.net_price)
                        : convertIntToStrMoney(courseBySlug?.price)}
                    </span>
                  </HeadingH2Com>
                )}
                <GapYCom></GapYCom>
                {/* <Link
                  to={
                    courseBySlug?.price === 0
                      ? `/learn/${slug}`
                      : `/checkout/${slug}`
                  }
                >
                </Link> */}
                <ButtonCom
                  isLoading={isLoading}
                  backgroundColor="gradient"
                  onClick={() => handleEnroll()}
                >
                  Enrolling Now
                </ButtonCom>
                <GapYCom></GapYCom>
                <div className="pl-[10.5rem] mx-auto text-start text-sm">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2">
                      {courseBySlug?.level === 1 ? (
                        <>
                          <IconCircleCom className="text-tw-danger bg-tw-danger rounded-full"></IconCircleCom>
                          <div className="flex-1">Advance Course</div>
                        </>
                      ) : (
                        <>
                          <IconCircleCom className="text-tw-success bg-tw-success rounded-full"></IconCircleCom>
                          <div className="flex-1">Basic Course</div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-x-2">
                      <IconLearnCom className="text-tw-info"></IconLearnCom>
                      <div className="flex-1">
                        Total:{" "}
                        <span className="font-medium">
                          {learning?.lessonDto.length}
                        </span>{" "}
                        lessons
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <IconClockCom className="text-tw-primary"></IconClockCom>
                      <div className="flex-1">
                        Time learning:{" "}
                        <span className="font-medium">
                          {convertSecondToDiffForHumans(courseBySlug?.duration)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <IconStarCom className="text-tw-warning"></IconStarCom>
                      <div className="flex-1">
                        Rating:{" "}
                        <span className="font-medium">
                          {courseBySlug?.rating} / 5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <IconImportantCom className="text-tw-danger"></IconImportantCom>
                      <div className="flex-1">
                        Requirement:{" "}
                        {courseBySlug?.requirement ? (
                          <span className="font-medium">
                            {courseBySlug?.requirement}
                          </span>
                        ) : (
                          <span className="font-medium">No</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GapYCom></GapYCom>
        {/* Free Course */}
        <HeadingH2Com
          className="text-tw-primary"
          number={newRelatedCourse && newRelatedCourse.length}
        >
          Related Course
        </HeadingH2Com>
        <GapYCom></GapYCom>
        <CourseGridMod>
          {newRelatedCourse && newRelatedCourse.length > 0 ? (
            newRelatedCourse.map((course, index) => {
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
            })
          ) : (
            <EmptyDataCom text="No data" />
          )}
        </CourseGridMod>
        {newRelatedCourse.length > relatedCourseLimitPage && (
          <Pagination
            current={currentPage}
            defaultPageSize={relatedCourseLimitPage}
            total={newRelatedCourse.length}
            onChange={handleChangePage}
            className="mt-[1rem] text-end"
          />
        )}
      </div>
    </>
  );
};

export const ArchiveItems = ({ title }) => (
  <div className="archive-item col-sm-6 mb-3">
    <div className="flex gap-x-2 items-center">
      <IconCheckCom className="text-tw-success"></IconCheckCom>
      <p className="flex-1 bg-gradient-to-r from-tw-light-pink to-tw-primary bg-clip-text text-transparent hover:text-black">
        {title}
      </p>
    </div>
  </div>
);

export default CourseDetailPage;
