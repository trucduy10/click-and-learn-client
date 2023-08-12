import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import {
  MESSAGE_CHANGE_PASSWORD_SUCCESS,
  MESSAGE_FORGET_PASSWORD_SUCCESS,
  MESSAGE_GENERAL_FAILED,
} from "../../constants/config";
import { removeToken, setToken } from "../../utils/auth";
import { showMessageError } from "../../utils/helper";
import { onGetAllUsers } from "../admin/user/userSlice";
import {
  requestForgetPassword,
  requestGetManagerEmployeeRole,
  requestGetUser,
  requestLoadPermissions,
  requestLoadRoles,
  requestLogin,
  requestRefreshToken,
  requestRegister,
  requestResetPassword,
  requestUpdatePermissions,
  requestUserChangePassword,
  requestUserUpdateNoti,
  requestUserUpdateProfile,
} from "./authRequests";
import {
  onGetLastUrlAccessSuccess,
  onGetManagerEmployeeRolesSuccess,
  onLoading,
  onLoadPermissionSuccess,
  onLoadRoleSuccess,
  onLoginSuccess,
  onRegisterSuccess,
  onResetPasswordSuccess,
  onUpdatePermissionSuccess,
  onUpdateUserToken,
  onUserChangePasswordSuccess,
} from "./authSlice";

function* handleOnRegister(action) {
  try {
    const res = yield call(requestRegister, action.payload);
    if (res.data.type === "success") {
      toast.success(res.data.message, {
        autoClose: false,
      });
      yield put(onRegisterSuccess(true));
    } else if (res.data.type === "warning") {
      toast.warning(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    showMessageError(error);
    yield put(onLoading(false));
  }
}

function* handleOnLogin(action) {
  try {
    yield put(onLoading(true));
    const res = yield call(requestLogin, action.payload);

    if (res.data.type === "success") {
      if (res.data.access_token && res.data.refresh_token) {
        setToken(res.data.access_token, res.data.refresh_token);
        yield call(handleOnGetUser, { payload: res.data.access_token });
      }
      yield put(onLoginSuccess(true));
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(onLoading(false));
  }
}

function* handleOnGetUser({ payload: access_token }) {
  try {
    const res = yield call(requestGetUser, access_token);
    if (res.status === 200) {
      yield put(
        onUpdateUserToken({
          user: res.data,
          access_token,
        })
      );
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleOnRefreshToken(action) {
  try {
    const res = yield call(requestRefreshToken, action.payload);
    if (res.data.type === "success") {
      setToken(res.data.access_token, res.data.refresh_token);
      yield call(handleOnGetUser, { payload: res.data.access_token });
    } else {
      yield call(handleOnRemoveToken());
    }
  } catch (error) {
    console.log(error);
  }
}

function* handleOnRemoveToken() {
  yield put(
    onUpdateUserToken({
      user: undefined,
      access_token: null,
    })
  );
  removeToken();
}

function* handleOnForgetPassword({ payload }) {
  try {
    yield put(onLoading(true));
    const res = yield call(requestForgetPassword, payload.email);
    if (res.status === 200) {
      toast.success(MESSAGE_FORGET_PASSWORD_SUCCESS, {
        autoClose: 10000,
      });
    } else {
      toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(onLoading(false));
  }
}

function* handleOnResetPassword({ payload }) {
  try {
    yield put(onLoading(true));
    const res = yield call(requestResetPassword, payload);
    if (res.data.type === "success") {
      toast.success(res.data.message);
      yield put(onResetPasswordSuccess(true));
    } else {
      toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(onLoading(false));
  }
}

function* handleOnUserChangePassword({ payload }) {
  try {
    const res = yield call(requestUserChangePassword, payload);
    if (res.status === 200) {
      toast.success(MESSAGE_CHANGE_PASSWORD_SUCCESS);
      yield put(onUserChangePasswordSuccess(true));
    } else {
      toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(onLoading(false));
  }
}

function* handleOnUserUpdateProfile({ payload }) {
  try {
    const res = yield call(requestUserUpdateProfile, payload);
    if (res.status === 200) {
      yield call(handleOnGetUser, { payload: payload.access_token });
      console.log("res.data handle: ", res.data);
      toast.success(res.data.message);
    } else {
      toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(onLoading(false));
  }
}

function* handleOnUserUpdateNoti({ payload }) {
  try {
    const res = yield call(requestUserUpdateNoti, payload);

    if (res.status === 200) {
      yield call(handleOnGetUser, { payload: payload.access_token });

      toast.success(res.data.message);
    } else {
      toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    showMessageError(error);
  }
}
function* handleOnLoadRoles() {
  try {
    const res = yield call(requestLoadRoles);

    if (res.status === 200) {
      yield put(onLoadRoleSuccess(res.data));
    } else {
    }
  } catch (error) {}
}

function* handleOnGetManagerEmployeeRoles() {
  try {
    const res = yield call(requestGetManagerEmployeeRole);
    if (res.status === 200)
      yield put(onGetManagerEmployeeRolesSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
}

function* handleOnLoadPermissions() {
  try {
    const res = yield call(requestLoadPermissions);

    if (res.status === 200) {
      yield put(onLoadPermissionSuccess(res.data));
    } else {
    }
  } catch (error) {}
}
function* handleOnUpdatePermissions({ payload }) {
  try {
    const res = yield call(requestUpdatePermissions, payload);
    if (res.status === 200) {
      yield put(onGetAllUsers());
      yield put(onUpdatePermissionSuccess());
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log(error);
    yield put(onLoading(false));
  }
}

function* handleOnGetLastUrlAccess({ payload }) {
  yield put(onGetLastUrlAccessSuccess(payload));
}

export {
  handleOnRegister,
  handleOnLogin,
  handleOnGetUser,
  handleOnRefreshToken,
  handleOnRemoveToken,
  handleOnForgetPassword,
  handleOnResetPassword,
  handleOnUserChangePassword,
  handleOnUserUpdateProfile,
  handleOnUserUpdateNoti,
  handleOnLoadRoles,
  handleOnGetManagerEmployeeRoles,
  handleOnLoadPermissions,
  handleOnUpdatePermissions,
  handleOnGetLastUrlAccess,
};
