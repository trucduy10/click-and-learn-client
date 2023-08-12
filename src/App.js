import React, { lazy, Suspense, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoaderCom from "./components/common/LoaderCom.js";
import {
  ALLOWED_ADMIN_MANAGER,
  ALLOWED_ADMIN_MANAGER_EMPLOYEE,
} from "./constants/permissions.js";
import LayoutAuthentication from "./layouts/LayoutAuthentication.js";
import LayoutHome from "./layouts/LayoutHome.js";
import LayoutLearning from "./layouts/LayoutLearn.js";
import CheckAuthPage from "./pages/auth/CheckAuthPage.js";
import CheckUserLoginPage from "./pages/auth/CheckUserLoginPage.js";
import OAuth2RedirectPage from "./pages/auth/OAuth2RedirectPage.js";
import ExamPage from "./pages/exam/ExamPage.js";
import {
  onAuthInitialState,
  onGetUser,
  onLoadCurrentUser,
  onRemoveToken,
} from "./store/auth/authSlice.js";
import {
  onAuthorInitialState,
  onGetAuthors,
} from "./store/author/authorSlice.js";
import { selectAllCourseState } from "./store/course/courseSelector.js";
import {
  onCourseInitalState,
  onCourseLoading,
} from "./store/course/courseSlice.js";
import { getToken } from "./utils/auth.js";
import { BASE_API_URL } from "./constants/config.js";
import { selectUser } from "./store/auth/authSelector.js";
import { onGetBlogs } from "./store/admin/blog/blogSlice.js";

const AuthorPage = lazy(() => import("./pages/author/AuthorPage.js"));
const AuthorDetailsPage = lazy(() =>
  import("./pages/author/AuthorDetailsPage.js")
);
const UserCertificationPage = lazy(() =>
  import("./pages/user/UserCertificationPage.js")
);
const UserAccomplishmentPage = lazy(() =>
  import("./pages/user/UserAccomplishmentPage.js")
);
const UserPurchaseHistoryPage = lazy(() =>
  import("./pages/user/UserPurchaseHistoryPage.js")
);

const RegisterPage = lazy(() => import("./pages/auth/RegisterPage.js"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage.js"));
const ForgetPasswordPage = lazy(() =>
  import("./pages/auth/ForgetPasswordPage.js")
);
const ResetPasswordPage = lazy(() =>
  import("./pages/auth/ResetPasswordPage.js")
);

const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage.js")
);
const AdminCourseListPage = lazy(() =>
  import("./pages/admin/course/AdminCourseListPage.js")
);
const AdminCreateCoursePage = lazy(() =>
  import("./pages/admin/course/AdminCreateCoursePage.js")
);
const AdminAuthorListPage = lazy(() =>
  import("./pages/admin/course/author/AdminAuthorListPage.js")
);
const AdminCreateAuthorPage = lazy(() =>
  import("./pages/admin/course/author/AdminCreateAuthorPage.js")
);
const AdminPartListPage = lazy(() =>
  import("./pages/admin/part/AdminPartListPage.js")
);
const AdminCreatePartPage = lazy(() =>
  import("./pages/admin/part/AdminCreatePartPage.js")
);

const AdminQuestionListPage = lazy(() =>
  import("./pages/admin/question/AdminQuestionListPage.js")
);
const AdminCreateQuestionPage = lazy(() =>
  import("./pages/admin/question/AdminCreateQuestionPage.js")
);

const AdminAnswerListPage = lazy(() =>
  import("./pages/admin/answer/AdminAnswerListPage.js")
);
const AdminCreateAnswerPage = lazy(() =>
  import("./pages/admin/answer/AdminCreateAnswerPage.js")
);

const AdminSectionListPage = lazy(() =>
  import("./pages/admin/section/AdminSectionListPage.js")
);
const AdminCreateSectionPage = lazy(() =>
  import("./pages/admin/section/AdminCreateSectionPage.js")
);

const AdminLessonListPage = lazy(() =>
  import("./pages/admin/lesson/AdminLessonListPage.js")
);

const AdminCreateLessonPage = lazy(() =>
  import("./pages/admin/lesson/AdminCreateLessonPage.js")
);

const AdminBlogListPage = lazy(() =>
  import("./pages/admin/blog/AdminBlogListPage.js")
);
const AdminBlogCreatePage = lazy(() =>
  import("./pages/admin/blog/AdminBlogCreatePage.js")
);

const AdminUserListPage = lazy(() =>
  import("./pages/admin/user/AdminUserListPage.js")
);
const AdminCreateUserPage = lazy(() =>
  import("./pages/admin/user/AdminCreateUserPage.js")
);

const HomePage = lazy(() => import("./pages/HomePage.js"));

const ErrorPage = lazy(() => import("./pages/errors/ErrorPage.js"));

const CategoryPage = lazy(() => import("./pages/category/CategoryPage.js"));
const CategoryDetailPage = lazy(() =>
  import("./pages/category/CategoryDetailPage.js")
);

const CoursePage = lazy(() => import("./pages/course/CoursePage.js"));
const MyCoursePage = lazy(() => import("./pages/course/MyCoursePage.js"));
const CourseDetailPage = lazy(() =>
  import("./pages/course/CourseDetailPage.js")
);

const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage.js"));

const UserProfilePage = lazy(() => import("./pages/user/UserProfilePage.js"));
const UserChangePasswordPage = lazy(() =>
  import("./pages/user/UserChangePasswordPage.js")
);

const SearchPage = lazy(() => import("./pages/search/SearchPage.js"));
const PolicyPage = lazy(() => import("./pages/PolicyPage.js"));

const BlogPage = lazy(() => import("./pages/blog/BlogPage.js"));
const BlogDetailsPage = lazy(() => import("./pages/blog/BlogDetailsPage.js"));
const BlogCreatePage = lazy(() => import("./pages/blog/BlogCreatePage.js"));
const BlogListPage = lazy(() => import("./pages/blog/BlogListPage.js"));

const LearnPage = lazy(() => import("./pages/learn/LearnPage.js"));
const PaymentSuccessPage = lazy(() =>
  import("./pages/payment/PaymentSuccessPage.js")
);
const PaymentErrorPage = lazy(() =>
  import("./pages/payment/PaymentErrorPage.js")
);
const NotificationListPage = lazy(() =>
  import("./pages/notification/NotificationListPage.js")
);

Modal.setAppElement("#root");
Modal.defaultStyles = {};
window.removeEventListener("onbeforeunload", () => {});
function App() {
  const user = useSelector(selectUser);
  const { examination } = useSelector(selectAllCourseState);
  const { access_token } = getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (access_token) {
  //     let timer1 = setTimeout(() => dispatch(onGetUser(access_token)), 5000);
  //     return () => {
  //       clearTimeout(timer1);
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // });

  useEffect(() => {
    if (access_token) dispatch(onGetUser(access_token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  useEffect(() => {
    if (user) {
      let url = BASE_API_URL + `/auth/user/me/stream/${user.id}`;
      const sse = new EventSource(url);

      sse.addEventListener("current-user-event", (event) => {
        const data = JSON.parse(event.data);

        if (JSON.stringify(data) !== JSON.stringify(user)) {
          dispatch(onLoadCurrentUser(data));
        }
      });

      sse.onerror = () => {
        sse.close();
      };
      return () => {
        sse.close();
      };
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user?.status === 0) {
      navigate("/logout");
      dispatch(onRemoveToken());
      dispatch(onCourseInitalState());
    }
  }, [dispatch, navigate, user?.status]);

  useEffect(() => {
    // dispatch(onAuthInitialState());
    dispatch(onAuthorInitialState());
    dispatch(onGetAuthors());
    dispatch(onCourseLoading());
    dispatch(onGetBlogs());
  }, [dispatch]);

  // useEffect(() => {
  //   axiosBearer
  //     .post("http://localhost:8080/momo", {
  //       userId: 1,
  //       courseId: 1,
  //       lang: "en",
  //       requestType: "payWithATM",
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       window.location.replace(res.data.payUrl);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  // useEffect(() => {
  //   axiosBearer
  //     .post("http://localhost:8080/paypal/pay", {
  //       userId: 1,
  //       courseId: 1,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       window.location.replace(res.data.payUrl);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <Suspense fallback={<LoaderCom></LoaderCom>}>
      <Routes>
        <Route element={<LayoutHome></LayoutHome>}>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          {/* ********* Error ********* */}
          <Route
            path="*"
            element={<ErrorPage status={404}></ErrorPage>}
          ></Route>
          <Route
            path="/unauthorize"
            element={<ErrorPage status={401}></ErrorPage>}
          ></Route>
          <Route
            path="/forbidden"
            element={<ErrorPage status={403}></ErrorPage>}
          ></Route>
          <Route
            path="/token-expire"
            element={
              <ErrorPage
                status={419}
                message="The verified link is expired. Please try again"
              ></ErrorPage>
            }
          ></Route>
          {/* ********* END Error ********* */}
          <Route
            path="/categories"
            element={<CategoryPage></CategoryPage>}
          ></Route>
          <Route
            path="/categories/:slug"
            element={<CategoryDetailPage></CategoryDetailPage>}
          ></Route>
          <Route path="/courses" element={<CoursePage></CoursePage>}></Route>
          <Route
            path="/courses/:slug"
            element={<CourseDetailPage></CourseDetailPage>}
          ></Route>
          <Route
            path="/my-courses"
            element={
              !user && !user?.email ? (
                <Navigate to="/login"></Navigate>
              ) : (
                <MyCoursePage></MyCoursePage>
              )
            }
          ></Route>
          <Route
            path="/checkout/:slug"
            element={<CheckoutPage></CheckoutPage>}
          ></Route>
          <Route
            path="/profile"
            element={<CheckUserLoginPage></CheckUserLoginPage>}
          >
            <Route
              path=":userName"
              element={<UserProfilePage></UserProfilePage>}
            ></Route>
            <Route
              path="change-password"
              element={<UserChangePasswordPage></UserChangePasswordPage>}
            ></Route>
            <Route
              path="accomplishments"
              element={<UserAccomplishmentPage></UserAccomplishmentPage>}
            ></Route>
            <Route
              path="accomplishments/verify/:certificateUID"
              element={<UserCertificationPage></UserCertificationPage>}
            ></Route>
            <Route
              path="order-history"
              element={<UserPurchaseHistoryPage></UserPurchaseHistoryPage>}
            ></Route>
          </Route>
          <Route path="/blogs" element={<BlogPage></BlogPage>}></Route>
          <Route
            path="/blogs/:slug"
            element={<BlogDetailsPage></BlogDetailsPage>}
          />
          <Route
            path="/blogs/manage"
            element={<BlogListPage></BlogListPage>}
          ></Route>
          <Route
            path="/blogs/create"
            element={<BlogCreatePage></BlogCreatePage>}
          ></Route>
          <Route
            path="/payment/success"
            element={<PaymentSuccessPage></PaymentSuccessPage>}
          ></Route>
          <Route
            path="/payment/cancel"
            element={<PaymentErrorPage></PaymentErrorPage>}
          ></Route>
          <Route
            path="/oauth2/redirect"
            element={<OAuth2RedirectPage></OAuth2RedirectPage>}
          ></Route>
          <Route path="/authors" element={<AuthorPage></AuthorPage>}></Route>
          <Route
            path="/authors/:authorId"
            element={<AuthorDetailsPage></AuthorDetailsPage>}
          ></Route>
          <Route
            path="/notification"
            element={<NotificationListPage></NotificationListPage>}
          ></Route>
          <Route path="/search" element={<SearchPage></SearchPage>}></Route>
          {/* ********* ADMIN ********* */}
          <Route
            path="/admin"
            element={
              <CheckAuthPage
                allowPermissions={ALLOWED_ADMIN_MANAGER_EMPLOYEE}
              ></CheckAuthPage>
            }
          >
            <Route index element={<AdminDashboardPage />}></Route>
            {/* Admin Courses */}
            <Route path="courses" element={<AdminCourseListPage />}></Route>
            <Route
              path="courses/create"
              element={<AdminCreateCoursePage />}
            ></Route>
            <Route
              path="courses/authors"
              element={<AdminAuthorListPage />}
            ></Route>
            <Route
              path="courses/authors/create"
              element={<AdminCreateAuthorPage />}
            ></Route>
            {/* Admin Parts */}
            <Route
              path="courses/:courseId/parts"
              element={<AdminPartListPage />}
            ></Route>
            <Route
              path="/admin/courses/:courseId/parts/create"
              element={<AdminCreatePartPage />}
            ></Route>
            {/* Admin Questions */}
            <Route
              path="courses/:courseId/parts/:partId/questions"
              element={<AdminQuestionListPage />}
            ></Route>
            <Route
              path="courses/:courseId/parts/:partId/questions/create"
              element={<AdminCreateQuestionPage />}
            ></Route>
            {/* Admin AdminAnswerListPage */}
            <Route
              path="courses/:courseId/parts/:partId/questions/:questionId/answers"
              element={<AdminAnswerListPage />}
            ></Route>
            <Route
              path="courses/:courseId/parts/:partId/questions/:questionId/answers/create"
              element={<AdminCreateAnswerPage />}
            ></Route>
            {/* Admin Sections */}
            <Route
              // path="sections"
              path="courses/:courseId/sections"
              element={<AdminSectionListPage></AdminSectionListPage>}
            ></Route>
            <Route
              path="courses/:courseId/sections/create"
              element={<AdminCreateSectionPage></AdminCreateSectionPage>}
            ></Route>
            {/* Admin Lessons */}
            <Route
              path="courses/:courseId/sections/:sectionId/lessons"
              element={<AdminLessonListPage></AdminLessonListPage>}
            ></Route>
            <Route
              path="courses/:courseId/sections/:sectionId/lessons/create"
              element={<AdminCreateLessonPage></AdminCreateLessonPage>}
            ></Route>
            {/* Admin Blogs */}
            <Route
              path="blogs"
              element={<AdminBlogListPage></AdminBlogListPage>}
            ></Route>
            <Route
              path="blogs/create"
              element={<AdminBlogCreatePage></AdminBlogCreatePage>}
            ></Route>

            {/* Admin Users */}
            <Route
              path="users"
              element={
                <CheckAuthPage
                  allowPermissions={ALLOWED_ADMIN_MANAGER}
                ></CheckAuthPage>
              }
            >
              <Route index element={<AdminUserListPage />}></Route>
              <Route path="create" element={<AdminCreateUserPage />}></Route>
            </Route>
          </Route>
          {/* ******* END ADMIN ******* */}
        </Route>

        {/* ********* Learn ********* */}
        <Route
          element={
            !user && !user?.email ? (
              <Navigate to="/login"></Navigate>
            ) : (
              <LayoutLearning></LayoutLearning>
            )
          }
        >
          {/* course slug */}
          <Route
            path="/learn/:slug"
            render
            element={<LearnPage></LearnPage>}
          ></Route>
        </Route>
        {/* ********* END Learn ********* */}

        {/* ********* Authentication ********* */}
        <Route element={<LayoutAuthentication></LayoutAuthentication>}>
          <Route
            path="/register"
            element={<RegisterPage></RegisterPage>}
          ></Route>
          <Route
            path="/forget-password"
            element={<ForgetPasswordPage></ForgetPasswordPage>}
          ></Route>
          <Route
            path="/reset-password"
            element={<ResetPasswordPage></ResetPasswordPage>}
          ></Route>

          <Route
            path="/login"
            render
            element={
              user && user.email ? (
                <Navigate to="/"></Navigate>
              ) : (
                <LoginPage></LoginPage>
              )
            }
          ></Route>
          <Route
            path="/logout"
            render
            element={<Navigate to="/"></Navigate>}
          ></Route>
          <Route
            path="/privacy-policy"
            element={<PolicyPage></PolicyPage>}
          ></Route>
        </Route>
        {/* ********* END Authentication ********* */}

        {/* ********* Examination ********* */}
        <Route path="/exam" element={<ExamPage></ExamPage>}></Route>
        {/* ********* End Examination ********* */}
      </Routes>
    </Suspense>
  );
}

export default App;
