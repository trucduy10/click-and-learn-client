import { call, put, delay } from "redux-saga/effects";
import { showMessageError } from "../../utils/helper";
import {
  MESSAGE_CHANGE_PASSWORD_SUCCESS,
  MESSAGE_FORGET_PASSWORD_SUCCESS,
  MESSAGE_GENERAL_FAILED,
} from "../../constants/config";
import {
  requestBestSellerCourse,
  requestCourse,
  requestDeleteNote,
  requestDeletePost,
  requestDeleteReply,
  requestEnrollId,
  requestFinishCourseExam,
  requestFreeCourse,
  requestGenerateCourseExam,
  requestLearning,
  requestLoadAccomplishmentsExam,
  requestLoadCertificate,
  requestLoadCourseRating,
  requestLoadNote,
  requestLoadNotification,
  requestLoadProgress,
  requestLoadTracking,
  requestMyCourse,
  requestMyLearning,
  requestReadAllNotification,
  requestReadNotification,
  requestRelatedCourse,
  requestRetakeCourseExam,
  requestSaveLike,
  requestSaveNote,
  requestSavePost,
  requestSaveReply,
  requestSaveTrackingLesson,
  requestSaveTrackingVideo,
  requestUpdateCompleted,
  requestUpdateUserRating,
  requestAllNotification,
  requestDeleteNotification,
  requestAllDeleteNotification,
} from "./courseRequests";
import {
  onAllDeleteNotificationSuccess,
  onAllNotification,
  onAllNotificationSuccess,
  onBestSellerCourseSuccess,
  onCourseFailed,
  onCourseSuccess,
  onDeleteNoteSuccess,
  onDeleteNotificationSuccess,
  onFinishExamSuccess,
  onFreeCourseSuccess,
  onGenerateCourseExamSuccess,
  onGetEnrollIdSuccess,
  onGetLearningSuccess,
  onGetMyLearningSuccess,
  onGetTrackingLessonSuccess,
  onLoadAccomplishmentsExamSuccess,
  onLoadCertificateSuccess,
  onLoadCourseRatingSuccess,
  onLoadNoteSuccess,
  onLoadNotificationSuccess,
  onLoadProgressSuccess,
  onManualSelectedLessonSuccess,
  onMyCourseFailed,
  onMyCourseSuccess,
  onReadAllNotificationSuccess,
  onReadNotificationSuccess,
  onRelatedCourseSuccess,
  onRetakeExamSuccess,
  onSaveNoteSuccess,
  onSavePostSuccess,
  onSaveReplyToPostSuccess,
  onSaveTrackingVideoSuccess,
  onUpdateCompletedVideoSuccess,
  onUpdateUserRatingSuccess,
} from "./courseSlice";
import { toast } from "react-toastify";

function* handleOnMyCourseLoading(action) {
  try {
    const res = yield call(requestMyCourse, action.payload);

    if (res.status === 200) {
      yield put(onMyCourseSuccess(res.data));
    } else {
      yield put(onMyCourseFailed(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}

function* handleOnCourseLoading() {
  try {
    const res = yield call(requestCourse);

    if (res.status === 200) {
      yield put(onCourseSuccess(res.data));
    } else {
      yield put(onCourseFailed(res.data));
    }
  } catch (error) {
    // console.log(error);
  }
}
function* handleOnFreeCourseLoading() {
  try {
    const res = yield call(requestFreeCourse);

    if (res.status === 200) {
      yield put(onFreeCourseSuccess(res.data));
    }
  } catch (error) {
    // console.log(error);
  }
}
function* handleOnBestSellerCourseLoading() {
  try {
    const res = yield call(requestBestSellerCourse);

    if (res.status === 200) {
      yield put(onBestSellerCourseSuccess(res.data));
    }
  } catch (error) {
    // console.log(error);
  }
}
function* handleOnRelatedCourseLoading({ payload }) {
  try {
    const res = yield call(requestRelatedCourse, payload);

    if (res.status === 200) {
      yield put(onRelatedCourseSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}

function* handleOnGetEnrollId({ payload }) {
  try {
    const res = yield call(requestEnrollId, payload);

    if (res.status === 200) {
      yield put(onGetEnrollIdSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleOnGetLearning({ payload }) {
  try {
    yield delay(2500);
    const res = yield call(requestLearning, payload);

    if (res.status === 200) {
      yield put(onGetLearningSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleOnGetMyLearning({ payload }) {
  try {
    yield delay(2500);
    const res = yield call(requestMyLearning, {
      courseId: payload.courseId,
      enrollId: payload.enrollId,
    });

    if (res.status === 200) {
      yield put(onGetMyLearningSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleOnGetTrackingLesson({ payload }) {
  try {
    const res = yield call(requestLoadTracking, payload);
    if (res.status === 200) {
      const { lessonId } = res.data;
      if (lessonId === 0) {
        yield put(onGetTrackingLessonSuccess(null));
      } else {
        yield put(onGetTrackingLessonSuccess(res.data));
      }
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleOnManualSelectedLesson({ payload }) {
  try {
    const res = yield call(requestLoadTracking, payload);
    console.log(res.data);
    if (res.status === 200) {
      // const { resumePoint } = res.data;
      yield put(onManualSelectedLessonSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleOnSaveTrackingLesson({ payload }) {
  try {
    const res = yield call(requestSaveTrackingLesson, payload);

    if (res.status === 200) {
      const { lessonId } = res.data;
      if (lessonId === 0) {
        yield put(onGetTrackingLessonSuccess(null));
      } else {
        yield put(onGetTrackingLessonSuccess(res.data));
      }
    }
  } catch (error) {}
}
function* handleOnSaveTrackingVideo({ payload }) {
  try {
    const res = yield call(requestSaveTrackingVideo, payload);

    if (res.status === 200) {
      yield put(onSaveTrackingVideoSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleOnUpdateCompletedVideo({ payload }) {
  try {
    const res = yield call(requestUpdateCompleted, payload);
    if (res.status === 200) {
      yield put(onUpdateCompletedVideoSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}

function* handleLoadProgress({ payload }) {
  try {
    const res = yield call(requestLoadProgress, payload);
    if (res.status === 200) {
      yield put(onLoadProgressSuccess(res.data));
    }
  } catch (error) {
    // showMessageError(error);
  }
}
function* handleLoadNote({ payload }) {
  try {
    const res = yield call(requestLoadNote, payload);
    if (res.status === 200) {
      yield put(onLoadNoteSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleSaveNote({ payload }) {
  try {
    const res = yield call(requestSaveNote, payload);
    console.log(res.data);
    if (res.status === 200) {
      yield put(onSaveNoteSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    showMessageError(error);
  }
}

function* handleDeleteNote({ payload }) {
  try {
    const res = yield call(requestDeleteNote, payload);
    if (res.status === 200) {
      yield put(onDeleteNoteSuccess(payload));
    }
  } catch (error) {
    console.log(error);
    showMessageError(error);
  }
}

function* handleSavePost({ payload }) {
  try {
    const res = yield call(requestSavePost, payload);
    if (res.status === 200) {
      yield put(onSavePostSuccess());
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleDeletePost({ payload }) {
  try {
    const res = yield call(requestDeletePost, payload);
    if (res.status === 200) {
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleSaveReplyToPost({ payload }) {
  try {
    const res = yield call(requestSaveReply, payload);
    if (res.status === 200) {
      yield put(onSaveReplyToPostSuccess());
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleRemoveReplyInPost({ payload }) {
  try {
    const res = yield call(requestDeleteReply, payload);
    if (res.status === 200) {
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleSaveLikeOfPost({ payload }) {
  try {
    const res = yield call(requestSaveLike, payload);
    if (res.status === 200) {
    }
  } catch (error) {
    console.log(error);
  }
}
function* handleLoadNotification({ payload }) {
  try {
    const res = yield call(requestLoadNotification, payload);
    console.log(res.data);
    if (res.status === 200) {
      yield put(onLoadNotificationSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
  }
}
function* handleReadNotification({ payload }) {
  try {
    const res = yield call(requestReadNotification, payload);
    if (res.status === 200) {
      yield put(onReadNotificationSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
  }
}
function* handleReadAllNotification({ payload }) {
  try {
    const res = yield call(requestReadAllNotification, payload);
    if (res.status === 200) {
      yield put(onReadAllNotificationSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleUpdateUserRating({ payload }) {
  try {
    const res = yield call(requestUpdateUserRating, payload);
    if (res.status === 200) {
      yield put(onUpdateUserRatingSuccess(payload.rating));
      toast.success("Thank for your rating.");
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleLoadCourseRating({ payload }) {
  try {
    const res = yield call(requestLoadCourseRating, payload);
    if (res.status === 200) {
      yield put(onLoadCourseRatingSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

function* handleGenerateCourseExam({ payload }) {
  try {
    const res = yield call(requestGenerateCourseExam, payload);
    console.log(res.data);
    if (res.status === 200) {
      yield put(onGenerateCourseExamSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

function* handleFinishExam({ payload }) {
  try {
    const res = yield call(requestFinishCourseExam, payload);
    console.log(res.data);
    if (res.status === 200) {
      yield put(onFinishExamSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleRetakeExam({ payload }) {
  try {
    const res = yield call(requestRetakeCourseExam, payload);
    console.log(res.data);
    if (res.status === 200) {
      yield put(onRetakeExamSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleLoadAccomplishmentsExam({ payload }) {
  try {
    const res = yield call(requestLoadAccomplishmentsExam, payload);
    console.log(res.data);
    if (res.status === 200) {
      yield put(onLoadAccomplishmentsExamSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleLoadCertificate({ payload }) {
  try {
    const res = yield call(requestLoadCertificate, payload);
    console.log(res.data);
    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const fileObjectUrl = URL.createObjectURL(blob);

      sessionStorage.setItem("certificatePdf", fileObjectUrl);
      yield put(onLoadCertificateSuccess());
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleDownloadCertificate() {
  try {
    const link = document.createElement("a");
    link.href = sessionStorage.getItem("certificatePdf");
    link.download = `certificate-${+new Date()}.pdf`;
    link.click();
    /// window.open(sessionStorage.getItem("certificate"));
  } catch (error) {
    console.log("error", error);
    yield null;
  }
}
function* handleAllNotification({ payload }) {
  try {
    const res = yield call(requestAllNotification, payload.userToId);
    if (res.status === 200) {
      yield put(onAllNotificationSuccess(res.data));
      toast.success(res.data.message);
    } else {
      toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    showMessageError(error);
  }
}
function* handleDeleteNotification({ payload }) {
  try {
    const res = yield call(requestDeleteNotification, payload);
    if (res.status === 200) {
      toast.success(`Delete notification success`);
      yield put(onDeleteNotificationSuccess(payload));
    }
  } catch (error) {
    showMessageError(error);
  }
}

function* handleAllDeleteNotification({ payload }) {
  try {
    const res = yield call(requestAllDeleteNotification, payload);
    if (res.status === 200) {
      toast.success("Delete all selected notifications success");
      yield put(onAllDeleteNotificationSuccess(payload));
    }
  } catch (error) {
    showMessageError(error);
  }
}
export {
  handleLoadNote,
  handleLoadProgress,
  handleOnBestSellerCourseLoading,
  handleOnCourseLoading,
  handleOnFreeCourseLoading,
  handleOnGetEnrollId,
  handleOnGetLearning,
  handleOnGetMyLearning,
  handleOnGetTrackingLesson,
  handleOnManualSelectedLesson,
  handleOnMyCourseLoading,
  handleOnRelatedCourseLoading,
  handleOnSaveTrackingLesson,
  handleOnSaveTrackingVideo,
  handleOnUpdateCompletedVideo,
  handleSaveNote,
  handleDeleteNote,
  handleSavePost,
  handleDeletePost,
  handleSaveReplyToPost,
  handleRemoveReplyInPost,
  handleSaveLikeOfPost,
  handleLoadNotification,
  handleReadNotification,
  handleReadAllNotification,
  handleUpdateUserRating,
  handleLoadCourseRating,
  handleGenerateCourseExam,
  handleFinishExam,
  handleRetakeExam,
  handleLoadAccomplishmentsExam,
  handleLoadCertificate,
  handleDownloadCertificate,
  handleAllNotification,
  handleDeleteNotification,
  handleAllDeleteNotification,
};
