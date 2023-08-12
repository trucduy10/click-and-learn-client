import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
  orderHistory: {
    content: [],
    empty: false,
    first: false,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: null,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
  },
  refund: {
    content: [],
    empty: false,
    first: false,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: null,
    size: 0,
    sort: null,
    totalElements: 0,
    totalPages: 0,
  },
  invoice: null,
};
const orderSlice = createSlice({
  name: "order",
  initialState: { ...initialState },
  reducers: {
    onOrderInitialState: (state, action) => ({
      ...initialState,
    }),
    onLoadOrderHistory: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadOrderHistorySuccess: (state, action) => ({
      ...state,
      isLoading: false,
      orderHistory: action.payload,
    }),
    onLoadOrderHistoryRefund: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadOrderHistoryRefundSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      refund: action.payload,
    }),

    onSelectedInvoice: (state, action) => {
      const filteredInvoice = state.orderHistory.content.filter(
        (order) => order.id === action.payload
      );

      if (filteredInvoice.length > 0) {
        return {
          ...state,
          invoice: filteredInvoice[0],
        };
      }
      return {
        ...state,
      };
    },

    onLoadInvoice: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadInvoiceSuccess: (state, action) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const {
  onOrderInitialState,
  onLoadOrderHistory,
  onLoadOrderHistorySuccess,
  onLoadOrderHistoryRefund,
  onLoadOrderHistoryRefundSuccess,
  onSelectedInvoice,
  onLoadInvoice,
  onLoadInvoiceSuccess,
} = orderSlice.actions;
// authReducer
export default orderSlice.reducer;
