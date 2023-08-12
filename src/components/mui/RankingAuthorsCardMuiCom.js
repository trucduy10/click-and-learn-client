import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RankingAuthorsBadgeMuiCom } from ".";
import { selectUser } from "../../store/auth/authSelector";
import { selectAllAuthorsState } from "../../store/author/authorSelector";
import {
  onSubcribeAuthor,
  onUnsubcribeAuthor,
} from "../../store/author/authorSlice";
import StyledBadgeMuiCom from "./StyleBadgeMuiCom";

const RankingAuthorsCardMuiCom = ({ top3, rank }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subcribes } = useSelector(selectAllAuthorsState);
  const user = useSelector(selectUser);

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

  const handleClickAuthor = (authorId) => {
    return navigate(`/authors/${authorId}`);
  };

  return (
    <React.Fragment>
      <Card
        elevation={12}
        sx={{
          maxWidth: 345,
          background: "linear-gradient(to right, #8e2de2, #4a00e0);",
          transition: "0.2s",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <Typography
          variant="p"
          align="center"
          sx={{ display: "flex", justifyContent: "center" }}
          mt="15px"
        >
          <RankingAuthorsBadgeMuiCom top3={top3} rank={rank}>
            <StyledBadgeMuiCom
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Button
                sx={{
                  borderRadius: "50%",
                  boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
                  "&:hover": {
                    background:
                      "linear-gradient(0deg, rgba(101,121,220,1) 20%, rgba(100,235,191,1) 60%, rgba(231,138,254,1) 90%)",
                    opacity: 1.1,
                  },
                }}
                onClick={() => handleClickAuthor(top3.id)}
                disabled={!top3.id}
              >
                <Avatar
                  alt={top3.name}
                  src={top3.image}
                  sx={{ width: 120, height: 120 }}
                />
              </Button>
            </StyledBadgeMuiCom>
          </RankingAuthorsBadgeMuiCom>
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
            {top3.name !== null ? top3.name : "Unknown"}
          </Typography>
          <Typography variant="body2" sx={{ color: "whitesmoke" }}>
            {top3.title !== null ? top3.title : "None Title"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "whitesmoke",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
            }}
          >
            Total{" "}
            <strong style={{ color: "red" }}>
              {top3.enrollmentCount !== 0 ? top3.enrollmentCount : ""}
            </strong>{" "}
            Enrollments
          </Typography>
        </CardContent>
        {/* Add a badge element based on the ranking of the author */}

        <CardActions>
          {subcribes.length > 0 &&
          subcribes.find((s) => s.authorId === top3.id) !== undefined ? (
            <Button
              size="small"
              variant="contained"
              color="info"
              onClick={() => handleUnsubcribe(top3)}
              disabled={!top3.id}
            >
              Unsubcribe
              <NotificationsOffIcon sx={{ ml: "5px", fontSize: "20px" }} />
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleSubcribe(top3)}
              disabled={!top3.id}
            >
              Subcribe
              <NotificationsNoneIcon sx={{ ml: "5px", fontSize: "20px" }} />
            </Button>
          )}
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

export default RankingAuthorsCardMuiCom;
