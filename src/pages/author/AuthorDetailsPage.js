import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import React, { useState } from "react";
import { StyledBadgeMuiCom } from "../../components/mui";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  onLoadAuthor,
  onSubcribeAuthor,
  onUnsubcribeAuthor,
} from "../../store/author/authorSlice";
import { selectAllAuthorsState } from "../../store/author/authorSelector";
import { selectUser } from "../../store/auth/authSelector";
import { useEffect } from "react";
import {
  selectAllCourseState,
  selectEnrollIdAndCourseId,
} from "../../store/course/courseSelector";
import { HeadingH3Com } from "../../components/heading";
import {
  onCourseLoading,
  onGetEnrollId,
  onMyCourseLoading,
} from "../../store/course/courseSlice";

const AuthorDetailsPage = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector(selectAllCourseState);
  const { author, subcribes } = useSelector(selectAllAuthorsState);
  const { isEnrolled } = useSelector(selectEnrollIdAndCourseId);
  const [slug, setSlug] = useState("");
  const user = useSelector(selectUser);
  console.log(authorId);
  console.log(data);
  const courses = data.filter((c) => c.author_id === parseInt(authorId));

  console.log(courses);

  useEffect(() => {
    dispatch(onLoadAuthor(parseInt(authorId)));
    dispatch(onCourseLoading());
  }, [authorId, dispatch]);

  useEffect(() => {
    console.log("AA: ", isEnrolled && user?.role !== null && slug !== "");
    console.log("AB: ", isEnrolled === false && slug !== "");
    if (isEnrolled && user?.role === "USER" && slug !== "") {
      navigate(`/learn/${slug}`);
    } else if (isEnrolled === false && slug !== "") {
      navigate(`/courses/${slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnrolled, slug]);

  const handleClickCourse = (courseSlug, courseId) => {
    if (user && user.id > 0) {
      dispatch(onGetEnrollId({ course_id: courseId, user_id: user.id }));
    }
    setSlug(courseSlug);
  };

  const handleClickCategory = (categorySlug) => {
    return navigate(`/categories/${categorySlug}`);
  };

  const handleSubcribe = (author) => {
    if (user && user.id > 0) {
      dispatch(
        onSubcribeAuthor({
          authorId: author.id,
          authorName: author.name,
          created_at: new Date(),
          id: Math.floor(Math.random() * 1000) + 1000,
          image: author.image,
          userId: user.id,
        })
      );
    } else {
      navigate("/login");
    }
  };

  const handleUnsubcribe = (author) => {
    dispatch(
      onUnsubcribeAuthor({
        authorId: author.id,
        authorName: author.name,
        created_at: new Date(),
        id: Math.floor(Math.random() * 1000) + 1000,
        image: author.image,
        userId: user.id,
      })
    );
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={12} md={5} mt={5}>
          <Card
            elevation={12}
            sx={{
              width: "100%",
              background: "linear-gradient(to right, #141e30, #243b55);",
            }}
          >
            <Typography
              variant="p"
              align="center"
              sx={{ display: "flex", justifyContent: "center" }}
              mt="15px"
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
                >
                  <Avatar
                    alt={author && author.name}
                    src={author && author.image}
                    sx={{ width: 120, height: 120 }}
                  />
                </Button>
              </StyledBadgeMuiCom>
            </Typography>

            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  color: "whitesmoke",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                }}
              >
                {author && author.name !== null ? author.name : "Unknown"}
              </Typography>
              <Typography variant="body2" sx={{ color: "whitesmoke" }}>
                {author && author.title !== null ? author.title : "None Title"}
              </Typography>
            </CardContent>
            {/* Add a badge element based on the ranking of the author */}

            <CardActions>
              {subcribes.length > 0 &&
              author &&
              subcribes.find((s) => s.authorId === author.id) !== undefined ? (
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  onClick={() => handleUnsubcribe(author)}
                >
                  Unsubcribe
                  <NotificationsOffIcon sx={{ ml: "5px", fontSize: "20px" }} />
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleSubcribe(author)}
                >
                  Subcribe
                  <NotificationsNoneIcon sx={{ ml: "5px", fontSize: "20px" }} />
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        <Grid container item xs={12} sm={12} md={7} mt={5}>
          <Card
            elevation={12}
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Grid item xs={12} sm={12} md={12} marginY={5} marginX={5}>
              <Typography variant="h7" align="center">
                {author && author.information}
              </Typography>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={5}>
        {courses.length === 0 ? (
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
              Currently none published course.
            </HeadingH3Com>
          </Paper>
        ) : (
          courses.map((c) => (
            <Grid key={c.id} item xs={12} sm={12} md={6}>
              <Card sx={{ padding: "10px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <ButtonBase
                      sx={{
                        transition: "transform 0.2s ease-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                          borderRadius: "3px",
                        },
                      }}
                      onClick={() => handleClickCourse(c.slug, c.id)}
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        style={{
                          borderRadius: "3px",
                          width: "240px",
                          height: "160px",
                          objectFit: "cover",
                        }}
                      />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        width: "100%",
                        color: "#333",
                        textDecoration: "underline",
                      }}
                    >
                      {c.name}
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
                      onClick={() => handleClickCategory(c.category_slug)}
                    >
                      {c.category_name}
                    </Button>
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        color: "#333",
                        marginTop: "3px",
                      }}
                    >
                      {c.enrollmentCount > 0
                        ? `${c.enrollmentCount} Students Enrolled`
                        : `${c.enrollmentCount} Student Enrolled`}
                    </Typography>
                    <Stack direction="row">
                      <Rating
                        name="half-rating"
                        value={c.rating}
                        precision={0.5}
                        size="medium"
                        defaultValue={0}
                        readOnly
                      />
                      <span>{c.rating} point</span>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};
export default AuthorDetailsPage;
