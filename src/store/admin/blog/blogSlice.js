import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "adminBlog",
  initialState: {
    adminBlogs: [], // adminBlogs used for admin
    blogs: [], // blogs used for client
    myBlogs: [], // blogs by user id used for client
    blogId: null,
    isLoading: false,
    isPostBlogSuccess: false,
    isBulkDeleteSuccess: false,
    isBulkDeleteMyBlogSuccess: false,
    isSaveBlogIdSuccess: false,
  },
  reducers: {
    onLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    // adminBlogs used for admin
    onGetBlogsForAdmin: (state, action) => ({
      ...state,
      isLoading: true,
      isPostBlogSuccess: false,
    }),
    onGetBlogsForAdminSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isBulkDeleteSuccess: false,
      adminBlogs: action.payload,
    }),
    onSaveBlogId: (state, action) => ({
      ...state,
      isLoading: true,
      isSaveBlogIdSuccess: false,
    }),
    onSaveBlogIdSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      blogId: action.payload,
      isSaveBlogIdSuccess: true,
    }),
    onSaveBlogIdDone: (state, action) => ({
      ...state,
      isSaveBlogIdSuccess: action.payload,
    }),
    // blogs used for client
    onGetBlogs: (state, action) => ({
      ...state,
      isLoading: true,
      isPostBlogSuccess: false,
    }),
    onGetBlogsSuccess: (state, action) => ({
      ...state,
      blogs: action.payload,
      isLoading: false,
    }),
    onPostBlog: (state, action) => ({
      ...state,
      isLoading: true,
      isPostBlogSuccess: false,
    }),
    onPostBlogSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isPostBlogSuccess: action.payload,
    }),
    onDeleteBlog: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onBulkDeleteBlog: (state, action) => ({
      ...state,
      isLoading: true,
      isBulkDeleteSuccess: false,
    }),
    onBulkDeleteBlogSuccess: (state, action) => ({
      ...state,
      isBulkDeleteSuccess: action.payload,
    }),
    // myBlogs used for manage page of User
    onGetMyBlogs: (state, action) => ({
      ...state,
      isLoading: true,
      isPostBlogSuccess: false,
    }),
    onGetMyBlogsSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isBulkDeleteMyBlogSuccess: false,
      myBlogs: action.payload,
    }),
    onDeleteMyBlog: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onBulkDeleteMyBlog: (state, action) => ({
      ...state,
      isLoading: true,
      isBulkDeleteMyBlogSuccess: false,
    }),
    onBulkDeleteMyBlogSuccess: (state, action) => ({
      ...state,
      isBulkDeleteMyBlogSuccess: action.payload,
    }),
  },
});

export const {
  onLoading,
  onGetBlogsForAdmin,
  onGetBlogsForAdminSuccess,
  onSaveBlogId,
  onSaveBlogIdSuccess,
  onSaveBlogIdDone,
  onGetBlogs,
  onGetBlogsSuccess,
  onGetMyBlogs,
  onGetMyBlogsSuccess,
  onGetBlogsById,
  onPostBlog,
  onPostBlogSuccess,
  onDeleteBlog,
  onBulkDeleteBlog,
  onBulkDeleteBlogSuccess,
  onDeleteMyBlog,
  onBulkDeleteMyBlog,
  onBulkDeleteMyBlogSuccess,
} = blogSlice.actions;
// reducer
export default blogSlice.reducer;
