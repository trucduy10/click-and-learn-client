import { BLOG_ACTION_TYPES } from "./type";

export const fetchBlogStart = (pageNo, pageSize) =>({
  type: BLOG_ACTION_TYPES.FETCH_BLOG_START,
  payload: {pageNo, pageSize},
});

export const fetchBlogSuccess = (blogs) => ({
  type: BLOG_ACTION_TYPES.FETCH_BLOG_SUCCESS,
  payload: blogs,
});

export const fetchBlogFailed = (error) => ({
  type: BLOG_ACTION_TYPES.FETCH_BLOG_FAILED,
  payload: error,
});
