import { takeLatest } from "redux-saga/effects";
import {
  handleOnBulkDeletePart,
  handleOnPostPart,
  handleOnDeletePart,
  handleOnGetPartsByCourseId,
} from "./partHandlers";
import {
  onBulkDeletePart,
  onPostPart,
  onDeletePart,
  onGetPartsByCourseId,
} from "./partSlice";

export default function* partSaga() {
  yield takeLatest(onGetPartsByCourseId.type, handleOnGetPartsByCourseId);
  yield takeLatest(onPostPart.type, handleOnPostPart);
  yield takeLatest(onDeletePart.type, handleOnDeletePart);
  yield takeLatest(onBulkDeletePart.type, handleOnBulkDeletePart);
}
