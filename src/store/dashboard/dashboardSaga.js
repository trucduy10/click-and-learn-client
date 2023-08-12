import { takeLatest } from "redux-saga/effects";

import {
  onLoadCategoryEnrollmentChart,
  onLoadDashboard,
  onLoadRevenueYearChart,
} from "./dashboardSlice";
import {
  handleOnLoadCategoryEnrollmentChart,
  handleOnLoadDashboard,
  handleOnLoadRevenueYearChart,
} from "./dashboardHandlers";

export default function* authSaga() {
  yield takeLatest(onLoadDashboard.type, handleOnLoadDashboard);
  yield takeLatest(
    onLoadCategoryEnrollmentChart.type,
    handleOnLoadCategoryEnrollmentChart
  );
  yield takeLatest(onLoadRevenueYearChart.type, handleOnLoadRevenueYearChart);
}
