import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ButtonCom } from "../../components/button";
import GapYCom from "../../components/common/GapYCom";
import LoadingCom from "../../components/common/LoadingCom";
import { IconTrashCom } from "../../components/icon";
import { TableCom } from "../../components/table";
import { selectAllCourseState } from "../../store/course/courseSelector";
import {
  onAllDeleteNotification,
  onAllNotification,
  onDeleteNotification,
} from "../../store/course/courseSlice";
import { convertSecondToDiffForHumans } from "../../utils/helper";

const NotificationListPage = () => {
  // Local State
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [search, setSearch] = useState("");

  const [filterNoti, setFilterNoti] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  //State Redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, isAllDeleteNotification } =
    useSelector(selectAllCourseState);

  const handleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const userToId = user.id;

  //manage status and event in form
  const { control, reset } = useForm({
    resolver: yupResolver(),
  });
  /********* Display Data ********* */
  function getNotificationListItem(row) {
    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={row.userFrom.first_name} src={row.userFrom.imageUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography component="span" variant="body2">
                <React.Fragment>{row.userFrom.first_name} </React.Fragment>
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              {row.content}
              <Typography component="span" variant="body2">
                <br />
                {convertSecondToDiffForHumans(
                  Math.floor(Date.now() / 1000) -
                    Math.floor(new Date(row.created_at).getTime() / 1000)
                )}{" "}
                ago...
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    );
  }

  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Notification",
      selector: (row) => getNotificationListItem(row),
      sortable: true,
      width: "400px",
    },
    {
      name: "Read",
      cell: (row) => (
        <strong style={{ color: row.read ? "blueviolet" : "violet" }}>
          {row.read ? "read" : "unread"}
        </strong>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDelete(row);
            }}
          >
            <IconTrashCom className="w-5"></IconTrashCom>
          </ButtonCom>
        </>
      ),
    },
  ];

  /********* More Action Menu ********* */
  const dropdownItems = [
    {
      key: "1",
      label: (
        <div
          rel="noopener noreferrer"
          className="hover:text-tw-danger transition-all duration-300"
          onClick={() => handleBulkDelete()}
        >
          Remove All
        </div>
      ),
    },
  ];
  /********* Search ********* */
  useEffect(() => {
    const result = notifications.filter((notif) => {
      const keys = Object.keys(notif);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = notif[key];
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        }
        if (
          typeof value === "number" &&
          String(value).toLowerCase() === search.toLowerCase()
        ) {
          return true;
        }
      }
      return false;
    });
    setFilterNoti(result);
  }, [notifications, search]);

  /********* Get All Notification ********* */
  useEffect(() => {
    if (user) {
      dispatch(onAllNotification({ userToId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && autoRefresh) {
      const timer = setInterval(
        () => dispatch(onAllNotification({ userToId })),
        2000
      );

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, autoRefresh]);

  useEffect(() => {
    if (isAllDeleteNotification) clearSelectedRows();
  }, [isAllDeleteNotification]);

  /********* Delete one API ********* */
  const clearSelectedRows = () => {
    setSelectedRows([]);
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleRowSelection = (currentRowsSelected) => {
    setSelectedRows(currentRowsSelected.selectedRows);
  };

  const handleDelete = (row) => {
    const { id, userFrom } = row;
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete blog: <span class="text-tw-danger">${userFrom.first_name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onDeleteNotification(id));
      }
    });
  };

  /********* Multi Delete API ********* */
  const handleBulkDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete all notifications",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) dispatch(onAllDeleteNotification(userToId));
    });
  };

  return (
    <>
      {isFetching && <LoadingCom />}
      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header py-3">
              <span>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        inputProps={{ "aria-label": "Checkbox demo" }}
                        checked={autoRefresh}
                        onChange={handleAutoRefresh}
                      />
                    }
                    label="Auto Refresh Notifications"
                  />
                </FormGroup>

                <TableCom
                  tableKey={tableKey}
                  title="All Notifications"
                  columns={columns}
                  items={filterNoti}
                  search={search}
                  setSearch={setSearch}
                  dropdownItems={dropdownItems}
                  selectableRows={false}
                ></TableCom>
              </span>
            </div>
            <div className="card-body flex gap-x-4 h-[50vh]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationListPage;
