import { takeLatest } from "redux-saga/effects";

import {
  handleOnLoadInvoice,
  handleOnLoadOrderHistory,
  handleOnLoadOrderHistoryRefund,
} from "./orderHandlers";
import {
  onLoadInvoice,
  onLoadOrderHistory,
  onLoadOrderHistoryRefund,
} from "./orderSlice";

export default function* orderSaga() {
  yield takeLatest(onLoadOrderHistory.type, handleOnLoadOrderHistory);
  yield takeLatest(
    onLoadOrderHistoryRefund.type,
    handleOnLoadOrderHistoryRefund
  );
  yield takeLatest(onLoadInvoice.type, handleOnLoadInvoice);
}
