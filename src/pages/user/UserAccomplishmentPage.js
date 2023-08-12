import { ButtonBase, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import accomplishmentImage from "../../assets/images/accomplishment.jpg";
import { HeadingFormH1Com, HeadingH3Com } from "../../components/heading";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  onLoadAccomplishmentsExam,
  onSelectedCertificate,
} from "../../store/course/courseSlice";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllCourseState } from "../../store/course/courseSelector";

const colorMap = {
  FAIL: "#FF4136", // red
  AVERAGE: "#FF851B", // orange
  GOOD: "#2ECC40", // green
  EXCELLENT: "#0074D9", // blue
};

const UserAccomplishmentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { finishExam, accomplishments } = useSelector(selectAllCourseState);

  const accomplishmentsWithColor = accomplishments.map((a) => {
    const color = colorMap[a.grade];
    return { ...a, color };
  });

  console.log(accomplishmentsWithColor);

  const handleClickAccomplishment = (certificateUID) => {
    dispatch(onSelectedCertificate(certificateUID));
    return navigate(`/profile/accomplishments/verify/${certificateUID}`);
  };

  console.log(user.id);
  useEffect(() => {
    if (user && user.id > 0)
      dispatch(onLoadAccomplishmentsExam({ userId: user.id }));
  }, [dispatch, finishExam, user]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <img
            src={accomplishmentImage}
            alt={accomplishmentImage}
            className="w-full h-60 object-cover"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <HeadingFormH1Com>Accomplishment Journal</HeadingFormH1Com>
          <Typography align="center" gutterBottom>
            Discipline is the bridge between goals and accomplishment
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} mt={10}>
          <HeadingH3Com>Course Accomplished</HeadingH3Com>
          {accomplishments.length > 0 ? (
            <Grid container spacing={1}>
              {accomplishments.map((acc) => (
                <Grid key={acc.courseId} item xs={12} sm={12} md={6}>
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
                    <Grid item container xs={12} sm={12} md={12}>
                      <Grid
                        container
                        item
                        justifyItems="center"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} sm={12} md={3}>
                          <ButtonBase
                            sx={{
                              transition: "transform 0.2s ease-out",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                              borderRadius: "10px",
                            }}
                            onClick={() =>
                              handleClickAccomplishment(acc.certificateUID)
                            }
                          >
                            <img
                              src={acc.courseImage}
                              alt={acc.courseImage}
                              style={{
                                width: "180px",
                                height: "110px",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm={12} md={9}>
                          <Typography
                            component="div"
                            sx={{
                              color: "darkblue",
                              fontSize: "18px",
                              fontWeight: "bold",
                              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            {acc.courseName}
                          </Typography>
                          <Typography
                            component="div"
                            sx={{
                              color: "darkblue",
                              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            Accomplished at{" "}
                            <strong
                              style={{
                                background:
                                  "linear-gradient(0deg, rgba(101,121,220,1) 20%, rgba(100,235,191,1) 60%, rgba(231,138,254,1) 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                textFillColor: "transparent",
                                textShadow: "none",
                                fontSize: "25px",
                                fontWeight: "1000",
                              }}
                            >
                              ClicknLearn
                            </strong>
                          </Typography>
                          <Typography
                            component="div"
                            sx={{
                              color: "darkblue",
                              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            Grade Achieve:{" "}
                            {accomplishmentsWithColor.map(
                              (a) =>
                                a.courseId === acc.courseId && (
                                  <strong
                                    key={a.grade}
                                    style={{ color: a.color }}
                                  >
                                    {a.grade}
                                  </strong>
                                )
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
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
              <HeadingH3Com className="text-black text-4xl text-center py-10">
                None accomplishments.
              </HeadingH3Com>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserAccomplishmentPage;
