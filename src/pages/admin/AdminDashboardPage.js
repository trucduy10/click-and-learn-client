import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { SelectDefaultAntCom, SpinAntCom } from "../../components/ant";
import { BreadcrumbCom } from "../../components/breadcrumb";
import { ButtonCom } from "../../components/button";
import CardItemModalCom from "../../components/common/card/CardItemModalCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH2Com } from "../../components/heading";
import {
  IconAdminCom,
  IconBlogCom,
  IconLearnCom,
  IconMoneyCom,
  IconUserCom,
} from "../../components/icon";
import { ImageCom } from "../../components/image";
import { ChartsMuiCom } from "../../components/mui";
import {
  RowBlogItem,
  RowCourseItem,
  RowUserItem,
} from "../../components/table/dashboard";
import { categoryItems, sortItems } from "../../constants/config";
import {
  ALLOWED_ADMIN_MANAGER,
  ALLOWED_ADMIN_MANAGER_EMPLOYEE,
  EMPLOYEE_ROLE,
  TITLE_POSITION_LIST,
} from "../../constants/permissions";
import useShowMore from "../../hooks/useShowMore";
import { onGetBlogsForAdmin } from "../../store/admin/blog/blogSlice";
import { onGetCourses } from "../../store/admin/course/courseSlice";
import { onGetAllUsers, onGetUsers } from "../../store/admin/user/userSlice";
import { selectAllDashboardState } from "../../store/dashboard/dashboardSelector";
import { onLoadDashboard } from "../../store/dashboard/dashboardSlice";
import {
  convertDateTime,
  convertIntToStrMoney,
  formatNumber,
  getEmployeePermission,
} from "../../utils/helper";

const adminMenuItems = [
  {
    id: 1,
    title: "Learn",
    slug: "/admin/courses",
    permission: ALLOWED_ADMIN_MANAGER_EMPLOYEE,
    area: ["COURSE", "EXAM"],
    icon: <IconLearnCom className="mx-auto" />,
  },
  {
    id: 2,
    title: "User",
    slug: "/admin/users",
    permission: ALLOWED_ADMIN_MANAGER,
    area: ["USER"],
    icon: <IconUserCom className="mx-auto" />,
  },
  {
    id: 3,
    title: "Blog",
    slug: "/admin/blogs",
    permission: ALLOWED_ADMIN_MANAGER_EMPLOYEE,
    area: ["BLOG"],
    icon: <IconBlogCom className="mx-auto" />,
  },
];

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  let empPermissions = getEmployeePermission(user);

  const [orderUser, setOrderUser] = useState("DESC");
  const [orderCourse, setOrderCourse] = useState(1);
  const [orderBlog, setOrderBlog] = useState("DESC");

  const { dashboard } = useSelector(selectAllDashboardState);
  const {
    usersAllRole,
    isPostUserSuccess,
    isLoading: isUserLoading,
  } = useSelector((state) => state.user);

  const {
    courses,
    isLoading: isCourseLoading,
    isUpdateCourseSuccess,
  } = useSelector((state) => state.adminCourse);

  const {
    adminBlogs: blogs,
    isLoading: isBlogLoading,
    isPostBlogSuccess,
  } = useSelector((state) => state.adminBlog);
  const [sortUsers, setSortUsers] = useState([]);
  const [sortCourses, setSortCourses] = useState([]);
  const [sortBlogs, setSortBlogs] = useState([]);

  const handleChangeSortUser = (value) => {
    setOrderUser(value);
  };

  const handleChangeSortCourse = (value) => {
    setOrderCourse(value);
  };

  const handleChangeSortBlog = (value) => {
    setOrderBlog(value);
  };

  useEffect(() => {
    dispatch(onGetUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostUserSuccess]);

  useEffect(() => {
    dispatch(onGetAllUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostUserSuccess]);

  useEffect(() => {
    dispatch(onGetCourses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateCourseSuccess]);

  useEffect(() => {
    dispatch(onGetBlogsForAdmin());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostBlogSuccess]);

  // const currentDate = getCurrentDate();
  // const usersRegisteredToday = users.filter((item, index) => {
  //   const userCreatedAt = new Date(item?.created_at);
  //   const userCreatedDateString = userCreatedAt.toISOString().split("T")[0];
  //   return userCreatedDateString === currentDate && item?.role === "USER";
  // });

  useEffect(() => {
    dispatch(onLoadDashboard());
  }, [dispatch]);

  // Handle Sort Users
  useEffect(() => {
    // After fetching, sort users by status
    if (usersAllRole) {
      const filteredUsers = usersAllRole.filter(
        (item) => item.role === "EMPLOYEE"
      );
      const sortUsers = [...filteredUsers].sort((a, b) => {
        const compareStatus = Number(a.status) - Number(b.status);
        if (compareStatus !== 0) return compareStatus;

        return orderUser === "ASC"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      });
      setSortUsers(sortUsers);
    }
  }, [usersAllRole, orderUser]);

  // Sort Course
  useEffect(() => {
    // After fetching, sort Course by status and category ID
    if (courses) {
      const filterCourses = [...courses].sort((a, b) => {
        const compareStatus = Number(a.status) - Number(b.status);
        if (compareStatus !== 0) return compareStatus;

        if (orderCourse === a.category_id) {
          return -1; // Sort a before b
        } else if (orderCourse === b.category_id) {
          return 1; // Sort b before a
        }

        return 0; // Preserve the existing order
      });

      setSortCourses(filterCourses);
    }
  }, [courses, orderCourse]);

  // Sort Blog
  useEffect(() => {
    if (blogs) {
      // Get all blog which have status 1 && 2
      const filteredBlogs = blogs.filter((blog) =>
        [1, 2].includes(blog.status)
      );

      const sortBlogs = filteredBlogs.sort((a, b) => {
        if (a.status === b.status) {
          return orderBlog === "ASC"
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at);
        } else {
          return a.status === 2 ? -1 : 1;
        }
      });

      setSortBlogs(sortBlogs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, orderBlog]);

  const { showItems, isRemain, handleShowMore } = useShowMore(sortUsers);
  const {
    showItems: showCourseItems,
    isRemain: isCourseRemain,
    handleShowMore: handleShowMoreCourse,
  } = useShowMore(sortCourses);

  const {
    showItems: showBlogItems,
    isRemain: isBlogRemain,
    handleShowMore: handleShowMoreBlog,
  } = useShowMore(sortBlogs);

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Dashboard</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              isActive: true,
            },
          ]}
        />
      </div>

      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-md-10 col-xl-11 relative">
          <div className="card earning-card">
            <div className="card-body p-0">
              <div className="row border-top m-0 bg-tw-dark text-white rounded-2xl text-center 2xl:!text-left">
                <div
                  className={user?.role === EMPLOYEE_ROLE ? "col-6" : "col-3"}
                >
                  <CardItemModalCom title="Total Users" icon={<IconUserCom />}>
                    {formatNumber(dashboard.totalUser ?? 0)} accounts
                  </CardItemModalCom>
                </div>
                <div
                  className={user?.role === EMPLOYEE_ROLE ? "col-6" : "col-3"}
                >
                  <CardItemModalCom
                    title="Today Registered"
                    icon={<IconUserCom />}
                    classNameIcon="!bg-tw-light-pink"
                  >
                    {formatNumber(dashboard?.todayRegister ?? 0)}{" "}
                    {dashboard?.todayRegister > 1 ? "accounts" : "account"}
                  </CardItemModalCom>
                </div>
                {ALLOWED_ADMIN_MANAGER.includes(user?.role) && (
                  <>
                    <div className="col-3">
                      <CardItemModalCom
                        title="Total Revenue"
                        icon={<IconMoneyCom />}
                      >
                        ${convertIntToStrMoney(dashboard?.yearRevenue)} this
                        year
                      </CardItemModalCom>
                    </div>
                    <div className="col-3">
                      <CardItemModalCom
                        title="Total Revenue"
                        icon={<IconMoneyCom />}
                        classNameIcon="!bg-tw-light-pink"
                      >
                        ${convertIntToStrMoney(dashboard?.monthRevenue)} this
                        month
                      </CardItemModalCom>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header text-center">
                  <h5 className="font-[600] text-2xl">
                    Hi,{" "}
                    <span className="text-tw-danger">{user?.first_name} !</span>{" "}
                    Hope you have a nice working day !
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="w-20 h-20 mx-auto">
                        <ImageCom srcSet={user?.imageUrl} />
                      </div>
                    </div>
                    <div className="col-xl-9">
                      <p className="text-xl">
                        Fullname:{" "}
                        <span className="text-tw-light-pink">{user?.name}</span>
                      </p>
                      <p className="text-xl">
                        Position:{" "}
                        <span className="text-tw-light-pink">
                          {(() => {
                            const newItem = TITLE_POSITION_LIST.find((item) => {
                              if (ALLOWED_ADMIN_MANAGER.includes(user?.role)) {
                                return item;
                              } else if (
                                empPermissions.includes(item.permission)
                              ) {
                                return item;
                              }
                              return null;
                            });
                            return newItem ? newItem.title : "N/A";
                          })()}
                        </span>
                      </p>
                      <p className="text-xl">
                        Start date:{" "}
                        <span className="text-tw-light-pink">
                          {convertDateTime(user?.created_at)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {ALLOWED_ADMIN_MANAGER.includes(user?.role) && (
              <>
                <div className="col-xl-5 appointment">
                  <div className="card">
                    <div className="card-header card-no-border">
                      <div className="header-top">
                        <h5 className="m-0">Employee</h5>
                        <div className="card-header-right-icon">
                          <div>
                            <SelectDefaultAntCom
                              listItems={sortItems}
                              defaultValue={sortItems[0].value}
                              value={orderUser}
                              onChange={handleChangeSortUser}
                              className="custom-dropdown"
                            ></SelectDefaultAntCom>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      {isUserLoading ? (
                        <SpinAntCom loadingText={"Loading ..."} />
                      ) : (
                        <div className="appointment-table table-responsive">
                          <table className="table table-bordernone">
                            <tbody>
                              {showItems?.length > 0 &&
                                showItems.map((item) => {
                                  return (
                                    <RowUserItem
                                      key={item?.id}
                                      item={item}
                                      users={usersAllRole}
                                    />
                                  );
                                })}
                            </tbody>
                          </table>
                          {isRemain && (
                            <ButtonCom
                              className="w-full mt-2"
                              onClick={handleShowMore}
                            >
                              Show more
                            </ButtonCom>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xl-7 appointment">
                  <div className="card">
                    <div className="card-header card-no-border">
                      <div className="header-top">
                        <h5 className="m-0">Course</h5>
                        <div className="card-header-right-icon">
                          <div>
                            <SelectDefaultAntCom
                              listItems={categoryItems}
                              defaultValue={categoryItems[0].label}
                              value={orderCourse}
                              onChange={handleChangeSortCourse}
                              className="custom-dropdown"
                            ></SelectDefaultAntCom>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      {isCourseLoading ? (
                        <SpinAntCom loadingText={"Loading ..."} />
                      ) : (
                        <div className="appointment-table table-responsive">
                          <table className="table table-bordernone">
                            <tbody>
                              {showCourseItems?.length > 0 &&
                                showCourseItems.map((item) => (
                                  <RowCourseItem
                                    item={item}
                                    courses={courses}
                                    key={item?.id}
                                  />
                                ))}
                            </tbody>
                          </table>
                          {isCourseRemain && (
                            <ButtonCom
                              className="w-full mt-2"
                              onClick={handleShowMoreCourse}
                            >
                              Show more
                            </ButtonCom>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {(ALLOWED_ADMIN_MANAGER.includes(user?.role) ||
              user?.permissions.includes("EMP_BLOG")) && (
              <div className="col-xl-12 appointment">
                <div className="card">
                  <div className="card-header card-no-border">
                    <div className="header-top">
                      <h5 className="m-0">Blog</h5>
                      <div className="card-header-right-icon">
                        <div>
                          <SelectDefaultAntCom
                            listItems={sortItems}
                            defaultValue={sortItems[0].value}
                            value={orderBlog}
                            onChange={handleChangeSortBlog}
                            className="custom-dropdown"
                          ></SelectDefaultAntCom>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    {isBlogLoading ? (
                      <SpinAntCom loadingText={"Loading ..."} />
                    ) : (
                      <div className="appointment-table table-responsive">
                        <table className="table table-bordernone">
                          <tbody>
                            {showBlogItems?.length > 0 &&
                              showBlogItems.map((item) => (
                                <RowBlogItem
                                  key={item?.id}
                                  item={item}
                                  blogs={blogs}
                                />
                              ))}
                          </tbody>
                        </table>
                        {isBlogRemain && (
                          <ButtonCom
                            className="w-full mt-2"
                            onClick={handleShowMoreBlog}
                          >
                            Show more
                          </ButtonCom>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-2 col-xl-1 p-0 flex flex-col">
          <div className="flex-grow">
            <div className="card bg-tw-dark h-full relative">
              <div className="card-header !py-5 px-0 !bg-tw-primary shadow-primary">
                <HeadingH2Com className="text-white text-center flex justify-center w-10 mx-auto">
                  <IconAdminCom />
                </HeadingH2Com>
              </div>
              <div className="card-body mx-auto p-0">
                <div className="sticky top-0 py-10">
                  {adminMenuItems.map((item, index) => {
                    if (user?.role && !item.permission.includes(user.role)) {
                      return null;
                    } else {
                      const empPermissions = getEmployeePermission(user);
                      if (empPermissions && empPermissions.length > 0) {
                        const empPer = empPermissions.find((empPer) =>
                          item.area.includes(empPer)
                        );
                        if (!empPer) return null;
                      }

                      return (
                        <AdminMenuItems
                          key={item.id}
                          item={item}
                          isLastItem={index === adminMenuItems.length - 1}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {ALLOWED_ADMIN_MANAGER.includes(user?.role) && (
        <Paper
          square
          elevation={5}
          sx={{
            padding: "20px",
            width: "100%",
            mt: "20px",
            borderRadius: "10px",
          }}
        >
          <ChartsMuiCom />
        </Paper>
      )}
    </>
  );
};

const AdminMenuItems = ({ item, isLastItem = false }) => {
  return (
    <div className={`${isLastItem ? "" : "mb-3"}`}>
      <NavLink to={item.slug}>
        <ButtonCom
          className="px-3 py-2 w-20"
          minHeight="xs:min-h-[24px] md:min-h-[36px] xl:min-h-[42px]"
          backgroundColor="pink"
        >
          {item.icon}
          <span>{item.title}</span>
        </ButtonCom>
      </NavLink>
    </div>
  );
};

export default AdminDashboardPage;
