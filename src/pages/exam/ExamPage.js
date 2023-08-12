import { Container } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogConfirmMuiCom, QuizMuiCom } from "../../components/mui";
import { selectAllCourseState } from "../../store/course/courseSelector";
import { convertSecondToDiffForHumans } from "../../utils/helper";
import {
  Navigate,
  useBeforeUnload,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import useExitPrompt from "../../hooks/useExitPrompt";
import useNavigationBlocker from "../../hooks/useNavigationBlocker";
import { onUnloadExam } from "../../store/course/courseSlice";
import { v1 } from "uuid";

const WarningContent = () => (
  <span>
    If you exit/close this page, it will be counted as a{" "}
    <strong style={{ color: "red" }}>FAILED</strong> exam or an incomplete
    status. Please make sure to complete the exam before leaving the page.
  </span>
);

const ExamPage = () => {
  const { examination, prevTime } = useSelector(selectAllCourseState);
  const [showDialog, setShowDialog] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith("/learn")) {
      navigate("/exam", { state: { path: v1() } });
    }
    setShowAlert(true);
    setShowDialog(false);
  }, [location.key, location.pathname, navigate]);

  useEffect(() => {
    if (prevTime > 0) {
      setShowAlert(false);
      setShowDialog(false);
    }
  }, [prevTime]);

  const handleConfirm = () => {
    setShowDialog(false);
  };

  const handleUnderstand = () => {
    if (!showDialog) {
      setShowDialog(true);
    }
    setShowAlert(false);
  };

  //useNavigationBlocker("Are you sure you want to leave?", true);

  return !examination || examination.length === 0 ? (
    <Navigate to="/forbidden" />
  ) : (
    <Container maxWidth="sm">
      <DialogConfirmMuiCom
        open={showAlert}
        onClose={() => setShowAlert(!showAlert)}
        onConfirm={handleUnderstand}
        confirmContent={"Yes, I understand."}
        warning={`WARNING`}
        warningContent={<WarningContent></WarningContent>}
      ></DialogConfirmMuiCom>
      <DialogConfirmMuiCom
        open={showDialog}
        onConfirm={handleConfirm}
        confirmContent={"START"}
        title={`Exam times: ${
          examination.length > 0
            ? convertSecondToDiffForHumans(examination[0].limitTime)
            : 0
        }`}
        title2={`Exam Rules`}
        gradeRules={true}
        content0={`Hardware is an important example not to be overlooked. Students need to have working microphones and 
        cameras If need be.`}
        content={`Students must also have a reliable internet connection. This is important to ensure smooth testing.
         Technical difficulties can be made into an opportunistic situation for students involving re-testing.`}
      ></DialogConfirmMuiCom>

      {!showDialog && !showAlert && <QuizMuiCom exam={examination} />}
    </Container>
  );
};

export default ExamPage;
