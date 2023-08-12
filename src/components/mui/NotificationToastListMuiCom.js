import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllCourseState } from "../../store/course/courseSelector";
import { onRemoveFromToastList } from "../../store/course/courseSlice";

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const NotificationToastListMuiCom = () => {
  const dispatch = useDispatch();
  const { notifToastList } = useSelector(selectAllCourseState);
  const user = useSelector(selectUser);

  const [newNotif, setNewNotif] = useState([]);

  const [openStates, setOpenStates] = useState(false);

  const prevNotifListLengthRef = useRef(notifToastList?.length);

  useEffect(() => {
    if (
      user?.id > 0 &&
      notifToastList?.length > 0 &&
      notifToastList?.length > prevNotifListLengthRef.current
    ) {
      const isReadNotif = notifToastList.filter(
        (notif) => notif.read === false
      );

      setNewNotif(isReadNotif[isReadNotif.length - 1]);
    }
    prevNotifListLengthRef.current = notifToastList?.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, notifToastList?.length]);

  // const handleOpen = (toast) => () => {
  //   if (toast.length > 0) {
  //     setOpenStates((prevOpenStates) =>
  //       prevOpenStates.map((state, i) => (i === index ? true : state))
  //     );
  //   }
  //   dispatch(onRemoveFromToastList(toast));
  // };

  const handleClose = (toast) => () => {
    dispatch(onRemoveFromToastList(toast));
    setOpenStates(false);
    // setOpenStates((prevOpenStates) =>
    //   prevOpenStates.map((state, i) => (i === index ? false : state))
    // );
  };

  useEffect(() => {
    if ((user?.id > 0 && newNotif?.length === 0) || newNotif === undefined) {
      setOpenStates(false);
      // setOpenStates(notifToastList ? notifToastList.map(() => false) : []);
    }

    if (user?.id > 0 && newNotif?.length !== 0 && newNotif !== undefined) {
      setOpenStates(true);
    }
  }, [newNotif, user?.id]);

  return (
    <Snackbar
      open={openStates}
      // onClose={() => dispatch(onRemoveFromToastList(newNotif))}
      onClose={handleClose(newNotif)}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      style={{
        position: "absolute",
        bottom: 20,
        //  + index * 50
      }}
      TransitionComponent={TransitionUp}
      message={newNotif?.content}
    />
  );
};

export default NotificationToastListMuiCom;
