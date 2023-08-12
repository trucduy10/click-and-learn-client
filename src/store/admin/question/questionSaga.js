import { takeLatest } from "redux-saga/effects";
import {
  handleOnBulkDeleteQuestion,
  handleOnDeleteQuestion,
  handleOnGetQuestionsByPartId,
  handleOnPostQuestion,
} from "./questionHandlers";
import {
  onBulkDeleteQuestion,
  onDeleteQuestion,
  onGetQuestionsByPartId,
  onPostQuestion,
} from "./questionSlice";

export default function* questionSaga() {
  yield takeLatest(onGetQuestionsByPartId.type, handleOnGetQuestionsByPartId);
  yield takeLatest(onPostQuestion.type, handleOnPostQuestion);
  yield takeLatest(onDeleteQuestion.type, handleOnDeleteQuestion);
  yield takeLatest(onBulkDeleteQuestion.type, handleOnBulkDeleteQuestion);
}
