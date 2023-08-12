import { axiosBearer } from "../../../api/axiosInstance";

export const requestGetPartsByCourseId = (courseId) => {
  return axiosBearer.get(`/course/${courseId}/part`);
};

export const requestPostPart = (data) => {
  return axiosBearer.post(`/course/${data.courseId}/part`, data);
};

export const requestDeletePart = (data) => {
  return axiosBearer.delete(
    `/course/{courseId}/part?partId=${data.partId ?? data.id}`
  );
};
