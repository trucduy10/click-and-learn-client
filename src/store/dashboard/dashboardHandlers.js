import { call, put } from "redux-saga/effects";
import {
  requestLoadCategoryEnrollmentChart,
  requestLoadDashboard,
  requestLoadRevenueYearChart,
} from "./dashboardRequests";
import {
  onLoadCategoryEnrollmentChartSuccess,
  onLoadDashboardSuccess,
  onLoadRevenueYearChartSuccess,
} from "./dashboardSlice";

function* handleOnLoadDashboard() {
  try {
    const res = yield call(requestLoadDashboard);

    if (res.status === 200) {
      yield put(onLoadDashboardSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}
function* handleOnLoadCategoryEnrollmentChart() {
  try {
    const res = yield call(requestLoadCategoryEnrollmentChart);

    if (res.status === 200) {
      yield put(onLoadCategoryEnrollmentChartSuccess(res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

function* handleOnLoadRevenueYearChart({ payload }) {
  try {
    const res = yield call(requestLoadRevenueYearChart, payload ? payload : 0);

    if (res.status === 200) {
      yield put(onLoadRevenueYearChartSuccess(res.data === "" ? [] : res.data));
    } else {
      // toast.error(MESSAGE_GENERAL_FAILED);
    }
  } catch (error) {
    console.log(error);
    // showMessageError(error);
  }
}

export {
  handleOnLoadDashboard,
  handleOnLoadCategoryEnrollmentChart,
  handleOnLoadRevenueYearChart,
};
