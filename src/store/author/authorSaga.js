import { takeLatest } from "redux-saga/effects";
import {
  handleOnGetAuthors,
  handleOnGetSubcribesByAuthorId,
  handleOnLoadAuthor,
  handleOnLoadAuthorsPagination,
  handleOnLoadSubcribesByUserId,
  handleOnLoadTop3Authors,
  handleOnSubcribeAuthor,
  handleOnUnsubcribeAuthor,
} from "./authorHandlers";
import {
  onGetAuthors,
  onGetSubcribesByAuthorId,
  onLoadAuthor,
  onLoadAuthorsPagination,
  onLoadSubcribesByUserId,
  onLoadTop3Authors,
  onSubcribeAuthor,
  onUnsubcribeAuthor,
} from "./authorSlice";

export default function* authSaga() {
  yield takeLatest(onGetAuthors.type, handleOnGetAuthors);
  yield takeLatest(onLoadTop3Authors.type, handleOnLoadTop3Authors);
  yield takeLatest(onLoadAuthorsPagination.type, handleOnLoadAuthorsPagination);
  yield takeLatest(onLoadSubcribesByUserId.type, handleOnLoadSubcribesByUserId);
  yield takeLatest(onSubcribeAuthor.type, handleOnSubcribeAuthor);
  yield takeLatest(onUnsubcribeAuthor.type, handleOnUnsubcribeAuthor);
  yield takeLatest(onLoadAuthor.type, handleOnLoadAuthor);
}
