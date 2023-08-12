import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import {
  APP_KEY_NAME,
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_EXPIRED_DAYS,
  COOKIE_REFRESH_TOKEN_KEY,
  MESSAGE_LOGIN_REQUIRED,
} from "../constants/config";
import { toast } from "react-toastify";

export const objCookies = {
  expires: COOKIE_EXPIRED_DAYS,
  domain: process.env.REACT_APP_COOKIE_DOMAIN,
};

export const setToken = (access_token, refresh_token) => {
  if (access_token && refresh_token) {
    Cookies.set(COOKIE_ACCESS_TOKEN_KEY, access_token, {
      ...objCookies,
    });

    Cookies.set(COOKIE_REFRESH_TOKEN_KEY, refresh_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(COOKIE_ACCESS_TOKEN_KEY, {
      ...objCookies,
      path: "/",
      domain: process.env.REACT_APP_COOKIE_DOMAIN,
    });

    Cookies.remove(COOKIE_REFRESH_TOKEN_KEY, {
      ...objCookies,
      path: "/",
      domain: process.env.REACT_APP_COOKIE_DOMAIN,
    });
  }
};

export const getToken = () => {
  const access_token = Cookies.get(COOKIE_ACCESS_TOKEN_KEY);
  const refresh_token = Cookies.get(COOKIE_REFRESH_TOKEN_KEY);

  return {
    access_token,
    refresh_token,
  };
};

export const removeToken = () => {
  const access_token = Cookies.get(COOKIE_ACCESS_TOKEN_KEY);
  if (access_token) {
    Cookies.remove(COOKIE_ACCESS_TOKEN_KEY, {
      ...objCookies,
      path: "/",
      domain: process.env.REACT_APP_COOKIE_DOMAIN,
    });

    Cookies.remove(COOKIE_REFRESH_TOKEN_KEY, {
      ...objCookies,
      path: "/",
      domain: process.env.REACT_APP_COOKIE_DOMAIN,
    });
  }
};

export const setRememberUser = (email, password) => {
  const encryptedEmail = CryptoJS.AES.encrypt(
    email,
    process.env.REACT_APP_COOKIE_HASH_KEY ?? "ricpham_250293"
  ).toString();
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.REACT_APP_COOKIE_HASH_KEY ?? "ricpham_250293"
  ).toString();

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  Cookies.set(
    `${APP_KEY_NAME}_remember`,
    `${encryptedEmail}|||${encryptedPassword}`,
    {
      ...objCookies,
      expires,
    }
  );
};

export const getRememberUser = () => {
  const cookieValue = Cookies.get(`${APP_KEY_NAME}_remember`);

  if (cookieValue) {
    const [encryptedEmail, encryptedPassword] = cookieValue.split("|||");

    const email = CryptoJS.AES.decrypt(
      encryptedEmail,
      process.env.REACT_APP_COOKIE_HASH_KEY ?? "ricpham_250293"
    ).toString(CryptoJS.enc.Utf8);
    const password = CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.REACT_APP_COOKIE_HASH_KEY ?? "ricpham_250293"
    ).toString(CryptoJS.enc.Utf8);

    return { email, password };
  }

  return {
    email: "",
    password: "",
  };
};

export function checkUserLogin(data, navigate) {
  if (!data) {
    toast.warning(MESSAGE_LOGIN_REQUIRED);
    navigate("/login");
  }
}
