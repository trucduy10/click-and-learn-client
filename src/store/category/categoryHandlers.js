import { call, put } from "redux-saga/effects";
import { requestLoadCategories } from "./categoryRequests";
import { onLoadCategoriesSuccess } from "./categorySlice";

function* handleOnLoadCategories() {
  try {
    const res = yield call(requestLoadCategories);

    if (res.status === 200) {
      yield put(onLoadCategoriesSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

export { handleOnLoadCategories };
