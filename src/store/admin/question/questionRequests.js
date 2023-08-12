import { axiosBearer } from "../../../api/axiosInstance";

export const requestGetQuestionsByPartId = (partId) => {
  return axiosBearer.get(`/part/${partId}/question`);
};

export const requestPostQuestion = (data) => {
  return axiosBearer.post(`/part/${data.partId}/question`, data);
};

export const requestDeleteQuestion = (data) => {
  return axiosBearer.delete(
    `/part/{partId}/question?questionId=${data.questionId ?? data.id}`
  );
};
