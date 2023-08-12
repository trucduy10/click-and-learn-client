import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import { showMessageError } from "../../../utils/helper";
import { onUpdatePermissionSuccess } from "../../auth/authSlice";
import {
  requestCreateUser,
  requestDeleteUser,
  requestGetAllUsers,
  requestGetUsers,
  requestUpdateUser,
} from "./userRequests";
import {
  onPostUserSuccess,
  onLoading,
  onGetUsersSuccess,
  onDeleteUserSuccess,
  onBulkDeleteUserSuccess,
  onGetAllUsers,
  onGetAllUsersSuccess,
} from "./userSlice";

function* handleOnGetUsers() {
  try {
    const res = yield call(requestGetUsers);
    if (res.status === 200) yield put(onGetUsersSuccess(res.data));
  } catch (error) {
    yield put(onLoading(false));
    console.log(error);
  }
}

function* handleOnGetAllUsers() {
  try {
    const res = yield call(requestGetAllUsers);
    if (res.status === 200) yield put(onGetAllUsersSuccess(res.data));
  } catch (error) {
    yield put(onLoading(false));
    console.log(error);
  }
}

function* handleOnCreateUser({ payload }) {
  try {
    const res = yield call(requestCreateUser, payload);
    if (res.data.type === "success") {
      toast.success("Create new user success !");
      yield put(onPostUserSuccess(true));
    }
  } catch (error) {
    yield put(onLoading(false));
    showMessageError(error);
  }
}

function* handleOnUpdateUser({ payload }) {
  try {
    const res = yield call(requestUpdateUser, payload);
    if (res.data.type === "success") {
      toast.success(res.data.message);
      yield put(onPostUserSuccess(true));
    }
  } catch (error) {
    yield put(onLoading(false));
    showMessageError(error);
  }
}

function* handleOnDeleteUser({ payload }) {
  try {
    const res = yield call(requestDeleteUser, payload);
    if (res.data.type === "success") {
      toast.success(res.data.message);
      yield put(onDeleteUserSuccess(payload));
    }
  } catch (error) {
    yield put(onLoading(false));
    showMessageError(error);
  }
}

function* handleOnBulkDeleteUser({ payload }) {
  try {
    for (const user of payload) {
      yield call(requestDeleteUser, user.id);
    }

    yield put(onBulkDeleteUserSuccess(true));
    toast.success(
      `Delete [${payload.length}] ${
        payload.length > 1 ? "users" : "user"
      } success`
    );
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(onGetAllUsers());
  }
}

export {
  handleOnGetUsers,
  handleOnGetAllUsers,
  handleOnCreateUser,
  handleOnUpdateUser,
  handleOnDeleteUser,
  handleOnBulkDeleteUser,
};
