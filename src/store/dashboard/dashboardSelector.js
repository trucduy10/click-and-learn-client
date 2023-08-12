import { createSelector } from "@reduxjs/toolkit";

const selectDashboardReducer = (state) => state.dashboard; //store in rootReducer

export const selectAllDashboardState = createSelector(
  [selectDashboardReducer],
  (dashboardSlice) => ({
    dashboard: dashboardSlice.dashboard,
    cateEnrollChart: dashboardSlice.cateEnrollChart,
    revenueChart: dashboardSlice.revenueChart,
  })
);
