import { toast } from "react-toastify";
import { call, put } from "redux-saga/effects";
import { MESSAGE_GENERAL_FAILED } from "../../../constants/config";
import { showMessageError } from "../../../utils/helper";
import {
  requestDeleteAnswer,
  requestGetAnswersByQuestionId,
  requestPostAnswer,
} from "./answerRequests";
import {
  onBulkDeleteAnswerSuccess,
  onPostAnswerSuccess,
  onGetAnswersByQuestionId,
  onGetAnswersByQuestionIdSuccess,
  onLoading,
} from "./answerSlice";

function* handleOnGetAnswersByQuestionId({ payload }) {
  try {
    const res = yield call(requestGetAnswersByQuestionId, payload.questionId);
    if (res.status === 200)
      yield put(onGetAnswersByQuestionIdSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
}

function* handleOnPostAnswer({ payload }) {
  try {
    const res = yield call(requestPostAnswer, payload);
    if (res.data.type === "success") {
      toast.success(res.data.message);
      yield put(onPostAnswerSuccess(true));
    }
  } catch (error) {
    yield put(onLoading(false));
    showMessageError(error);
  }
}

function* handleOnDeleteAnswer({ payload }) {
  try {
    const res = yield call(requestDeleteAnswer, payload);
    if (res.data.type === "success") {
      yield put(
        onGetAnswersByQuestionId({
          questionId: payload.questionId,
        })
      );
      toast.success(res.data.message);
    } else {
      yield put(onLoading(false));
      showMessageError(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    yield put(onLoading(false));
    showMessageError(error);
  }
}

function* handleOnBulkDeleteAnswer({ payload }) {
  try {
    for (const item of payload) {
      yield call(requestDeleteAnswer, item);
    }

    yield put(onBulkDeleteAnswerSuccess(true));
    toast.success(
      `Delete [${payload.length}] ${
        payload.length > 1 ? "answers" : "answer"
      } success`
    );
  } catch (error) {
    showMessageError(error);
  } finally {
    yield put(
      onGetAnswersByQuestionId({
        questionId: payload[0].questionId,
      })
    );
  }
}

export {
  handleOnGetAnswersByQuestionId,
  handleOnPostAnswer,
  handleOnDeleteAnswer,
  handleOnBulkDeleteAnswer,
};
