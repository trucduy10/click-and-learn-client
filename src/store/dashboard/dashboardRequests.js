const {
  default: axiosInstance,
  axiosBearer,
} = require("../../api/axiosInstance");

export const requestLoadDashboard = () => {
  return axiosBearer.get(`/home/admin/dashboard`);
};

export const requestLoadCategoryEnrollmentChart = () => {
  return axiosBearer.get(`/home/admin/category-chart`);
};

export const requestLoadRevenueYearChart = (year) => {
  return axiosBearer.get(`/home/admin/revenue-year-chart/${year}`);
};
