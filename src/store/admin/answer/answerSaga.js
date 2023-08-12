import { takeLatest } from "redux-saga/effects";
import {
  handleOnBulkDeleteAnswer,
  handleOnDeleteAnswer,
  handleOnGetAnswersByQuestionId,
  handleOnPostAnswer,
} from "./answerHandlers";
import {
  onBulkDeleteAnswer,
  onDeleteAnswer,
  onGetAnswersByQuestionId,
  onPostAnswer,
} from "./answerSlice";

export default function* answerSaga() {
  yield takeLatest(onGetAnswersByQuestionId.type, handleOnGetAnswersByQuestionId);
  yield takeLatest(onPostAnswer.type, handleOnPostAnswer);
  yield takeLatest(onDeleteAnswer.type, handleOnDeleteAnswer);
  yield takeLatest(onBulkDeleteAnswer.type, handleOnBulkDeleteAnswer);
}
