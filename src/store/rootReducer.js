import authReducer from "./auth/authSlice";
import authorReducer from "./author/authorSlice";
import categoryReducer from "./category/categorySlice";
import courseReducer from "./course/courseSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import orderReducer from "./order/orderSlice";
import partReducer from "./admin/part/partSlice";
import questionReducer from "./admin/question/questionSlice";
import answerReducer from "./admin/answer/answerSlice";
import userReducer from "./admin/user/userSlice";
import adminCourseReducer from "./admin/course/courseSlice";
import adminBlogReducer from "./admin/blog/blogSlice";

const { combineReducers } = require("@reduxjs/toolkit");

export const rootReducer = combineReducers({
  auth: authReducer,
  author: authorReducer,
  category: categoryReducer,
  course: courseReducer,
  dashboard: dashboardReducer,
  part: partReducer,
  question: questionReducer,
  answer: answerReducer,
  user: userReducer,
  adminCourse: adminCourseReducer,
  adminBlog: adminBlogReducer,
  order: orderReducer,
});
