import { axiosBearer } from "../../../api/axiosInstance";

export const requestGetBlogsForAdmin = () => {
  return axiosBearer.get("/blog/blogs-admin");
};

export const requestGetBlogs = () => {
  return axiosBearer.get("/blog/blogs");
};

export const requestGetMyBlogs = (data) => {
  return axiosBearer.get(`/blog/my-blog/${data}`);
};

export const requestPostBlog = (data) => {
  return !data.id
    ? axiosBearer.post("/blog", data)
    : axiosBearer.put("/blog", data);
};

export const requestDeleteBlog = (data) => {
  return axiosBearer.delete(`/blog/${data}`);
};
