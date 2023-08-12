import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectAllCourseState } from "../../store/course/courseSelector";
import SpinAntCom from "../ant/SpinAntCom";

const DialogConfirmMuiCom = ({
  open,
  onClose,
  closeContent,
  onConfirm,
  confirmContent,
  title,
  title2,
  gradeRules,
  content,
  content0,
  warning,
  warningContent,
}) => {
  const { isLoadingFinish } = useSelector(selectAllCourseState);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <Typography variant="h5" ml={3} color="red">
          {warning}
        </Typography>
        <Typography variant="h7" ml={3} color="red">
          <strong>{title2}</strong>
        </Typography>

        {gradeRules && (
          <Typography variant="subtitle1" ml={3} mt={2}>
            <span style={{ color: "red" }}>Point</span> &lt; 40:{" "}
            <strong style={{ color: "#FF4136" }}>FAIL</strong>
            <br />
            40 &le; <span style={{ color: "red" }}>Point</span> &lt; 65:{" "}
            <strong style={{ color: "#FF851B" }}>AVERAGE</strong>
            <br />
            65 &le; <span style={{ color: "red" }}>Point</span> &lt; 80:{" "}
            <strong style={{ color: "#2ECC40" }}>GOOD</strong>
            <br />
            <span style={{ color: "red" }}>Point</span> &ge; 80:{" "}
            <strong style={{ color: "#0074D9" }}>EXCELLENT</strong>
            <br />
          </Typography>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-description" mb={1}>
            {warningContent}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" mb={1}>
            {content0}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{closeContent}</Button>
          <Button autoFocus onClick={onConfirm}>
            {isLoadingFinish ? <SpinAntCom /> : confirmContent}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogConfirmMuiCom;
