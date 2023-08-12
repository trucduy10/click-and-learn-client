import { axiosBearer } from "../../../api/axiosInstance";

export const requestGetCourses = () => {
  return axiosBearer.get("/course");
};

export const requestUpdateCourse = (data) => {
  return axiosBearer.put(`/course`, data);
};
