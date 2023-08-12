import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const CheckUserLoginPage = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }}></Navigate>
  );
};

export default CheckUserLoginPage;
