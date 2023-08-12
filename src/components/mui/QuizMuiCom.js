import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  onCourseInitalState,
  onFinishExam,
  onUnloadExam,
} from "../../store/course/courseSlice";
import {
  convertSecondToDiffForHumans,
  convertSecondToTime,
} from "../../utils/helper";
import { IconClockCom } from "../icon";
import { DialogConfirmMuiCom } from ".";
import { selectAllCourseState } from "../../store/course/courseSelector";
import moment from "moment/moment";

const colorMap = {
  FAIL: "#FF4136", // red
  AVERAGE: "#FF851B", // orange
  GOOD: "#2ECC40", // green
  EXCELLENT: "#0074D9", // blue
};

function QuizMuiCom({ exam = [] }) {
  const { finishExam, prevTime } = useSelector(selectAllCourseState);

  const maxSteps = exam.length;
  const answerOptions = ["A", "B", "C", "D"];
  const colorGrade =
    finishExam && finishExam.grade ? colorMap[finishExam.grade] : null;

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(0);
  const [chooseAnswer, setChooseAnswer] = useState([]);
  const [examTime, setExamTime] = useState(
    prevTime > 0 ? prevTime : exam[0].limitTime
  );
  const [timerId, setTimerId] = useState(
    prevTime > 0 ? prevTime : exam[0].limitTime
  );
  const [showDialog, setShowDialog] = useState(false);
  const [timeUpDialog, setTimeUpDialog] = useState(false);
  const [answerId, setAnswerId] = useState(0);

  window.onbeforeunload = function () {
    dispatch(onUnloadExam(examTime));
    return "Are you sure to leave this page?";
  };

  useEffect(() => {
    const examTimeId = setInterval(() => {
      setExamTime((prev) => prev - 1);
    }, 1000);

    setTimerId(examTimeId);
    return () => clearInterval(examTimeId);
  }, []);

  useEffect(() => {
    if (examTime === 0) {
      clearInterval(timerId);
      setTimeUpDialog(true);
    }
  }, [examTime, timerId]);

  useEffect(() => {
    if (examTime > 0) {
      dispatch(onUnloadExam(examTime));
    }
  }, [dispatch, examTime]);

  useEffect(() => {}, [chooseAnswer]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    const currentAns = chooseAnswer.find(
      (a) => a.id === exam[activeStep].question.id
    );

    if (currentAns) {
      setAnswerId(currentAns.userAnswerId);
    }
  }, [activeStep, chooseAnswer, exam]);

  const handleChooseAnswer = (event) => {
    const correctAnswer = exam[activeStep].answers.find(
      (a) => a.correct === true
    );
    const userAnswer = {
      ...exam[activeStep].question,

      correct: correctAnswer.correct,
      answerId: correctAnswer.id,
      userAnswerId: Number(event.target.value),
    };

    const findAnswer = chooseAnswer.find((ex) => ex.id === userAnswer.id);

    //Tạo array câu hỏi user nếu có rồi thì update lại câu trả lời nếu chưa có thể add mới câu trả lời vào array
    if (findAnswer) {
      setChooseAnswer([
        ...chooseAnswer.map((question) =>
          question.id === userAnswer.id
            ? {
                ...question,

                userAnswerId: userAnswer.userAnswerId,
              }
            : question
        ),
      ]);
    } else {
      setChooseAnswer((prevAnswer) => [...prevAnswer, userAnswer]);
    }
  };

  const handleSubmit = () => {
    setShowDialog(true);
  };

  const CompleteExamination = () => {
    const totalExamTime = exam[activeStep].limitTime - examTime;

    const examResult = {
      totalExamTime,
      answers: chooseAnswer,
      courseId: exam[0].courseId,
      userId: exam[0].userId,
      examSession: exam[0].examSession,
    };

    dispatch(onFinishExam(examResult));
  };

  const handleConfirm = () => {
    clearInterval(timerId);
    CompleteExamination();
    setShowDialog(false);
    setTimeUpDialog(false);
  };

  const handleNavigate = () => {
    dispatch(onCourseInitalState());
    if (finishExam && finishExam.grade !== "FAIL") {
      return navigate("/profile/accomplishments");
    }
    return navigate(-2);
  };

  return (
    <Grid container sx={{ marginTop: "30px" }}>
      <DialogConfirmMuiCom
        open={showDialog}
        onClose={() => setShowDialog(!showDialog)}
        closeContent={"CANCEL"}
        onConfirm={handleConfirm}
        confirmContent={"APPLY"}
        title={"Confirm Exam"}
        content={"Do you want to submit your exam?"}
      ></DialogConfirmMuiCom>
      <DialogConfirmMuiCom
        open={timeUpDialog}
        onConfirm={handleConfirm}
        confirmContent={"OK"}
        title={"Time up!"}
        content={"Please click OK to see your examination result."}
      ></DialogConfirmMuiCom>
      <Paper
        square
        elevation={24}
        sx={{
          padding: "20px",
          width: "1000px",
          borderRadius: "10px",
          backgroundImage: 'url("path/to/background-image.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {finishExam && finishExam.grade && finishExam.grade === "FAIL" ? (
          <img
            src={"https://i.ibb.co/HpKqmqN/failed.png"}
            alt="Foreground"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "40%",
              zIndex: 0,
            }}
          />
        ) : finishExam &&
          (finishExam.grade === "GOOD" ||
            finishExam.grade === "AVERAGE" ||
            finishExam.grade === "EXCELLENT") ? (
          <img
            src={"https://i.ibb.co/6ndv2vS/passed.png"}
            alt="Foreground"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "40%",
              zIndex: 0,
            }}
          />
        ) : (
          ""
        )}
        {finishExam ? (
          <div>
            <p>
              Total time:{" "}
              {convertSecondToDiffForHumans(finishExam.totalExamTime)}
            </p>
            <p>Your correct answer: {finishExam.correctAnswer}</p>
            <p>Total point: {finishExam.totalPoint}</p>
            <p>
              Grade:{" "}
              <strong
                style={{ color: colorGrade == null ? "#333" : colorGrade }}
              >
                {finishExam.grade ? finishExam.grade : "None"}
              </strong>
            </p>
            <p>
              Finished at:{" "}
              {moment(finishExam.created_at).format("YYYY/MM/DD HH:mm:ss")}
            </p>
            <div>
              {finishExam && finishExam.grade !== "FAIL" ? (
                <Button onClick={handleNavigate}>View your certificate</Button>
              ) : (
                <p>
                  Good luck next time.
                  <Button onClick={handleNavigate}>Learn more!</Button>{" "}
                </p>
              )}
            </div>
          </div>
        ) : (
          <React.Fragment>
            <Grid item sm={12} md={12} lg={12}>
              <Typography className="flex items-center gap-x-2 justify-end">
                <IconClockCom className="text-tw-primary"></IconClockCom>
                Time limit:{" "}
                <span
                  className="font-medium"
                  style={
                    examTime === 0
                      ? { color: "red", fontWeight: "bold" }
                      : { fontWeight: "bold" }
                  }
                >
                  {convertSecondToTime(examTime)}
                </span>
              </Typography>
            </Grid>
            <Grid item sm={12} md={12} lg={12} mt="20px" mb="20px">
              <Typography>
                {
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `<strong>${activeStep + 1}. ${
                        exam[activeStep].question.description
                      }</strong>`,
                    }}
                  ></span>
                }
              </Typography>
            </Grid>
            <Grid item sm={12} md={12} lg={12}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  {exam[activeStep].answers.map((answer, i) => (
                    <React.Fragment key={answer.id}>
                      <FormControlLabel
                        value={answer.id}
                        control={
                          <Radio
                            color="secondary"
                            onChange={handleChooseAnswer}
                            name="chooseAnswer"
                            checked={answer.id === answerId}
                          />
                        }
                        label={
                          <span
                            dangerouslySetInnerHTML={{
                              __html: `<strong>${answerOptions[i]}.</strong> ${answer.description}`,
                            }}
                          />
                        }
                      />
                    </React.Fragment>
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item sm={12} md={12} lg={12}>
              <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                variant="text"
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                    variant="outlined"
                    color="secondary"
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="outlined"
                    color="secondary"
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                  </Button>
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                fullWidth
                disabled={chooseAnswer.length === 0}
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
              >
                SUBMIT
              </Button>
            </Grid>
          </React.Fragment>
        )}
      </Paper>
    </Grid>
  );
}

export default QuizMuiCom;
