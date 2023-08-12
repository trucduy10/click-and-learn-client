import { createSelector } from "@reduxjs/toolkit";

const selectCategoryReducer = (state) => state.category; //store in rootReducer

export const selectAllCategoriesState = createSelector(
  [selectCategoryReducer],
  (categorySlice) => ({
    categories: categorySlice.categories,
  })
);
