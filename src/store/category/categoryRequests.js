const {
  default: axiosInstance,
  axiosBearer,
} = require("../../api/axiosInstance");

export const requestLoadCategories = () => {
  return axiosBearer.get(`/category`);
};
