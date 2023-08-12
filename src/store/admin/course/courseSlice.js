import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "adminCourse",
  initialState: {
    courses: [],
    isLoading: false,
    isUpdateCourseSuccess: false,
  },
  reducers: {
    onLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    onGetCourses: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onGetCoursesSuccess: (state, action) => ({
      ...state,
      courses: action.payload,
      isLoading: false,
    }),
    onUpdateCourse: (state, action) => ({
      ...state,
      isLoading: true,
      isUpdateCourseSuccess: false,
    }),
    onUpdateCourseSuccess: (state, action) => ({
      ...state,
      isUpdateCourseSuccess: action.payload,
    }),
  },
});

export const {
  onLoading,
  onGetCourses,
  onGetCoursesSuccess,
  onUpdateCourse,
  onUpdateCourseSuccess,
} = courseSlice.actions;
// reducer
export default courseSlice.reducer;
