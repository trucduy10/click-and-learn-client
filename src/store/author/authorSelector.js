import { createSelector } from "@reduxjs/toolkit";

const selectAuthorReducer = (state) => state.author; //store in rootReducer

export const selectAllAuthorsState = createSelector(
  [selectAuthorReducer],
  (authorSlice) => ({
    top3: authorSlice.top3,
    pagiAuthor: authorSlice.pagiAuthor,
    isFilter: authorSlice.isFilter,
    subcribes: authorSlice.subcribes,
    isSubcribed: authorSlice.isSubcribed,
    author: authorSlice.author,
  })
);
