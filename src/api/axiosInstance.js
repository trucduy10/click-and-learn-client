import axios from "axios";
import { BASE_API_URL } from "../constants/config";
import { getToken, setToken } from "../utils/auth";

// Default
const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

export const axiosBearer = axios.create({
  baseURL: BASE_API_URL,
});

axiosBearer.interceptors.request.use(
  (config) => {
    const { access_token } = getToken();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosBearer.interceptors.response.use(
  (res) => res,
  async (error) => {
    const prevReq = error.config;
    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      !prevReq.sent
    ) {
      prevReq.sent = true;
      const { refresh_token } = getToken();

      if (refresh_token) {
        const res = await axiosInstance.get(
          `/auth/refresh-token/${refresh_token}`
        );

        setToken(res.data.access_token, res.data.refresh_token);

        prevReq.headers.Authorization = `Bearer ${res.data.access_token}`;
      }

      return axiosBearer(prevReq); // newConfig
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
