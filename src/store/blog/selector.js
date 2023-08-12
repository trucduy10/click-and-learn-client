import { createSelector } from "@reduxjs/toolkit";

const selectBlogReducer = (state) => state.blogs; //store in rootReducer

export const selectBlogs = createSelector(
  [selectBlogReducer],
  (blogSlice) => blogSlice.blogs
);

export const selectBlogIsFecthing = createSelector(
  [selectBlogReducer],
  (blogSlice) => blogSlice.isFetching
);
