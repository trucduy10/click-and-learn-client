import { BASE_API_URL, BASE_DOMAIN_URL } from "./config";

export const IMG_BB_URL = `https://api.imgbb.com/1/upload?key=${
  process.env.REACT_APP_IMG_BB_KEY || "empty_key"
}`;

// ******************* Authentication ENDPOINT *********************
export const API_REGISTER_URL = "/auth/register";
export const API_LOGIN_URL = "/auth/login";
export const API_VERIFY_URL = "/verifyEmail";
export const API_REFRESH_TOKEN_URL = "/auth/refresh-token";
export const API_CURRENT_USER_URL = "/auth/user/me";

export const OAUTH2_REDIRECT_URI = `${BASE_DOMAIN_URL}/oauth2/redirect`;
export const GOOGLE_AUTH_URL = `${BASE_API_URL}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`;
export const FACEBOOK_AUTH_URL = `${BASE_API_URL}/oauth2/authorize/facebook?redirect_uri=${OAUTH2_REDIRECT_URI}`;
export const GITHUB_AUTH_URL = `${BASE_API_URL}/oauth2/authorize/github?redirect_uri=${OAUTH2_REDIRECT_URI}`;
export const LINKEDIN_AUTH_URL = `${BASE_API_URL}/oauth2/authorize/linkedin?redirect_uri=${OAUTH2_REDIRECT_URI}`;

// ******************* API ENDPOINT *********************
export const API_COURSE_URL = "/course";
export const API_SECTION_URL = "/section";
export const API_LESSON_URL = "/lesson";
export const API_TAG_URL = "/tag";
export const API_AUTHOR_URL = "/author";
export const API_CHECKOUT_URL = "/checkout";
export const API_ENROLLMENT_URL = "/enrollment";
export const API_BLOG_URL = "/blog";

export const API_IMG_URL = "/course/download"; // Example: "/course/download?courseId=";
