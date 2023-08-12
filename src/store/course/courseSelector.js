import { createSelector } from "@reduxjs/toolkit";

const selectCourseReducer = (state) => state.course; //store in rootReducer

export const selectAllCourseState = createSelector(
  [selectCourseReducer],
  (courseSlice) => ({
    isLoading: courseSlice.isLoading,
    isGenerating: courseSlice.isGenerating,
    isSubmitting: courseSlice.isSubmitting,
    data: courseSlice.data,
    courseId: courseSlice.courseId,
    lessonId: courseSlice.lessonId,
    enrollId: courseSlice.enrollId,
    learning: courseSlice.learning,
    video: courseSlice.video,
    captionData: courseSlice.video ? courseSlice.video.captionData : [],
    sectionId: courseSlice.sectionId,
    tracking: courseSlice.tracking,
    progress: courseSlice.progress,
    isSelectLessonManual: courseSlice.isSelectLessonManual,
    resumePoint: courseSlice.resumePoint,
    isReload: courseSlice.isReload,
    isReady: courseSlice.isReady,
    notes: courseSlice.notes,
    notifs: courseSlice.notifs,
    notifToastList: courseSlice.notifToastList,
    updatedNotif: courseSlice.updatedNotif,
    notifications: courseSlice.notifications,
    isAllDeleteNotification: courseSlice.isAllDeleteNotification,
    rating: courseSlice.rating,
    userRating: courseSlice.userRating,
    courseRating: courseSlice.courseRating,
    examination: courseSlice.examination,
    prevTime: courseSlice.prevTime,
    finishExam: courseSlice.finishExam,
    isLoadingFinish: courseSlice.isLoadingFinish,
    generateExamSuccess: courseSlice.generateExamSuccess,
    retakeExam: courseSlice.retakeExam,
    countdown: courseSlice.countdown,
    accomplishments: courseSlice.accomplishments,
    cert: courseSlice.cert,
  })
);

export const selectCountDown = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.countdown
);

export const selectEnrollIdAndCourseId = createSelector(
  [selectCourseReducer],
  (courseSlice) => ({
    enrollId: courseSlice.enrollId,
    courseId: courseSlice.courseId,
    isEnrolled: courseSlice.isEnrolled,
  })
);

export const selectVideo = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.video
);

export const selectSectionId = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.sectionId
);

export const selectLearningAndTracking = createSelector(
  [selectCourseReducer],
  (courseSlice) => ({
    learning: courseSlice.learning,
    tracking: courseSlice.tracking,
  })
);

export const selectLearning = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.learning
);
export const selectIsLoading = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.isLoading
);

export const selectTracking = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.tracking
);

export const selectProgress = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.progress
);
export const selectLearningLessonLength = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.learning.lessonDto.length
);
export const selectIsLoadLearningStatus = createSelector(
  [selectCourseReducer],
  (courseSlice) => courseSlice.isLoadLearningStatus
);

// export const selectCourseFailed = createSelector(
//   [selectCourseReducer],
//   (courseSlice) => courseSlice.error
// );
