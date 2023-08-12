import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../../api/axiosInstance";
import { BLOG_ACTION_TYPES } from "./type";
import BASE_URL from "./url";
import { fetchBlogFailed, fetchBlogSuccess } from "./action";

const getBlogs = async ({ pageNo, pageSize = 6 }) => {
  const resp = await axiosInstance(
    `/blogs?pageNo=${pageNo}&pageSize=${pageSize}`
  );
  return resp;
};

function* fetchBlogAsync({ payload }) {
  try {
    yield delay(200);
    const resp = yield call(getBlogs, payload);
    const {
      empty,
      first,
      last,
      numberOfElements,
      totalElements,
      totalPages,
      content,
      number,
    } = resp.data;
    yield put(
      fetchBlogSuccess({
        empty,
        first,
        last,
        numberOfElements,
        totalElements,
        totalPages,
        data: content,
        number,
      })
    );
  } catch (error) {
    yield put(fetchBlogFailed(error));
  }
}

export function* onFecthBlogs() {
  yield takeLatest(BLOG_ACTION_TYPES.FETCH_BLOG_START, fetchBlogAsync);
}

export function* blogsSaga() {
  yield all([call(onFecthBlogs)]);
}
