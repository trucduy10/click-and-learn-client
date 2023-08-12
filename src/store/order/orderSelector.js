import { createSelector } from "@reduxjs/toolkit";

const selectOrderReducer = (state) => state.order; //store in rootReducer

export const selectAllOrderState = createSelector(
  [selectOrderReducer],
  (orderSlice) => ({
    orderHistory: orderSlice.orderHistory,
    refund: orderSlice.refund,
    invoice: orderSlice.invoice,
    isLoading: orderSlice.isLoading,
  })
);
