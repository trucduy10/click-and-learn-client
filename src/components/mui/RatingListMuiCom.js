import { Grid, Rating, Stack, Typography } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllCourseState } from "../../store/course/courseSelector";
import {
  onLoadCourseRating,
  onUpdateUserRating,
} from "../../store/course/courseSlice";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const RatingListMuiCom = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { courseId, rating, courseRating, userRating } =
    useSelector(selectAllCourseState);

  const [readOnly, setReadOnly] = useState(false);

  const handleRating = (event, rating) => {
    dispatch(
      onUpdateUserRating({ user_id: user.id, course_id: courseId, rating })
    );
    setReadOnly(true);
  };

  useEffect(() => {
    if (courseId > 0) {
      dispatch(onLoadCourseRating(courseId));
    }
  }, [courseId, dispatch]);

  return (
    // <div>
    //   <p>
    //     Course Rating:{" "}
    // <RatingMuiCom defaultValue={courseRating} readOnly></RatingMuiCom>
    //   </p>
    // </div>
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Grid item xs={12} sm={12} md={12} mb={5}>
        <Stack direction="row" spacing={1}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#a927f9" }}
          >
            Your Rating:
          </Typography>
          &nbsp;
          <Rating
            name="half-rating"
            value={userRating}
            precision={0.5}
            size="large"
            defaultValue={0}
            onChange={handleRating}
            readOnly={userRating > 0 ? true : readOnly}
          />
        </Stack>
      </Grid>

      <Grid item container>
        <Grid item xs={2} sm={2} md={2} mt={-1}>
          <Grid container justifyContent="center">
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "#d77d11" }}
            >
              {rating}
            </Typography>

            <Rating
              name="half-rating"
              value={rating}
              precision={0.5}
              size="large"
              defaultValue={0}
              readOnly
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#d77d11" }}
              align="center"
              width="100%"
            >
              Course Rating
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
          {courseRating.map((c) => (
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={7} sm={7} md={7}>
                <BorderLinearProgress
                  variant="determinate"
                  value={c.ratio === 0 ? 0.3 : c.ratio}
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <Rating
                  name="half-rating"
                  value={c.star}
                  precision={0.5}
                  size="medium"
                  defaultValue={0}
                  readOnly
                  sx={{ marginTop: "-8px" }}
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1}>
                <Typography
                  variant="h6"
                  style={{
                    marginTop: "-8px",
                    marginLeft: "20px",
                    color: "rgb(128 122 112)",
                  }}
                  align="right"
                >
                  {c.ratio}%
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RatingListMuiCom;
