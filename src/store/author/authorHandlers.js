import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import {
  requestGetAuthors,
  requestGetSubcribesByAuthorId,
  requestLoadAuthor,
  requestLoadAuthorsPagination,
  requestLoadSubcribesByUserId,
  requestLoadTop3Authors,
  requestSubcribeAuthor,
} from "./authorRequests";
import {
  onGetAuthorsSuccess,
  onGetSubcribesByAuthorId,
  onGetSubcribesByAuthorIdSuccess,
  onLoadAuthorsPaginationSuccess,
  onLoadAuthorSuccess,
  onLoadSubcribesByUserIdSuccess,
  onLoadTop3AuthorsSuccess,
  onSubcribeAuthorSuccess,
  onUnsubcribeAuthorSuccess,
} from "./authorSlice";

function* handleOnGetAuthors() {
  try {
    const res = yield call(requestGetAuthors);
    if (res.status === 200) {
      for (const author of res.data) {
        const resSubcribes = yield call(
          requestGetSubcribesByAuthorId,
          author.id
        );
        yield put(
          onGetSubcribesByAuthorIdSuccess({
            data: resSubcribes.data,
            authorId: author.id,
          })
        );
      }

      yield put(onGetAuthorsSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleOnLoadTop3Authors() {
  try {
    const res = yield call(requestLoadTop3Authors);

    if (res.status === 200) {
      yield put(onLoadTop3AuthorsSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleOnLoadAuthorsPagination({ payload }) {
  try {
    const res = yield call(requestLoadAuthorsPagination, payload);
    if (res.status === 200) {
      yield put(onLoadAuthorsPaginationSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

function* handleOnLoadSubcribesByUserId({ payload }) {
  try {
    const res = yield call(requestLoadSubcribesByUserId, payload);
    if (res.status === 200) {
      yield put(onLoadSubcribesByUserIdSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

function* handleOnSubcribeAuthor({ payload }) {
  try {
    const res = yield call(requestSubcribeAuthor, payload);
    if (res.status === 200) {
      toast.success("Thank for you subcribe.");
      yield put(onSubcribeAuthorSuccess());
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

function* handleOnUnsubcribeAuthor({ payload }) {
  try {
    const res = yield call(requestSubcribeAuthor, payload);
    if (res.status === 200) {
      toast.success("Unsubcribe successfully.");
      yield put(onUnsubcribeAuthorSuccess());
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleOnLoadAuthor({ payload }) {
  try {
    const res = yield call(requestLoadAuthor, payload);

    if (res.status === 200) {
      yield put(onLoadAuthorSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

export {
  handleOnGetAuthors,
  handleOnLoadAuthorsPagination,
  handleOnLoadTop3Authors,
  handleOnLoadSubcribesByUserId,
  handleOnSubcribeAuthor,
  handleOnUnsubcribeAuthor,
  handleOnLoadAuthor,
};
