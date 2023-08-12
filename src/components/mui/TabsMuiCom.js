import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Button,
  ButtonBase,
  Grid,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import momoImage from "../../assets/images/momo.png";
import paypalImage from "../../assets/images/paypal.png";
import { HeadingH3Com } from "../heading";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  onLoadInvoice,
  onLoadOrderHistory,
  onLoadOrderHistoryRefund,
  onSelectedInvoice,
} from "../../store/order/orderSlice";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllOrderState } from "../../store/order/orderSelector";
import moment from "moment";
import {
  selectAllCourseState,
  selectEnrollIdAndCourseId,
} from "../../store/course/courseSelector";
import { onGetEnrollId } from "../../store/course/courseSlice";
import { convertToHumanTime } from "../../utils/helper";
import SpinAntCom from "../ant/SpinAntCom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const colorMap = {
  PENDING: "#0074D9", // orange
  PROCESSING: "#FF851B", // orange
  COMPLETED: "#2ECC40", // green
  CANCELED: "#FF4136", // red
};

function TabsMuiCom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const { orderHistory, refund, isLoading } = useSelector(selectAllOrderState);
  const { isEnrolled } = useSelector(selectEnrollIdAndCourseId);
  const [value, setValue] = useState(0);
  const [rowId, setRowId] = useState(0);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    dispatch(onLoadOrderHistory({ pageNo: 0, pageSize: 6, userId: user.id }));
    dispatch(
      onLoadOrderHistoryRefund({ pageNo: 0, pageSize: 6, userId: user.id })
    );
  }, [dispatch, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isEnrolled && user?.role !== null && slug !== "") {
      navigate(`/learn/${slug}`);
    } else if (isEnrolled === false && slug !== "") {
      navigate(`/courses/${slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnrolled, slug]);

  const handleChangePage = async (_e, page) => {
    dispatch(
      onLoadOrderHistory({ pageNo: page - 1, pageSize: 6, userId: user.id })
    );
  };
  const handleChangePageRefund = async (_e, page) => {
    dispatch(
      onLoadOrderHistoryRefund({
        pageNo: page - 1,
        pageSize: 6,
        userId: user.id,
      })
    );
  };

  const handleClickCourse = (courseSlug, courseId) => {
    if (user && user.id > 0) {
      dispatch(onGetEnrollId({ course_id: courseId, user_id: user.id }));
    }
    setSlug(courseSlug);
  };

  const handleClickInvoice = (orderId) => {
    const invoice = orderHistory.content.find((o) => o.id === orderId);
    if (invoice) {
      dispatch(
        onLoadInvoice({
          courseName: invoice?.courseName,
          userName: invoice?.userName,
          transactionId: invoice?.transactionId,
          created_at: invoice?.created_at,
          price: invoice?.price,
          net_price: invoice?.net_price,
        })
      );
      setRowId(orderId);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Completed" {...a11yProps(0)} />
          <Tab label="Transaction History" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Paper
          square
          elevation={5}
          sx={{
            padding: "20px",
            width: "100%",
            mt: "20px",
            borderRadius: "10px",
          }}
        >
          {!orderHistory === null ||
          (orderHistory && orderHistory.content.length === 0) ? (
            <HeadingH3Com className="text-black text-4xl text-center py-10">
              Currently none purchased course.
            </HeadingH3Com>
          ) : (
            <React.Fragment>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Course</TableCell>
                      <TableCell align="left">Total</TableCell>
                      <TableCell align="left">Payment</TableCell>
                      <TableCell align="left">Date</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderHistory &&
                      orderHistory.content.map((o) => (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">
                            <ButtonBase
                              sx={{
                                transition: "transform 0.2s ease-out",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                                borderRadius: "10px",
                              }}
                              onClick={() => handleClickCourse(o.slug)}
                            >
                              <img
                                src={o.image}
                                alt={o.courseName}
                                style={{
                                  width: "90px",
                                  height: "55px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                }}
                              />
                              <Typography align="left" ml={3}>
                                {o.courseName}
                              </Typography>
                            </ButtonBase>
                          </TableCell>

                          <TableCell align="left">${o.net_price}</TableCell>
                          <TableCell align="left">
                            {o.payment === "MOMO" ? (
                              <img
                                src={momoImage}
                                alt="momo"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "2px",
                                }}
                              />
                            ) : (
                              <img
                                src={paypalImage}
                                alt="paypal"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "2px",
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {moment(o.created_at).format("DD/MM/YYYY HH:mm:ss")}
                          </TableCell>
                          <TableCell align="left">
                            <Typography align="center">
                              <Button
                                onClick={() => handleClickInvoice(o.id)}
                                disabled={isLoading}
                              >
                                {isLoading && rowId === o.id ? (
                                  <SpinAntCom />
                                ) : (
                                  "Invoice"
                                )}
                              </Button>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid item md={12} xs={12}>
                <Stack>
                  <Pagination
                    count={orderHistory && orderHistory.totalPages}
                    page={orderHistory && orderHistory.number + 1}
                    onChange={handleChangePage}
                  ></Pagination>
                </Stack>
              </Grid>
            </React.Fragment>
          )}
        </Paper>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Paper
          square
          elevation={5}
          sx={{
            padding: "20px",
            width: "100%",
            mt: "20px",
            borderRadius: "10px",
          }}
        >
          {!refund === null || (refund && refund.content.length === 0) ? (
            <HeadingH3Com className="text-black text-4xl text-center py-10">
              Currently none transaction 've been initiated.
            </HeadingH3Com>
          ) : (
            <React.Fragment>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Course</TableCell>
                      <TableCell align="left">Transaction</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="left">Total</TableCell>
                      <TableCell align="left">Payment</TableCell>
                      <TableCell align="left">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {refund &&
                      refund.content.map((o) => {
                        const colorStatus = o.status
                          ? colorMap[o.status]
                          : null;
                        return (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="left">
                              <ButtonBase
                                sx={{
                                  transition: "transform 0.2s ease-out",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                  borderRadius: "10px",
                                }}
                                onClick={() => handleClickCourse(o.slug)}
                              >
                                <img
                                  src={o.image}
                                  alt={o.courseName}
                                  style={{
                                    width: "90px",
                                    height: "55px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                                <Typography align="left" ml={3}>
                                  {o.courseName}
                                </Typography>
                              </ButtonBase>
                            </TableCell>
                            <TableCell align="left">
                              {o.transactionId}
                            </TableCell>
                            <TableCell align="left">
                              <strong
                                style={{
                                  color:
                                    colorStatus == null ? "#333" : colorStatus,
                                }}
                              >
                                {o.status}
                              </strong>
                            </TableCell>
                            <TableCell align="left">${o.net_price}</TableCell>
                            <TableCell align="left">
                              {o.payment === "MOMO" ? (
                                <img
                                  src={momoImage}
                                  alt="momo"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "2px",
                                  }}
                                />
                              ) : (
                                <img
                                  src={paypalImage}
                                  alt="paypal"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "2px",
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {moment(o.created_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid item md={12} xs={12}>
                <Stack>
                  <Pagination
                    count={refund && refund.totalPages}
                    page={refund && refund.number + 1}
                    onChange={handleChangePageRefund}
                  ></Pagination>
                </Stack>
              </Grid>
            </React.Fragment>
          )}
        </Paper>
      </CustomTabPanel>
    </Box>
  );
}
export default TabsMuiCom;
