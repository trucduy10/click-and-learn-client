import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  BASE_API_URL,
  IMAGE_DEFAULT,
  MESSAGE_LOGIN_REQUIRED,
} from "../../constants/config";
import { ADMIN_ROLE, MANAGER_ROLE } from "../../constants/permissions";
import useShowMore from "../../hooks/useShowMore";
import { selectUser } from "../../store/auth/authSelector";
import { onGetLastUrlAccess } from "../../store/auth/authSlice";
import { selectAllCourseState } from "../../store/course/courseSelector";
import {
  onDeletePost,
  onRemoveReplyInPost,
  onSaveLikeOfPost,
  onSavePost,
  onSaveReplyToPost,
} from "../../store/course/courseSlice";
import { convertDateTimeToDiffForHumans } from "../../utils/helper";
import { ButtonCom } from "../button";
import GapYCom from "../common/GapYCom";
import { IconTrashCom } from "../icon";
import { DialogConfirmMuiCom } from "../mui";
import { TextEditorQuillCom } from "../texteditor";

const schemaValidation = yup.object().shape({
  comment: yup.string(),
  // .required(MESSAGE_FIELD_REQUIRED)
});

const CommentCom = ({
  title,
  placeholder = "Leave your comment here...",
  type,
  commentUrl = "",
  replyUrl = "",
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const [isShowCommentBox, setIsShowCommentBox] = useState(false);
  const { courseId, isSubmitting } = useSelector(selectAllCourseState);
  const { blogId } = useSelector((state) => state.adminBlog);

  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const { showItems, isRemain, handleShowMore } = useShowMore(posts);

  useEffect(() => {
    let url =
      BASE_API_URL +
      `/post/stream/${type === "COURSE" ? courseId : blogId}/${type}`;
    const sse = new EventSource(url);
    sse.addEventListener("post-list-event", (event) => {
      const data = JSON.parse(event.data);
      setPosts(data.reverse());
    });
    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, [blogId, courseId, type]);

  const handleSubmitForm = ({ comment }) => {
    const newPost = {
      comments: [],
      content: comment,
      typeId: type === "COURSE" ? courseId : blogId,
      type,
      created_at: new Date(),
      id: Math.floor(Math.random() * 1000) + 1000,
      likedUsers: [],
      role: user.role,
      userId: user.id,
      userName: user.name,
    };
    setPosts([...posts, newPost]);
    dispatch(
      onSavePost({
        typeId: type === "COURSE" ? courseId : blogId,
        type,
        userId: user.id,
        content: comment,
      })
    );

    setIsShowCommentBox(false);
    setComment("");
  };

  const addComment = (comment) => {
    const newPosts = [...posts];
    const newPost = newPosts.find((p) => p.id === comment.postId);
    if (newPost !== undefined) {
      newPost.comments = [...newPost.comments, comment];
      setPosts(newPosts);
    } else {
      setPosts(newPosts.filter((p) => p.id !== comment.postId));
    }
  };
  const deleteComment = (comment) => {
    let newPost = posts.find((p) => p.id === comment.postId);
    if (newPost) {
      const comments = newPost.comments.filter((c) => c.id !== comment.id);
      newPost.comments = comments;
      const newListPost = posts.map((p) =>
        p.id === newPost.id
          ? {
              ...newPost,
            }
          : p
      );

      setPosts(newListPost);
    }
  };
  const deletePost = (postId) => {
    const newPosts = posts.filter((p) => p.id !== postId);
    setPosts(newPosts);
  };

  return (
    <section className="comment-box">
      {title && (
        <React.Fragment>
          <h4>Comment</h4>
          <hr />
        </React.Fragment>
      )}
      {/* Comment Items */}
      <div
        className="flex justify-center items-center"
        onClick={() => {
          if (!user) {
            toast.warn(MESSAGE_LOGIN_REQUIRED);
            dispatch(onGetLastUrlAccess(window.location.pathname));
            navigate("/login");
            return;
          }
          setIsShowCommentBox(!isShowCommentBox);
        }}
      >
        {isShowCommentBox ? (
          <ButtonCom backgroundColor="danger">Hide</ButtonCom>
        ) : (
          <ButtonCom>Comment</ButtonCom>
        )}
      </div>
      <GapYCom></GapYCom>
      {isShowCommentBox && (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <TextEditorQuillCom
            value={comment}
            onChange={(comment) => {
              setValue("comment", comment);
              setComment(comment);
            }}
            placeholder={placeholder}
          ></TextEditorQuillCom>
          <GapYCom className="mb-5"></GapYCom>
          <div>
            <ButtonCom
              type="submit"
              backgroundColor="pink"
              isLoading={isSubmitting}
            >
              Send
            </ButtonCom>
            <ButtonCom
              className="!text-black ml-2"
              backgroundColor="gray"
              onClick={() => setIsShowCommentBox(false)}
            >
              Close
            </ButtonCom>
          </div>
        </form>
      )}
      <GapYCom></GapYCom>
      {posts.length > 0 ? (
        <ul>
          {showItems.length > 0
            ? showItems.map((p) => (
                <React.Fragment key={p.id}>
                  <CommentParent
                    post={p}
                    image={
                      p.postImageUrl == null ? IMAGE_DEFAULT : p.postImageUrl
                    }
                    userName={p.userName}
                    role={p.role}
                    parentComment={p.content}
                    userPostId={p.userId}
                    postId={p.id}
                    replyCount={p.comments.length}
                    likeCount={p.likedUsers.length}
                    likeUsers={p.likedUsers}
                    comments={p.comments}
                    addComment={addComment}
                    deletePost={deletePost}
                    createdAt={p.created_at}
                  ></CommentParent>
                  {p.comments.map((c) => (
                    <CommentChild
                      key={c.id}
                      image={c.imageUrl}
                      userName={c.userName}
                      role={c.role}
                      commentId={c}
                      userCommentId={c.userId}
                      childComment={c.content}
                      deleteComment={deleteComment}
                      createdAt={c.created_at}
                    ></CommentChild>
                  ))}
                </React.Fragment>
              ))
            : posts.map((p) => (
                <React.Fragment key={p.id}>
                  <CommentParent
                    post={p}
                    image={
                      p.postImageUrl == null ? IMAGE_DEFAULT : p.postImageUrl
                    }
                    userName={p.userName}
                    role={p.role}
                    parentComment={p.content}
                    userPostId={p.userId}
                    postId={p.id}
                    replyCount={p.comments.length}
                    likeCount={p.likedUsers.length}
                    likeUsers={p.likedUsers}
                    comments={p.comments}
                    addComment={addComment}
                    deletePost={deletePost}
                    createdAt={p.created_at}
                  ></CommentParent>
                  {p.comments.map((c) => (
                    <CommentChild
                      key={c.id}
                      image={c.imageUrl}
                      userName={c.userName}
                      role={c.role}
                      commentId={c}
                      userCommentId={c.userId}
                      childComment={c.content}
                      deleteComment={deleteComment}
                      createdAt={c.created_at}
                    ></CommentChild>
                  ))}
                </React.Fragment>
              ))}
          {isRemain && (
            <ButtonCom
              onClick={handleShowMore}
              backgroundColor="gray"
              className="w-full !text-black flex justify-center text-2xl"
            >
              . . .
            </ButtonCom>
          )}
        </ul>
      ) : null}
    </section>
  );
};

const CommentParent = ({
  image = IMAGE_DEFAULT,
  userName = "No Name",
  role = "USER",
  parentComment,
  postId,
  userPostId,
  replyCount = 0,
  likeCount = 0,
  likeUsers,
  comments,
  addComment,
  addPost,
  deletePost,
  createdAt,
}) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [isLiked, setLiked] = useState(
    likeUsers.find((like) => like.id === user?.id) ? true : false
  );
  const [isReply, setIsReply] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [likeNum, setLikeNum] = useState(likeCount);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletedPostId, setDeletedPostId] = useState(0);

  useEffect(() => {
    setLikeNum(likeCount);
  }, [likeCount]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const dispatch = useDispatch();

  const handleLike = () => {
    if (!user) {
      toast.warn(MESSAGE_LOGIN_REQUIRED);
      dispatch(onGetLastUrlAccess(window.location.pathname));
      navigate("/login");
      return;
    } else {
      setLiked(!isLiked);
      if (!isLiked) {
        setLikeNum(likeNum + 1);
      } else {
        setLikeNum(likeNum - 1);
      }
      dispatch(onSaveLikeOfPost({ postId, userId: user.id }));
    }
  };

  const handleReply = (isReply) => {
    if (!user) {
      toast.warn(MESSAGE_LOGIN_REQUIRED);
      dispatch(onGetLastUrlAccess(window.location.pathname));
      navigate("/login");
      return;
    } else {
      setIsReply(!isReply);
    }
  };
  // Comment Parent
  const handleSubmitForm = ({ comment }) => {
    const newComments = {
      content: comment,
      created_at: new Date(),
      id: Math.floor(Math.random() * 1000) + 1000,
      imageUrl: user.imageUrl,
      postId,
      role: user.role,
      userId: user.id,
      userName: user.name,
    };

    addComment(newComments);
    dispatch(onSaveReplyToPost({ postId, userId: user.id, content: comment }));
    setIsReply(false);
    setComment("");
  };

  const handleToggleDeletePost = (postId) => {
    setOpenDialog(true);
    setDeletedPostId(postId);
  };

  const onConfirm = () => {
    deletePost(deletedPostId);
    dispatch(onDeletePost(deletedPostId));
    setOpenDialog(false);
  };
  return (
    <Card
      variant="outlined"
      sx={{
        padding: "10px",
        marginBottom: "10px",
        width: "100%",
      }}
    >
      <DialogConfirmMuiCom
        title="Warning"
        content="Do you want to delete this post?"
        confirmContent="Yes"
        closeContent="No"
        onConfirm={onConfirm}
        onClose={() => setOpenDialog(false)}
        open={openDialog}
      />
      <div className="media align-self-center">
        <img
          className="object-cover"
          srcSet={image}
          alt={`${userName} avatar`}
        />
        <div className="media-body">
          <div className="row">
            <div className="col-md-4">
              <h6
                className={`mt-0 ${
                  role === ADMIN_ROLE
                    ? "text-tw-primary !font-bold"
                    : role === MANAGER_ROLE
                    ? "!text-tw-success"
                    : "text-black"
                }`}
              >
                {userName}
                <span
                  className={
                    role === ADMIN_ROLE
                      ? "!text-tw-danger !font-bold"
                      : role === MANAGER_ROLE
                      ? "!text-tw-success"
                      : "text-tw-light-gray"
                  }
                >
                  ( {role} )
                </span>
              </h6>
            </div>
            <div className="col-md-8">
              <ul className="comment-social float-start float-md-end">
                <li
                  className={`${
                    isLiked ? "text-primary" : ""
                  } cursor-pointer transition-all duration-300`}
                  onClick={handleLike}
                >
                  <i className="icofont icofont-thumbs-up"></i>
                  {likeNum} Liked
                </li>
                <li
                  className={`${
                    isReply && "text-primary"
                  } cursor-pointer transition-all duration-300`}
                  onClick={() => handleReply(isReply)}
                >
                  <i className="icofont icofont-ui-chat"></i>
                  {replyCount} Reply
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <div className="flex gap-x-3">
                <div dangerouslySetInnerHTML={{ __html: parentComment }}></div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="text-tw-primary">
                  {convertDateTimeToDiffForHumans(createdAt)}
                </div>
                {user?.role === "ADMIN" ||
                (user?.role === "MANAGER" && role !== "ADMIN") ||
                (user?.role === "EMPLOYEE" &&
                  role !== "ADMIN" &&
                  role !== "MANAGER") ||
                user?.id === userPostId ? (
                  <ButtonCom
                    className="px-3 rounded-lg"
                    backgroundColor="danger"
                    onClick={() => handleToggleDeletePost(postId)}
                  >
                    <IconTrashCom className="w-4"></IconTrashCom>
                  </ButtonCom>
                ) : null}
              </div>
            </div>

            {isReply && (
              <React.Fragment>
                <GapYCom className="mb-4"></GapYCom>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                  <TextEditorQuillCom
                    value={comment}
                    onChange={(comment) => {
                      setValue("comment", comment);
                      setComment(comment);
                    }}
                    placeholder={"Leave your reply here..."}
                  ></TextEditorQuillCom>
                  <div className="mt-14">
                    <ButtonCom
                      type="submit"
                      backgroundColor="pink"
                      isLoading={isLoading}
                    >
                      Reply
                    </ButtonCom>
                    <ButtonCom
                      className="!text-black ml-2"
                      backgroundColor="gray"
                      onClick={() => setIsReply(false)}
                    >
                      Close
                    </ButtonCom>
                  </div>
                </form>
                <GapYCom className="mb-4"></GapYCom>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const CommentChild = ({
  image = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  userName = "Ric Phạm",
  role = "ADMIN",
  commentId = 0,
  userCommentId = 0,
  childComment = "Thanks for your comment!",
  deleteComment,
  createdAt,
}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [openDialogComment, setOpenDialogComment] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState();

  const handleToggleDeleteComment = (commentId) => {
    setOpenDialogComment(true);
    setDeleteCommentId(commentId);
  };

  const onConfirm = () => {
    deleteComment(deleteCommentId);
    dispatch(onRemoveReplyInPost(deleteCommentId.id));
    setOpenDialogComment(false);
  };
  return (
    <li>
      <DialogConfirmMuiCom
        title="Warning"
        content="Do you want to delete this reply?"
        confirmContent="Yes"
        closeContent="No"
        onConfirm={onConfirm}
        onClose={() => setOpenDialogComment(false)}
        open={openDialogComment}
      />
      <ul>
        <li>
          <div className="media p-[10px]">
            <img
              className="object-cover"
              srcSet={image == null ? IMAGE_DEFAULT : image}
              alt={`${userName} avatar`}
            />
            <div className="media-body">
              <div className="row">
                <div className="col-xl-12">
                  <h6
                    className={`mt-0 ${
                      role === "ADMIN"
                        ? "text-tw-primary !font-bold"
                        : "text-black"
                    }`}
                  >
                    {userName}
                    <span
                      className={
                        role === "ADMIN"
                          ? "!text-tw-danger !font-bold"
                          : "text-tw-light-gray"
                      }
                    >
                      ( {role} )
                    </span>
                  </h6>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-x-3">
                  <div dangerouslySetInnerHTML={{ __html: childComment }}></div>
                </div>
                <div className="flex items-center gap-x-3">
                  <div className="text-tw-primary">
                    {convertDateTimeToDiffForHumans(createdAt)}
                  </div>
                  {user.role === "ADMIN" ||
                  (user.role === "MANAGER" && role !== "ADMIN") ||
                  (user.role === "EMPLOYEE" &&
                    role !== "ADMIN" &&
                    role !== "MANAGER") ||
                  user.id === userCommentId ? (
                    <ButtonCom
                      className="px-3 rounded-lg"
                      backgroundColor="danger"
                      onClick={() => handleToggleDeleteComment(commentId)}
                    >
                      <IconTrashCom className="w-4"></IconTrashCom>
                    </ButtonCom>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </li>
  );
};

export default CommentCom;
