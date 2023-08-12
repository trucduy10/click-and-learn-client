import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
  categories: [],
};
const categorySlice = createSlice({
  name: "category",
  initialState: { ...initialState },
  reducers: {
    onCategoryInitialState: (state, action) => ({
      ...initialState,
    }),
    onLoadCategories: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadCategoriesSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      categories: action.payload,
    }),
  },
});

export const {
  onCategoryInitialState,
  onLoadCategories,
  onLoadCategoriesSuccess,
} = categorySlice.actions;
// authReducer
export default categorySlice.reducer;
