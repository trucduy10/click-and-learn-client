import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
  dashboard: [],
  cateEnrollChart: [],
  revenueChart: [],
};
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { ...initialState },
  reducers: {
    onDashboardInitialState: (state, action) => ({
      ...initialState,
    }),
    onLoadDashboard: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadDashboardSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      dashboard: action.payload,
    }),
    onLoadCategoryEnrollmentChart: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadCategoryEnrollmentChartSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      cateEnrollChart: action.payload,
    }),
    onLoadRevenueYearChart: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadRevenueYearChartSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      revenueChart: action.payload,
    }),
  },
});

export const {
  onDashboardInitialState,
  onLoadDashboard,
  onLoadDashboardSuccess,
  onLoadCategoryEnrollmentChart,
  onLoadCategoryEnrollmentChartSuccess,
  onLoadRevenueYearChart,
  onLoadRevenueYearChartSuccess,
} = dashboardSlice.actions;
// authReducer
export default dashboardSlice.reducer;
