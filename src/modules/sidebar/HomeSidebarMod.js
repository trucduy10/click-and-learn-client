import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  IconAdminCom,
  IconAuthorCom,
  IconBlogCom,
  IconCategoryCom,
  IconHomeCom,
  IconLearnCom,
} from "../../components/icon";
import { ALLOWED_ADMIN_MANAGER_EMPLOYEE } from "../../constants/permissions";

const HomeSidebarMod = () => {
  const { user } = useSelector((state) => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);
  // const navLinkClass =
  //   "tw-transition-all text-center block p-3 rounded-xl last:mt-auto last:shadow-primary bg-tw-light text-tw-primary hover:text-tw-light-pink bg-transparent";

  useEffect(() => {
    function handleScroll() {
      const sidebar = document.querySelector(".sidebar");
      if (!sidebar) return;
      const { top } = sidebar.getBoundingClientRect();
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const actualTop = top + scrollY;
      if (actualTop > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div className="sidebar-hidden hidden md:block w-full md:w-[76px]"></div>
      <div
        className={`${
          isScrolled
            ? "sidebar fixed hidden md:flex flex-col flex-shrink-0 animate-slide-in w-full md:w-[76px] rounded-lg bg-tw-light shadow-2xl text-center text-xs bg-transparent z-10"
            : "sidebar fixed hidden md:flex flex-col flex-shrink-0 w-full md:w-[76px] rounded-lg bg-tw-light shadow-primary text-center text-xs bg-transparent z-10"
        }`}
      >
        {sidebarItems().map((item) => {
          if (item.url === "/admin") {
            if (user && ALLOWED_ADMIN_MANAGER_EMPLOYEE.includes(user.role)) {
              return <SidebarItem key={item.url} item={item} />;
            }
          } else {
            return <SidebarItem key={item.url} item={item} />;
          }
          return null;
        })}
      </div>
    </>
  );
};

export const sidebarItems = () => [
  {
    icon: <IconHomeCom className="mx-auto" />,
    title: "Home",
    url: "/",
  },
  {
    icon: <IconAuthorCom className="mx-auto text-2xl" />,
    title: "Author",
    url: "/authors",
  },
  {
    icon: <IconCategoryCom className="mx-auto" />,
    title: "Cate",
    url: "/categories",
  },
  {
    icon: <IconLearnCom className="mx-auto" />,
    title: "Course",
    url: "/courses",
  },
  {
    icon: <IconBlogCom className="mx-auto" />,
    title: "Blog",
    url: "/blogs",
  },
  {
    icon: <IconAdminCom className="mx-auto" />,
    title: "Admin",
    url: "/admin",
  },
  // {
  //   icon: <IconMoonCom className="mx-auto" />,
  //   title: "Mode",
  //   url: "/mode",
  //   onClick: () => {},
  // },
];

export const SidebarItem = ({ item }) => {
  const navLinkClass =
    "tw-transition-all text-center block p-3 rounded-xl last:mt-auto last:shadow-primary bg-tw-light text-tw-primary hover:text-tw-light-pink bg-transparent";

  return (
    <NavLink
      key={item.title}
      className={({ isActive }) =>
        isActive
          ? `active ${navLinkClass} bg-gray-200 !text-tw-light-pink`
          : navLinkClass
      }
      to={item.url}
    >
      <span>{item.icon}</span>
      <div className="mt-1">{item.title}</div>
    </NavLink>
  );
};

export default HomeSidebarMod;
