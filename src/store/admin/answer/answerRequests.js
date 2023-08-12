import { axiosBearer } from "../../../api/axiosInstance";

export const requestGetAnswersByQuestionId = (questionId) => {
  return axiosBearer.get(`/question/${questionId}/answer`);
};

export const requestPostAnswer = (data) => {
  return axiosBearer.post(`/question/${data.questionId}/answer`, data);
};

export const requestDeleteAnswer = (data) => {
  return axiosBearer.delete(
    `/question/{questionId}/answer?answerId=${data.answerId ?? data.id}`
  );
};
