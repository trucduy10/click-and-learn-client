import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AlertAntCom } from "../../components/ant";
import { EMPLOYEE_ROLE, USER_ROLE } from "../../constants/permissions";
import { MESSAGE_LOGIN_REQUIRED } from "../../constants/config";
import { getEmployeePermission } from "../../utils/helper";
import { onGetLastUrlAccess } from "../../store/auth/authSlice";

const pathItems = [
  {
    type: "COURSE",
    allowedPath: "/admin/courses",
    endPath: [],
  },
  {
    type: "BLOG",
    allowedPath: "/admin/blogs",
    endPath: [],
  },
  {
    type: "EXAM",
    allowedPath: "/admin/courses",
    endPath: ["parts", "questions", "answers"],
  },
];

const CheckAuthPage = ({ allowPermissions = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const userRole = user?.role || USER_ROLE;
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (!user && currentPath !== "/login") {
      dispatch(onGetLastUrlAccess(currentPath));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPath]);

  if (allowPermissions?.includes(userRole)) {
    const empPermissions = getEmployeePermission(user);
    if (userRole === EMPLOYEE_ROLE && empPermissions?.length > 0) {
      if (currentPath === "/admin") return <Outlet />;

      for (let empPer of empPermissions) {
        const empPathItem = pathItems.find(
          (pathItem) => pathItem.type === empPer
        );
        // Nếu sau có dùng "EXAM", bỏ dòng dưới và mở comment bên dưới nữa
        if (empPathItem && empPathItem.type === empPer) {
          if (currentPath.includes(empPathItem.allowedPath)) return <Outlet />;
        }
        // if (!empPer === "EXAM" && empPathItem && empPathItem.type === empPer) {
        //   if (currentPath.includes(empPathItem.allowedPath)) return <Outlet />;
        // }
        // // Trường hợp nếu role là "EXAM",
        // if (empPer === "EXAM") {
        //   return <Outlet />;
        // }
      }
      return <Navigate to="/forbidden" replace state={{ from: location }} />;
    } else if (userRole === USER_ROLE) {
      // Bắt cho chắc
      return <Navigate to="/forbidden" replace state={{ from: location }} />;
    }

    return <Outlet />;
  } else if (user) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  } else {
    return (
      <>
        <AlertAntCom
          type="warning"
          message={MESSAGE_LOGIN_REQUIRED}
        ></AlertAntCom>
        <Navigate to="/login" replace state={{ from: location }} />
      </>
    );
  }
};

export default CheckAuthPage;
