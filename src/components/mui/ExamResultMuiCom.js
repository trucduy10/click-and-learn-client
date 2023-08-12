import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DialogNextVideoMuiCom } from ".";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllCourseState } from "../../store/course/courseSelector";
import {
  onGenerateCourseExam,
  onRetakeExam,
} from "../../store/course/courseSlice";
import { convertSecondToDiffForHumans } from "../../utils/helper";
import { v1 } from "uuid";

const colorMap = {
  FAIL: "#FF4136", // red
  AVERAGE: "#FF851B", // orange
  GOOD: "#2ECC40", // green
  EXCELLENT: "#0074D9", // blue
};

const styles = {
  paper: {
    backgroundImage: 'url("path/to/background-image.jpg")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  foregroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
};

const ExamResultMuiCom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    retakeExam,
    courseId,
    finishExam,
    generateExamSuccess,
    examination,
    countdown,
  } = useSelector(selectAllCourseState);
  const user = useSelector(selectUser);

  const colorGrade = retakeExam.grade ? colorMap[retakeExam.grade] : null;

  const [canExam, setCanExam] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  // const [countdown, setCountDownTime] = useState(1);

  // console.log(countdown);

  useEffect(() => {
    if (retakeExam.grade && retakeExam.grade !== "FAIL") {
      setCanExam(false);
    }
  }, [retakeExam]);

  // useEffect(() => {
  //   const countDown =
  //     retakeExam?.created_at === null
  //       ? 0
  //       : Math.floor(new Date(retakeExam?.created_at).getTime() / 1000) +
  //         60 -
  //         Math.floor(Date.now() / 1000);

  //   const interval = setInterval(() => {
  //     setCountDownTime(countDown - 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // });

  useEffect(() => {
    dispatch(onRetakeExam({ userId: user.id, courseId }));
  }, [courseId, dispatch, finishExam, user]);

  useEffect(() => {
    if (canExam && !retakeExam.passed) {
      setShowDialog(true);
    }
  }, [canExam, retakeExam]);

  useEffect(() => {
    if (generateExamSuccess && examination.length > 0) {
      navigate("/exam", { state: { path: v1() } });
    } else if (generateExamSuccess && examination.length === 0) {
      // dispatch(onSetGenerateExamSuccess)
      toast.warning(
        "Sorry for unconvenience. The examination is not available for this course."
      );
    }
    setShowDialog(false);
  }, [examination, generateExamSuccess, navigate]);

  const handleCanExam = () => {
    if (retakeExam.passed) {
      return navigate("/profile/accomplishments");
    }

    if (countdown <= 1 || isNaN(countdown)) {
      setCanExam(true);
      setShowDialog(true);
    }
  };

  const handleWaitCountDown = () => {
    console.log(countdown);
    if (countdown <= 1 || isNaN(countdown)) {
      setCanExam(true);
      setShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setCanExam(true);
    setShowDialog(false);
  };

  const handleInitialExam = () => {
    dispatch(onGenerateCourseExam({ courseId, userId: user.id }));
  };

  return (
    <React.Fragment>
      <Paper
        square
        elevation={5}
        sx={{
          padding: "20px",
          width: "100%",
          mt: "20px",
          borderRadius: "10px",
          backgroundImage: 'url("path/to/background-image.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {retakeExam.grade && retakeExam.grade === "FAIL" ? (
          <img
            src={"https://i.ibb.co/HpKqmqN/failed.png"}
            alt="Foreground"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "30%",
              height: "30%",
              zIndex: 0,
            }}
          />
        ) : retakeExam.grade === "GOOD" ||
          retakeExam.grade === "AVERAGE" ||
          retakeExam.grade === "EXCELLENT" ? (
          <img
            src={"https://i.ibb.co/6ndv2vS/passed.png"}
            alt="Foreground"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "40%",
              height: "40%",
              zIndex: 0,
            }}
          />
        ) : (
          ""
        )}

        <DialogNextVideoMuiCom
          open={showDialog}
          onNext={handleInitialExam}
          onClose={handleCloseDialog}
          isFinal={true}
        ></DialogNextVideoMuiCom>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            color: "#a21111",
            textShadow: "1px 1px 0 #ccc, 2px 1px 0 #ccc",
          }}
          align="center"
        >
          <strong>LAST RESULT</strong>
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Exam session</TableCell>
                <TableCell align="left">Total Time</TableCell>
                <TableCell align="left">Correct Answer</TableCell>
                <TableCell align="left">Total Point</TableCell>
                <TableCell align="left">Grade</TableCell>
                <TableCell align="left">Finished at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  {retakeExam.examSession ? retakeExam.examSession : "None"}{" "}
                  {retakeExam.examSession && retakeExam.examSession > 1 ? (
                    <strong style={{ color: "red" }}>(RETAKE)</strong>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell align="left">
                  {retakeExam.totalExamTime
                    ? convertSecondToDiffForHumans(retakeExam.totalExamTime)
                    : "None"}
                </TableCell>
                <TableCell align="left">
                  {retakeExam.correctAnswer ? retakeExam.correctAnswer : "None"}
                </TableCell>
                <TableCell align="left">
                  {retakeExam.totalPoint ? retakeExam.totalPoint : "None"}
                </TableCell>
                <TableCell align="left">
                  <strong
                    style={{ color: colorGrade == null ? "#333" : colorGrade }}
                  >
                    {retakeExam.grade ? retakeExam.grade : "None"}
                  </strong>
                </TableCell>
                <TableCell align="left">
                  {retakeExam.created_at
                    ? moment(retakeExam && retakeExam.created_at).format(
                        "YYYY/MM/DD HH:mm:ss"
                      )
                    : "None"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{ marginTop: "20px" }} align="center">
          {canExam || countdown === 0 || retakeExam.passed ? (
            <Button
              onClick={handleCanExam}
              variant="contained"
              color="secondary"
              size="large"
            >
              {retakeExam.passed ? "View Certificate" : "EXAM NOW"}
            </Button>
          ) : (
            <Button
              onClick={handleWaitCountDown}
              variant="contained"
              color={"secondary"}
              disabled={
                retakeExam.grade && retakeExam.grade === "FAIL" && countdown > 0
              }
              size="large"
            >
              {retakeExam.grade && retakeExam.grade === "FAIL" && countdown > 0
                ? `PLEASE RETURN AFTER ${convertSecondToDiffForHumans(
                    countdown
                  )}`
                : "EXAM NOW"}
            </Button>
          )}
        </Typography>
      </Paper>
    </React.Fragment>
  );
};

export default ExamResultMuiCom;
