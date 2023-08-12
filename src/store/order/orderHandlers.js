import { call, delay, put } from "redux-saga/effects";
import {
  requestLoadInvoice,
  requestLoadOrderHistory,
  requestLoadOrderHistoryRefund,
} from "./orderRequests";
import {
  onLoadInvoiceSuccess,
  onLoadOrderHistoryRefundSuccess,
  onLoadOrderHistorySuccess,
} from "./orderSlice";

function* handleOnLoadOrderHistory({ payload }) {
  try {
    const res = yield call(requestLoadOrderHistory, payload);

    if (res.status === 200) {
      yield put(onLoadOrderHistorySuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleOnLoadOrderHistoryRefund({ payload }) {
  try {
    const res = yield call(requestLoadOrderHistoryRefund, payload);

    if (res.status === 200) {
      yield put(onLoadOrderHistoryRefundSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleOnLoadInvoice({ payload }) {
  try {
    const res = yield call(requestLoadInvoice, payload);
    console.log(res.data);
    if (res.status === 200) {
      const blob = new Blob([res.data], {
        type: "application/pdf",
      });
      const fileObjectUrl = URL.createObjectURL(blob);
      window.open(fileObjectUrl);

      yield put(onLoadInvoiceSuccess());
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

export {
  handleOnLoadOrderHistory,
  handleOnLoadOrderHistoryRefund,
  handleOnLoadInvoice,
};
