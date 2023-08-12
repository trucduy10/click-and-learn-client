import { addNewNotes, deleteNotes, updateLessonDto } from "./courseHelper";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isLoading: false,
  isLoadLearningStatus: false,
  isSubmitting: false,
  isSelectLessonManual: false,
  isReload: false,
  isReady: false,
  isEnrolled: undefined,
  data: [], //onCourseLoading() - HomePage.js, CoursePage.js
  freeCourse: [],
  bestSellerCourse: [],
  relatedCourse: [],
  errorMessage: null,
  courseId: 0, //onSelectedCourse(slug) - LearnPage.js -> filter data => data.slug === slug
  enrollId: 0, //onGetEnrollId(courseId, userId) - LearnPage.js
  sectionId: 0, //onSelectedLesson(sectionId, lessonId) - CollapseAntCom.js -> sectionId: action.payload.sectionId,
  lessonId: 0, //onSelectedLesson(sectionId, lessonId) - CollapseAntCom.js -> lessionId: action.payload.lessonId,
  resumePoint: 0, //onSelectedLesson(sectionId, lessonId) - CollapseAntCom.js -> lessionId: action.payload.lessonId,
  //onGetLearning(courseId) - LearnSidebarMod.js
  learning: {
    sectionDto: [], //All section of giving course
    lessonDto: [], //All lesson of giving course
    videoDto: [], //All video of giving course
  },
  video: null, //onSelectedLesson(sectionId, lessonId) - CollapseAntCom.js -> filter learning.videoDto => videoDto.lessonId === lessonId
  tracking: null, // onGetTrackingLesson(enrollId, courseId) - courseHandlers.js -> select where tracked = TRUE
  progress: 0, //onLoadProgress(enrollId, courseId) - CollapseAntCom.js -> update where completed = TRUE
  notes: [], //onGetNote
  // posts: [], //onSavePost
  notifs: [],
  notifToastList: [],
  updatedNotif: [],
  rating: 0,
  userRating: 0,
  courseRating: [],
  examination: [],
  finishExam: null,
  generateExamSuccess: false,
  isGenerating: false,
  countdown: -1,
  retakeExam: {
    examSession: 0,
    correctAnswer: "",
    totalExamTime: 0,
    totalPoint: 0,
    grade: null,
    created_at: null,
    passed: false,
  },
  accomplishments: [],
  cert: null,
  notifications: [],
  isAllDeleteNotification: false,
  prevTime: -1,
};
const courseSlice = createSlice({
  name: "course",
  initialState: { ...initialState },
  reducers: {
    onCourseInitalState: (state, action) => ({
      ...initialState,
    }),
    onReload: (state, action) => {
      return {
        ...state,
        errorMessage: null,
        isReload: action.payload,
        isLoadLearningStatus: false,
        generateExamSuccess: false,
      };
    },
    onMyCourseLoading: (state, action) => ({
      ...initialState,
      errorMessage: null,
      generateExamSuccess: false,
      bestSellerCourse: state.bestSellerCourse,
      data: state.data,
      freeCourse: state.freeCourse,
    }),
    onMyCourseSuccess: (state, action) => ({
      ...state,
      data: action.payload,
    }),
    onMyCourseFailed: (state, action) => ({
      ...state,
      errorMessage: action.payload,
    }),
    onCourseLoading: (state, action) => ({
      ...state,
      isEnrolled: undefined,
      errorMessage: null,
    }),
    onCourseSuccess: (state, action) => ({
      ...state,
      data: action.payload,
    }),
    onCourseFailed: (state, action) => ({
      ...state,
      errorMessage: action.payload,
    }),
    onFreeCourseLoading: (state, action) => ({
      ...state,
      errorMessage: null,
    }),
    onFreeCourseSuccess: (state, action) => ({
      ...state,
      freeCourse: action.payload,
    }),
    onBestSellerCourseLoading: (state, action) => ({
      ...state,
      errorMessage: null,
    }),
    onBestSellerCourseSuccess: (state, action) => ({
      ...state,
      bestSellerCourse: action.payload,
    }),
    onRelatedCourseLoading: (state, action) => ({
      ...state,
      errorMessage: null,
    }),
    onRelatedCourseSuccess: (state, action) => ({
      ...state,
      relatedCourse: action.payload,
    }),
    onSelectedCourse: (state, action) => {
      const filteredCourse = state.data.filter(
        (course) => course.slug === action.payload
      );

      if (filteredCourse.length > 0) {
        return {
          ...state,
          courseId: filteredCourse[0].id,

          rating: filteredCourse[0].rating,
          userRating: filteredCourse[0].userRating,
          generateExamSuccess: false,
          countdown: -1,
        };
      }
      return {
        ...state,
        generateExamSuccess: false,
        countdown: -1,
      };
    },
    onSelectedLesson: (state, action) => {
      const filteredVideo = state.learning.videoDto.filter(
        (video) => video.lessonId === action.payload.lessonId
      );

      if (filteredVideo.length > 0) {
        return {
          ...state,
          sectionId: action.payload.sectionId,
          video: filteredVideo[0],
          lessonId: action.payload.lessonId,
        };
      }
      return {
        ...state,
        sectionId: action.payload.sectionId,
        lessonId: action.payload.lessonId,
        video: null,
      };
    },
    onManualSelectedLesson: (state, action) => {
      const filteredVideo = state.learning.videoDto.filter(
        (video) => video.lessonId === action.payload.lessonId
      );

      if (filteredVideo.length > 0) {
        return {
          ...state,
          sectionId: action.payload.sectionId,
          video: filteredVideo[0],
          lessonId: action.payload.lessonId,
          isSelectLessonManual: false,
          isReady: false,
        };
      }
      return {
        ...state,
        sectionId: action.payload.sectionId,
        lessonId: action.payload.lessonId,
        isSelectLessonManual: false,
        isReady: false,
      };
    },
    onManualSelectedLessonSuccess: (state, action) => ({
      ...state,
      resumePoint: action.payload.resumePoint,
      tracking: action.payload.lessonId === 0 ? null : action.payload,
      isReady: true,
      isReload: true,
      isSelectLessonManual: true,
    }),
    onGetEnrollId: (state, action) => ({
      ...state,
      isEnrolled: undefined,
      errorMessage: null,
    }),
    onGetEnrollIdSuccess: (state, action) => ({
      ...state,
      isEnrolled: action.payload > 0 ? true : false,
      enrollId: action.payload,
    }),
    onGetLearning: (state, action) => ({
      ...state,
      errorMessage: null,
      isLoadLearningStatus: false,
      isLoading: true,
    }),
    onGetLearningSuccess: (state, action) => ({
      ...state,
      learning: action.payload,
      isLoadLearningStatus: true,
      isLoading: false,
    }),
    onGetMyLearning: (state, action) => ({
      ...state,
      errorMessage: null,
      isLoadLearningStatus: false,
      isLoading: true,
      learning: {
        sectionDto: [],
        lessonDto: [],
        videoDto: [],
      },
      video: state.courseId !== action.payload.courseId ? null : state.video,
    }),
    onGetMyLearningSuccess: (state, action) => ({
      ...state,
      learning: action.payload,
      isLoadLearningStatus: true,
      isLoading: false,
    }),
    onGetTrackingLesson: (state, action) => ({
      ...state,
      errorMessage: null,
    }),
    onGetTrackingLessonSuccess: (state, action) => {
      // const filteredVideo = state.learning.videoDto.find(
      //   (video) => video.lessonId === action.payload.lessonId
      // );
      return {
        ...state,
        tracking: action.payload,
        resumePoint: action.payload ? action.payload.resumePoint : 0,
        //video: filteredVideo ? filteredVideo : null,
      };
    },
    onSaveTrackingLesson: (state, action) => ({
      ...state,
      errorMessage: null,
    }),
    onSaveTrackingLessonSuccess: (state, action) => ({
      ...state,
      tracking: action.payload,
    }),
    onSaveTrackingVideo: (state, action) => ({
      ...state,
      errorMessage: null,
      lessonId: action.payload.lessonId,
    }),
    onSaveTrackingVideoSuccess: (state, action) => ({
      ...state,
      tracking: action.payload,
    }),
    onUpdateCompletedVideo: (state, action) => ({
      ...state,
      errorMessage: null,
      learning: {
        ...state.learning,
        lessonDto: updateLessonDto(
          state.learning.lessonDto,
          action.payload.lessonId
        ),
      },
    }),
    onUpdateCompletedVideoSuccess: (state, action) => ({
      ...state,
      progress: action.payload,
    }),
    onLoadProgress: (state, action) => ({
      ...state,
      errorMessage: null,
      progress: 0,
    }),
    onLoadProgressSuccess: (state, action) => ({
      ...state,
      progress: action.payload,
    }),
    onReady: (state, action) => ({
      ...state,
      isReady: action.payload,
    }),
    onLoadNote: (state, action) => state,
    onLoadNoteSuccess: (state, action) => ({
      ...state,
      notes: action.payload,
    }),
    onSaveNote: (state, action) => state,
    onSaveNoteSuccess: (state, action) => {
      return {
        ...state,
        notes: addNewNotes(state.notes, action.payload),
      };
    },
    onDeleteNote: (state, action) => state,
    onDeleteNoteSuccess: (state, action) => {
      return {
        ...state,
        notes: deleteNotes(state.notes, action.payload),
      };
    },
    onSelectedNote: (state, action) => {
      const filteredVideo = state.learning.videoDto.find(
        (video) => video.lessonId === action.payload.lessonId
      );

      return {
        ...state,
        sectionId: action.payload.sectionId,
        lessonId: action.payload.lessonId,
        resumePoint: action.payload.resumePoint,
        video: filteredVideo,
      };
    },
    onSavePost: (state, action) => ({
      ...state,
      isSubmitting: true,
    }),
    onSavePostSuccess: (state, action) => ({
      ...state,
      isSubmitting: false,
    }),
    onDeletePost: (state, action) => state,
    onSaveReplyToPost: (state, action) => ({
      ...state,
      isSubmitting: true,
    }),
    onSaveReplyToPostSuccess: (state, action) => ({
      ...state,
      isSubmitting: false,
    }),
    onRemoveReplyInPost: (state, action) => state,
    onSaveLikeOfPost: (state, action) => state,
    onLoadNotification: (state, action) => state,
    onLoadNotificationSuccess: (state, action) => ({
      ...state,
      notifs: action.payload,
    }),
    onAddNotification: (state, action) => ({
      ...state,
      notifs: action.payload,
      notifToastList: action.payload,
    }),
    onReadNotification: (state, action) => state,
    onReadNotificationSuccess: (state, action) => state,
    onReadAllNotification: (state, action) => state,
    onReadAllNotificationSuccess: (state, action) => state,
    onRemoveFromToastList: (state, action) => {
      let newNotif = [action.payload];
      const filteredNotif = newNotif.filter((x) => x.id !== action.payload.id);
      return {
        ...state,
        updatedNotif: filteredNotif,
      };
    },
    onUpdateUserRating: (state, action) => state,
    onUpdateUserRatingSuccess: (state, action) => ({
      ...state,
      userRating: action.payload,
    }),
    onLoadCourseRating: (state, action) => state,
    onLoadCourseRatingSuccess: (state, action) => ({
      ...state,
      courseRating: action.payload,
    }),
    onGenerateCourseExam: (state, action) => ({
      ...state,
      isGenerating: true,
      generateExamSuccess: false,
    }),
    onGenerateCourseExamSuccess: (state, action) => ({
      ...state,
      examination: action.payload,
      isGenerating: false,
      generateExamSuccess: true,
    }),
    onFinishExam: (state, action) => ({
      ...state,
      isLoadingFinish: true,
    }),
    onFinishExamSuccess: (state, action) => ({
      ...state,
      finishExam: action.payload,
      generateExamSuccess: false,
      isLoadingFinish: false,
    }),
    onRetakeExam: (state, action) => state,
    onRetakeExamSuccess: (state, action) => ({
      ...state,
      retakeExam: action.payload,
    }),
    onCountdown: (state, action) => ({
      ...state,
      countdown: state.countdown === 0 ? 0 : action.payload,
    }),
    onLoadAccomplishmentsExam: (state, action) => state,
    onLoadAccomplishmentsExamSuccess: (state, action) => ({
      ...state,
      accomplishments: action.payload,
    }),

    onSelectedCertificate: (state, action) => {
      const filteredCert = state.accomplishments.filter(
        (cert) => cert.certificateUID === action.payload
      );

      if (filteredCert.length > 0) {
        return {
          ...state,
          cert: filteredCert[0],
        };
      }
      return {
        ...state,
      };
    },
    onLoadCertificate: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadCertificateSuccess: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    onDownloadCertificate: (state, action) => state,
    onAllNotification: (state, action) => ({
      ...state,
      isAllDeleteNotification: false,
    }),
    onAllNotificationSuccess: (state, action) => ({
      ...state,
      notifications: action.payload,
    }),
    onDeleteNotification: (state, action) => state,
    onDeleteNotificationSuccess: (state, action) => {
      const updatedNotifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
      return {
        ...state,
        notifications: updatedNotifications,
      };
    },
    onAllDeleteNotification: (state, action) => ({
      ...state,
      isAllDeleteNotification: false,
    }),
    onAllDeleteNotificationSuccess: (state, action) => {
      const { id } = action.payload;
      const updatedNotifications = state.notifications.filter(
        (user) => user.id === id
      );
      return {
        ...state,
        notifications: updatedNotifications,
        isAllDeleteNotification: true,
      };
    },
    onUnloadExam: (state, action) => ({
      ...state,
      prevTime: action.payload,
    }),
  },
});

export const {
  onCourseInitalState,
  onReload,
  onMyCourseLoading,
  onMyCourseSuccess,
  onMyCourseFailed,
  onCourseLoading,
  onCourseSuccess,
  onCourseFailed,
  onFreeCourseLoading,
  onFreeCourseSuccess,
  onBestSellerCourseLoading,
  onBestSellerCourseSuccess,
  onRelatedCourseLoading,
  onRelatedCourseSuccess,
  onSelectedCourse,
  onSelectedLesson,
  onManualSelectedLesson,
  onManualSelectedLessonSuccess,
  onGetEnrollId,
  onGetEnrollIdSuccess,
  onGetLearning,
  onGetLearningSuccess,
  onGetMyLearning,
  onGetMyLearningSuccess,
  onGetTrackingLesson,
  onSaveTrackingLesson,
  onGetTrackingLessonSuccess,
  onSaveTrackingLessonSuccess,
  onSaveTrackingVideo,
  onSaveTrackingVideoSuccess,
  onUpdateCompletedVideo,
  onUpdateCompletedVideoSuccess,
  onLoadProgress,
  onLoadProgressSuccess,
  onReady,
  onLoadNote,
  onLoadNoteSuccess,
  onSaveNote,
  onSaveNoteSuccess,
  onDeleteNote,
  onDeleteNoteSuccess,
  onSelectedNote,
  onSavePost,
  onSavePostSuccess,
  onDeletePost,
  onSaveReplyToPost,
  onSaveReplyToPostSuccess,
  onSaveLikeOfPost,
  onLoadNotification,
  onLoadNotificationSuccess,
  onAddNotification,
  onReadNotification,
  onReadNotificationSuccess,
  onReadAllNotification,
  onReadAllNotificationSuccess,
  onRemoveFromToastList,
  onRemoveReplyInPost,
  onUpdateUserRating,
  onUpdateUserRatingSuccess,
  onLoadCourseRating,
  onLoadCourseRatingSuccess,
  onGenerateCourseExam,
  onGenerateCourseExamSuccess,
  onUnloadExam,
  onFinishExam,
  onFinishExamSuccess,
  onRetakeExam,
  onRetakeExamSuccess,
  onCountdown,
  onLoadAccomplishmentsExam,
  onLoadAccomplishmentsExamSuccess,
  onSelectedCertificate,
  onLoadCertificate,
  onLoadCertificateSuccess,
  onDownloadCertificate,
  onAllNotification,
  onAllNotificationSuccess,
  onDeleteNotification,
  onDeleteNotificationSuccess,
  onAllDeleteNotification,
  onAllDeleteNotificationSuccess,
} = courseSlice.actions;
// courseReducer
export default courseSlice.reducer;
