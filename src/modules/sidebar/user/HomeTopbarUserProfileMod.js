import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IconCertificateCom,
  IconInvoiceCom,
  IconLoginCom,
  IconLogoutCom,
  IconRefreshCom,
  IconRegisterCom,
  IconUserCom,
} from "../../../components/icon";
import { ImageCom } from "../../../components/image";
import {
  AVATAR_DEFAULT,
  BASE_API_URL,
  IMAGE_DEFAULT,
  MESSAGE_LOGOUT_SUCCESS,
} from "../../../constants/config";
import { onRemoveToken } from "../../../store/auth/authSlice";
import {
  onAuthorInitialState,
  onGetAuthors,
} from "../../../store/author/authorSlice";
import { onCategoryInitialState } from "../../../store/category/categorySlice";
import { selectAllCourseState } from "../../../store/course/courseSelector";
import {
  onAddNotification,
  onCourseInitalState,
} from "../../../store/course/courseSlice";
import { getUserNameByEmail, sliceText } from "../../../utils/helper";

const HomeTopbarUserProfileMod = () => {
  const { user } = useSelector((state) => state.auth);
  const { notifs } = useSelector(selectAllCourseState);
  const userName = getUserNameByEmail(user?.email);

  const dispatch = useDispatch();
  // Ẩn notification tạm thời
  useEffect(() => {
    if (user) {
      let url = BASE_API_URL + "/push-notifications/" + user.id;
      const sse = new EventSource(url);

      sse.addEventListener("user-list-event", (event) => {
        const data = JSON.parse(event.data);
        if (JSON.stringify(data) !== JSON.stringify(notifs)) {
          dispatch(onAddNotification(data));
        }
      });

      sse.onerror = () => {
        sse.close();
      };
      return () => {
        sse.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ul className="nav-menus">
      <li className="onhover-dropdown p-0 me-0 relative">
        <div className="profile-nav-bridge absolute h-5 -bottom-2 w-full"></div>
        <div className="media profile-media gap-x-2">
          <ImageCom
            className="object-cover rounded-full w-12 h-12"
            srcSet={`${user ? user.imageUrl || AVATAR_DEFAULT : IMAGE_DEFAULT}`}
            alt="User Avatar"
          />
          <div className="media-body flex-1">
            <span className="text-tw-primary font-medium font-tw-third">
              {user ? sliceText(user.name, 12) : "Welcome"}
            </span>
            <p className="mb-0 font-roboto flex items-center gap-x-2">
              {user ? user.role : "Guest"}
              <i className="middle fa fa-angle-down flex-1"></i>
            </p>
          </div>
        </div>
        <ul className="profile-dropdown onhover-show-div active top-14 left-auto right-0 w-[10.5rem] z-20">
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
        </ul>
      </li>
    </ul>
  );
};

export const userMenuItems = (userName) => [
  {
    icon: <IconUserCom />,
    title: "Profile",
    url: `/profile/${userName}`,
  },
  {
    icon: <IconRefreshCom />,
    title: "Password",
    url: `/profile/change-password`,
  },
  {
    icon: <IconCertificateCom />,
    title: "Certificate",
    url: `/profile/accomplishments`,
  },
  {
    icon: <IconInvoiceCom />,
    title: "Purchase",
    url: `/profile/order-history`,
  },
  {
    icon: <IconLoginCom />,
    title: "Log in",
    url: "/login",
  },
  {
    icon: <IconRegisterCom />,
    title: "Register",
    url: "/register",
  },
  {
    icon: <IconLogoutCom />,
    title: "Log out",
    url: "/logout",
  },
];

export const UserItems = ({
  url = "/",
  title = "",
  icon = <IconUserCom />,
  ...rest
}) => {
  return (
    <li>
      <Link
        to={url}
        className="flex items-center gap-x-2 py-2 px-3 hover:border-l-8  hover:border-tw-primary duration-200 transition-all hover:bg-tw-light hover:text-tw-primary"
        {...rest}
      >
        {icon}
        <span className="flex-1">{title}</span>
      </Link>
    </li>
  );
};

export default HomeTopbarUserProfileMod;
