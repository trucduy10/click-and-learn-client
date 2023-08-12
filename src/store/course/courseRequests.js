import { BASE_DOMAIN_URL } from "../../constants/config";

const { axiosBearer } = require("../../api/axiosInstance");

export const requestMyCourse = (userId) => {
  return axiosBearer.get(`/course/my-course/${userId}`);
};
export const requestCourse = () => {
  return axiosBearer.get(`/course`);
};
export const requestFreeCourse = () => {
  return axiosBearer.get(`/course/free-course`);
};
export const requestBestSellerCourse = () => {
  return axiosBearer.get(`/course/best-course`);
};
export const requestRelatedCourse = (data) => {
  return axiosBearer.post(`/course/related-course`, data);
};
export const requestEnrollId = (data) => {
  return axiosBearer.post(`/enrollment/getEnrollId`, data);
};
export const requestLearning = (courseId) => {
  return axiosBearer.get(`/track/learning/${courseId}`);
};
export const requestMyLearning = ({ courseId, enrollId }) => {
  return axiosBearer.get(`/track/learning/${courseId}/${enrollId}`);
};
export const requestLoadTracking = (data) => {
  return axiosBearer.post(`/track/load`, data);
};
export const requestSaveTrackingVideo = (data) => {
  return axiosBearer.post(`/track/save`, data);
};
export const requestSaveTrackingLesson = (data) => {
  return axiosBearer.post(`/track/save-tracking-lesson`, data);
};
export const requestUpdateCompleted = (data) => {
  return axiosBearer.post(`/track/complete`, data);
};
export const requestLoadProgress = (data) => {
  return axiosBearer.post(`/track/load-progress`, data);
};
export const requestLoadNote = (data) => {
  return axiosBearer.post(`/track/load-notes`, data);
};
export const requestSaveNote = (data) => {
  return axiosBearer.post(`/track/save-note`, data);
};
export const requestDeleteNote = (noteId) => {
  return axiosBearer.delete(`/track/delete-note/${noteId}`);
};
export const requestSavePost = (data) => {
  return axiosBearer.post(`/post`, data);
};
export const requestDeletePost = (postId) => {
  return axiosBearer.delete(`/post/${postId}`);
};
export const requestSaveReply = (data) => {
  return axiosBearer.post(`/post/comment`, data);
};
export const requestDeleteReply = (commentId) => {
  return axiosBearer.delete(`/post/comment/${commentId}`);
};
export const requestSaveLike = (data) => {
  return axiosBearer.post(`/post/like`, data);
};
export const requestLoadNotification = (userToId) => {
  return axiosBearer.post(`/notification/${userToId}`);
};
export const requestReadNotification = (notifId) => {
  return axiosBearer.patch(`/notification/read/${notifId}`);
};
export const requestReadAllNotification = (userToId) => {
  return axiosBearer.patch(`/notification/read-all/${userToId}`);
};
export const requestUpdateUserRating = (data) => {
  return axiosBearer.post(`/enrollment/rating`, data);
};
export const requestLoadCourseRating = (courseId) => {
  return axiosBearer.get(`/enrollment/rating/${courseId}`);
};
export const requestGenerateCourseExam = (data) => {
  return axiosBearer.post(`/exam-result`, data);
};
export const requestFinishCourseExam = (data) => {
  return axiosBearer.post(`/exam-result/finish-exam`, data);
};
export const requestRetakeCourseExam = (data) => {
  return axiosBearer.post(`/exam-result/retake-exam`, data);
};
export const requestLoadAccomplishmentsExam = (data) => {
  return axiosBearer.post(`/exam-result/accomplishments`, data);
};
export const requestLoadCertificate = (data) => {
  return axiosBearer.post(`/exam-result/certificate`, data, {
    headers: {
      "Access-Control-Allow-Origin": BASE_DOMAIN_URL,
    },
    responseType: "blob",
  });
};
export const requestAllNotification = (userToId) => {
  return axiosBearer.get(`/notification/${userToId}`);
};
export const requestDeleteNotification = (notifId) => {
  return axiosBearer.delete(`/notification/${notifId}`);
};

export const requestAllDeleteNotification = (userToId) => {
  return axiosBearer.delete(`/notification/delete-all/${userToId}`);
};
