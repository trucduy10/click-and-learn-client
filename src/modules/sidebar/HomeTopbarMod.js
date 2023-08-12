import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ButtonCom } from "../../components/button";
import {
  CircularProgressMuiCom,
  NotificationListPopupMuiCom,
  NotificationToastListMuiCom,
} from "../../components/mui";
import { selectAllCourseState } from "../../store/course/courseSelector";
import HomeSearchMod from "../search/HomeSearchMod";
import { HomeTopbarUserProfileMod } from "./user";

const HomeTopbarMod = () => {
  const { user } = useSelector((state) => state.auth);
  const { progress } = useSelector(selectAllCourseState);
  const location = useLocation();
  const isLearnPage = location.pathname.startsWith("/learn");
  const dispatch = useDispatch();

  return (
    <div className="topbar hidden md:flex items-center justify-between mb-8 pl-[14px]">
      <NotificationToastListMuiCom></NotificationToastListMuiCom>
      <div>
        <Link to="/" className="inline-block">
          <img
            srcSet="/logo_click_thumb_light.png"
            className="w-12 h-12"
            alt="Click And Learn Logo"
          />
        </Link>
      </div>
      {!isLearnPage && (
        <div className="w-full max-w-[400px]">
          <HomeSearchMod></HomeSearchMod>
        </div>
      )}

      <div className="flex items-center justify-between gap-x-5">
        {isLearnPage &&
          (progress ? (
            <Button
              variant="contained"
              size="small"
              sx={{
                background:
                  "linear-gradient(to right, #0f0c29, #302b63, #24243e);",
              }}
            >
              <CircularProgressMuiCom value={progress} />
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{
                background:
                  "linear-gradient(to right, #0f0c29, #302b63, #24243e);",
              }}
            >
              <CircularProgressMuiCom value={0.3} />
            </Button>
          ))}
        {user && (
          <React.Fragment>
            <ButtonCom to="/my-courses" className="flex items-center">
              <span className="text-sm font-medium">My Courses</span>
            </ButtonCom>
            <NotificationListPopupMuiCom />
          </React.Fragment>
        )}

        <HomeTopbarUserProfileMod />
      </div>
    </div>
  );
};

export default HomeTopbarMod;
