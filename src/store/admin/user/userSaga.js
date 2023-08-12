import { takeLatest } from "redux-saga/effects";
import {
  handleOnBulkDeleteUser,
  handleOnCreateUser,
  handleOnDeleteUser,
  handleOnGetAllUsers,
  handleOnGetUsers,
  handleOnUpdateUser,
} from "./userHandlers";
import {
  onBulkDeleteUser,
  onCreateUser,
  onDeleteUser,
  onGetAllUsers,
  onGetUsers,
  onUpdateUser,
} from "./userSlice";

export default function* userSaga() {
  yield takeLatest(onGetUsers.type, handleOnGetUsers);
  yield takeLatest(onGetAllUsers.type, handleOnGetAllUsers);
  yield takeLatest(onCreateUser.type, handleOnCreateUser);
  yield takeLatest(onUpdateUser.type, handleOnUpdateUser);
  yield takeLatest(onDeleteUser.type, handleOnDeleteUser);
  yield takeLatest(onBulkDeleteUser.type, handleOnBulkDeleteUser);
}
