import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import * as React from "react";

function CircularProgressMuiCom(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        size="35px"
        {...props}
        thickness={5}
        sx={{ filter: "drop-shadow(1px 1px 1px #fff)" }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            color: "whitesmoke",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressMuiCom;
