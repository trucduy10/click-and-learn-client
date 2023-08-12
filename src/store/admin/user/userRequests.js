import { axiosBearer } from "../../../api/axiosInstance";
// Get users with role = "USER"
export const requestGetUsers = () => {
  return axiosBearer.get("/auth/user");
};
// Get all users
export const requestGetAllUsers = () => {
  return axiosBearer.get("/auth/user/all");
};

export const requestCreateUser = (data) => {
  return axiosBearer.post(`/auth/user/organize`, data);
};

export const requestUpdateUser = (data) => {
  return axiosBearer.put(`/auth/user`, data);
};

export const requestDeleteUser = (id) => {
  return axiosBearer.delete(`/auth/user?userId=${id}`);
};
