import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../store/auth/authSelector";
import {
  onReadAllNotification,
  onReadNotification,
} from "../../store/course/courseSlice";
import { convertSecondToDiffForHumans } from "../../utils/helper";
import { HeadingH3Com } from "../heading";
import { useNavigate } from "react-router-dom";

const NotificationListMuiCom = ({ notifs }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userToId = useSelector(selectUserId);
  const handleReadNotification = (notifId) => {
    dispatch(onReadNotification(notifId));
  };

  const handleReadAllNotifications = () => {
    dispatch(onReadAllNotification(userToId));
  };

  const handleOpenNotifications = () => {
    // dispatch(onReadAllNotification(userToId));
    navigate("/notification");
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          borderRadius: 2,
          padding: "5px",
          position: "relative",
        }}
      >
        {notifs.length === 0 ? (
          <HeadingH3Com className="text-black text-4xl text-center py-10">
            No new notifications.
          </HeadingH3Com>
        ) : (
          notifs.map((notif, i) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => handleReadNotification(notif.id)}
                sx={{
                  bgcolor: notif.read ? "#fff" : "#757575",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: notif.read ? "#f0f0f0" : "#616161",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={notif.userFrom.first_name}
                    src={notif.userFrom.imageUrl}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{
                          display: "inline",
                          color: notif.read ? "black" : "#fff",
                        }}
                        component="span"
                        variant="body2"
                      >
                        {notif.read ? (
                          notif.userFrom.first_name
                        ) : (
                          <React.Fragment>
                            {notif.userFrom.first_name}{" "}
                            <strong style={{ color: "violet" }}>unread</strong>
                          </React.Fragment>
                        )}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      {notif.content}
                      <Typography
                        sx={{
                          display: "inline",
                          color: notif.read ? "black" : "#cfc6d5",
                        }}
                        component="span"
                        variant="body2"
                      >
                        <br></br>
                        {convertSecondToDiffForHumans(
                          Math.floor(Date.now() / 1000) -
                            Math.floor(
                              new Date(notif.created_at).getTime() / 1000
                            ),
                          "noti"
                        )}{" "}
                        ago...
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {i === notifs.length - 1 ? null : (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))
        )}
        <ListItem>
          <Grid
            container
            justifyContent="center"
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={6} sm={6} md={6}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.primary",
                      fontSize: "14px",
                      "&:hover": {
                        color: "violet",
                      },
                      textAlign: "center",
                    }}
                    onClick={handleReadAllNotifications}
                  >
                    <strong>Mark all as read</strong>
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.primary",
                      fontSize: "14px",
                      "&:hover": {
                        color: "violet",
                      },
                      textAlign: "center",
                    }}
                    onClick={handleOpenNotifications}
                  >
                    <strong>Open notifications</strong>
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </>
  );
};

export default NotificationListMuiCom;
