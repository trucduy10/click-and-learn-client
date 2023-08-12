import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import { selectAllCourseState } from "../../store/course/courseSelector";
import SpinAntCom from "../ant/SpinAntCom";

// AlertDialogold
const DialogNextVideoMuiCom = ({
  open,
  nextLesson,
  onClose,
  onNext,
  isFinal,
}) => {
  const { isGenerating } = useSelector(selectAllCourseState);
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isFinal
            ? "Notice: You 've completed 100% progress of lesson"
            : `Up next: ${nextLesson}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isFinal
              ? "Are you ready to take on an exam?"
              : "Do you want to go to next lesson?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>No</Button>
          <Button autoFocus onClick={onNext} disabled={isGenerating}>
            {isGenerating ? <SpinAntCom /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogNextVideoMuiCom;
