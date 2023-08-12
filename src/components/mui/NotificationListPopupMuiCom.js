import { Badge } from "antd";
import React, { useEffect, useState } from "react";
import { IconBellCom } from "../icon";
import { useSelector } from "react-redux";
import { selectAllCourseState } from "../../store/course/courseSelector";
import { useLocation } from "react-router-dom";
import { NotificationListMuiCom } from ".";

const NotificationListPopupMuiCom = () => {
  const [showNotif, setShowNotif] = useState(false);
  const { notifs } = useSelector(selectAllCourseState);
  const isReadNotif = notifs.filter((n) => n.read !== true);
  const location = useLocation();

  useEffect(() => {
    setShowNotif(false);
  }, [location]);

  return (
    <ul className="nav-menus">
      <li className="profile-nav onhover-dropdown p-0 me-0 relative">
        <div className="profile-nav-bridge absolute h-5 -bottom-2 w-full"></div>
        <div
          className="media profile-media gap-x-2"
          onClick={() => setShowNotif(!showNotif)}
        >
          <Badge count={isReadNotif.length} showZero={false}>
            <IconBellCom></IconBellCom>
          </Badge>
        </div>
        {showNotif ? (
          <ul
            style={{
              position: "absolute",
              zIndex: 999,
              top: 40,
              right: 10,
              width: 360,
            }}
          >
            <NotificationListMuiCom notifs={notifs}></NotificationListMuiCom>
          </ul>
        ) : null}
      </li>
    </ul>
  );
};

export default NotificationListPopupMuiCom;
