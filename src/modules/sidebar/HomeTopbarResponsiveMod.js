import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ButtonCom } from "../../components/button";
import DividerCom from "../../components/common/DividerCom";
import { IconMenuCom } from "../../components/icon";
import { ImageCom } from "../../components/image";
import {
  AVATAR_DEFAULT,
  IMAGE_DEFAULT,
  MESSAGE_LOGOUT_SUCCESS,
} from "../../constants/config";
import { ALLOWED_ADMIN_MANAGER_EMPLOYEE } from "../../constants/permissions";
import { onRemoveToken } from "../../store/auth/authSlice";
import {
  onAuthorInitialState,
  onGetAuthors,
} from "../../store/author/authorSlice";
import { onCategoryInitialState } from "../../store/category/categorySlice";
import { onCourseInitalState } from "../../store/course/courseSlice";
import { getUserNameByEmail, sliceText } from "../../utils/helper";
import HomeSearchMod from "../search/HomeSearchMod";
import { SidebarItem, sidebarItems } from "./HomeSidebarMod";
import { HomeTopbarUserProfileMod } from "./user";
import { UserItems, userMenuItems } from "./user/HomeTopbarUserProfileMod";

const HomeTopbarResponsiveMod = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const userName = getUserNameByEmail(user?.email);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [animation, setAnimation] = useState("");
  useEffect(() => {
    function handleScroll() {
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollY > prevScrollY) {
        // Scrolling down
        setIsShowMenu(false);
        setAnimation("slide-up");
      } else if (currentScrollY < prevScrollY) {
        // Scrolling up
        setIsShowMenu(false);
        setAnimation("slide-down");
      }

      setPrevScrollY(currentScrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);
  return (
    <>
      <div
        className={`${
          animation === "slide-up" ? "-translate-y-[100px]" : "translate-y-0"
        } fixed md:hidden left-0 top-0 w-full py-3 px-6 z-50 bg-white tw-transition-all`}
      >
        <div className="row md:hidden z-50">
          <div className="col-2">
            <ButtonCom
              className="p-3"
              onClick={() => setIsShowMenu(!isShowMenu)}
            >
              <IconMenuCom />
            </ButtonCom>
          </div>
          <div className="col-8">
            <HomeSearchMod></HomeSearchMod>
          </div>
          <div className="col-2 flex items-center justify-center p-0">
            <HomeTopbarUserProfileMod />
          </div>
        </div>
      </div>
      <div
        className={`${
          isShowMenu ? "translate-x-0 w-full h-full" : "-translate-x-[200px]"
        } tw-transition-all fixed z-40 bg-tw-light mt-16`}
        onClick={() => setIsShowMenu(false)}
      >
        <div className="flex items-center gap-x-2">
          <div>
            <ImageCom
              className="object-cover rounded-full w-12 h-12"
              srcSet={`${
                user ? user.imageUrl || AVATAR_DEFAULT : IMAGE_DEFAULT
              }`}
              alt="User Avatar"
            />
          </div>
          <div className="flex-1">
            <span className="text-tw-primary font-medium font-tw-third">
              {user ? sliceText(user.name, 12) : "Welcome"}
            </span>
            <p className="mb-0 font-roboto flex items-center gap-x-2">
              {user ? user.role : "Guest"}
              <i className="middle fa fa-angle-down flex-1"></i>
            </p>
          </div>
        </div>
        {/* <ul className="">
          {userMenuItems(userName).map((item, index) => {
            // If user is login, exclude "/register" and "/login" URLs
            if (user && (item.url === "/register" || item.url === "/login")) {
              return null;
            }
            // If user is login by OAuth
            if (
              user &&
              user.provider !== "local" &&
              item.url === "/profile/change-password"
            ) {
              return null;
            }
            // If user is login, and role is not USER exclude "/order-history"
            if (
              user &&
              user.role !== "USER" &&
              item.url === "/profile/order-history"
            ) {
              return null;
            }
            // If user is not login, exclude "/logout" URL
            if (
              !user &&
              (item.url === "/logout" ||
                item.url.includes("/profile") ||
                item.url === "/profile/change-password")
            ) {
              return null;
            }
            const rest =
              item.url === "/logout"
                ? {
                    onClick: () => {
                      toast.success(MESSAGE_LOGOUT_SUCCESS);
                      dispatch(onRemoveToken());
                      dispatch(onCategoryInitialState());
                      dispatch(onCourseInitalState());
                      dispatch(onAuthorInitialState());
                      dispatch(onGetAuthors());
                    },
                  }
                : {};

            return (
              <UserItems
                key={item.title}
                url={item.url}
                title={item.title}
                icon={item.icon}
                {...rest}
              ></UserItems>
            );
          })}
        </ul> */}
        <DividerCom />
        <ul>
          {sidebarItems().map((item) => {
            if (item.url === "/admin") {
              if (user && ALLOWED_ADMIN_MANAGER_EMPLOYEE.includes(user.role)) {
                return <SidebarItem item={item} />;
              }
            } else {
              return <SidebarItem item={item} />;
            }
            return null;
          })}
        </ul>
      </div>
    </>
  );
};

export default HomeTopbarResponsiveMod;
