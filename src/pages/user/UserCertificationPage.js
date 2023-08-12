import {
  Avatar,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectAllCourseState } from "../../store/course/courseSelector";
import { StyledBadgeMuiCom } from "../../components/mui";
import { selectUser } from "../../store/auth/authSelector";
import { HeadingH1Com } from "../../components/heading";
import moment from "moment/moment";
import { convertToHumanTime } from "../../utils/helper";
import {
  onDownloadCertificate,
  onLoadCertificate,
} from "../../store/course/courseSlice";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import SpinAntCom from "../../components/ant/SpinAntCom";
const colorMap = {
  FAIL: "#FF4136", // red
  AVERAGE: "#FF851B", // orange
  GOOD: "#2ECC40", // green
  EXCELLENT: "#0074D9", // blue
};
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
const UserCertificationPage = () => {
  const { cert, accomplishments, isLoading } =
    useSelector(selectAllCourseState);

  const user = useSelector(selectUser);

  const colorGrade = cert.grade ? colorMap[cert.grade] : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (cert)
      dispatch(
        onLoadCertificate({
          fullName: user.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          courseName: cert.courseName,
          completedDate: cert.created_at,
          grade: cert.grade,
        })
      );
  }, []);
  useEffect(() => {
    // console.log("fdsfdsfsd");
    // const textContent = document.querySelector(".react-pdf__Page__textContent");
    // const annotations = document.querySelector(".react-pdf__Page__annotations");
    // if (textContent) {
    //   textContent.remove();
    // }
    // if (annotations) {
    //   annotations.remove();
    // }
  });

  const handleClickUserProfile = (userName) => {
    return navigate(`/profile/${userName}`);
  };

  const handleClickCourse = (courseSlug) => {
    return navigate(`/learn/${courseSlug}`);
  };

  const handleClickCategory = (categorySlug) => {
    return navigate(`/categories/${categorySlug}`);
  };

  const handleDownloadCertificate = () => {
    dispatch(onDownloadCertificate());
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={12} md={6}>
          <HeadingH1Com>{cert.courseName}</HeadingH1Com>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} sm={12} md={6}>
          <Card
            elevation={12}
            sx={{
              background: "linear-gradient(to right, #141e30, #243b55);",
              transition: "0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <Grid
              container
              item
              xs={12}
              sm={12}
              md={12}
              alignItems="center"
              paddingY={3}
            >
              <Grid item xs={12} sm={12} md={4}>
                <Typography
                  variant="p"
                  align="center"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <StyledBadgeMuiCom
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Button
                      sx={{
                        borderRadius: "50%",
                        boxShadow: "1px 1px 2px rgba(255, 255, 255, 0.6)",
                        "&:hover": {
                          background:
                            "linear-gradient(0deg, rgba(101,121,220,1) 20%, rgba(100,235,191,1) 60%, rgba(231,138,254,1) 90%)",
                          opacity: 1.1,
                        },
                      }}
                      onClick={() => handleClickUserProfile(user.name)}
                    >
                      <Avatar
                        alt={user.name}
                        src={user.imageUrl}
                        sx={{ width: 120, height: 120 }}
                      />
                    </Button>
                  </StyledBadgeMuiCom>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      color: "whitesmoke",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Completed by {user.name}
                  </Typography>
                  <Typography
                    variant="h8"
                    component="div"
                    sx={{
                      color: "whitesmoke",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {moment(cert.created_at).format("MMMM D, YYYY [at] h:mm A")}
                  </Typography>
                  <Typography
                    variant="h8"
                    component="div"
                    sx={{
                      color: "whitesmoke",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {convertToHumanTime(cert.courseDuration)} (approximately)
                  </Typography>
                  <Typography
                    variant="h8"
                    component="div"
                    sx={{
                      color: "whitesmoke",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    Grade:{" "}
                    <strong
                      style={{
                        color: colorGrade == null ? "#333" : colorGrade,
                      }}
                    >
                      {cert.grade ? cert.grade : "None"}
                    </strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      color: "whitesmoke",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {user.name}'s account is verified. Coursera certifies their
                    successful completion of Managing an Agile Team
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
          <Card
            elevation={12}
            sx={{
              transition: "0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
              marginTop: "8px",
            }}
          >
            <Grid
              container
              item
              xs={12}
              sm={12}
              md={12}
              alignItems="center"
              paddingY={3}
            >
              <Grid item xs={12} sm={12} md={4}>
                <Typography
                  variant="p"
                  align="center"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    sx={{
                      boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                      "&:hover": {
                        opacity: 1.1,
                        boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.8)",
                        background: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    onClick={() => handleClickCourse(cert.courseSlug)}
                  >
                    <Avatar
                      alt={cert.courseName}
                      src={cert.courseImage}
                      sx={{ width: 120, height: 120 }}
                    />
                  </Button>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      color: "#333",
                      textDecoration: "underline",
                    }}
                  >
                    {cert.courseName}
                  </Typography>

                  <Typography
                    variant="h7"
                    component="div"
                    sx={{
                      color: "#333",
                    }}
                  >
                    <strong
                      style={{
                        background:
                          "linear-gradient(0deg, rgba(101,121,220,1) 20%, rgba(100,235,191,1) 60%, rgba(231,138,254,1) 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        textShadow: "none",
                      }}
                    >
                      ClicknLearn
                    </strong>
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ marginTop: "3px" }}
                    onClick={() => handleClickCategory(cert.categorySlug)}
                  >
                    {cert.categoryName}
                  </Button>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: "#333",
                      marginTop: "3px",
                    }}
                  >
                    {cert.courseTotalEnroll > 0
                      ? `${cert.courseTotalEnroll} Students Enrolled`
                      : `${cert.courseTotalEnroll} Student Enrolled`}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: "#333",
                    }}
                  >
                    <Grid
                      item
                      container
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Grid item xs={12} sm={12} md={5} mt={1}>
                        <Rating
                          name="half-rating"
                          value={cert.courseRating}
                          precision={0.5}
                          size="medium"
                          defaultValue={0}
                          readOnly
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={2}>
                        <Typography variant="h7" component="div">
                          <strong>{cert.courseRating} point</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Paper
            square
            elevation={5}
            sx={{
              padding: "20px",
              width: "100%",
              borderRadius: "5px",
            }}
          >
            <Typography align="center">
              {isLoading ? (
                <SpinAntCom />
              ) : (
                <React.Fragment>
                  <ButtonBase
                    onClick={() =>
                      window.open(sessionStorage.getItem("certificatePdf"))
                    }
                  >
                    <Document file={sessionStorage.getItem("certificatePdf")}>
                      <Page pageNumber={1} renderTextLayer={false} />
                    </Document>
                  </ButtonBase>

                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={handleDownloadCertificate}
                  >
                    Download Cert
                  </Button>
                </React.Fragment>
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserCertificationPage;
