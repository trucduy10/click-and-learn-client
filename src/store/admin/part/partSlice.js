const { createSlice } = require("@reduxjs/toolkit");

const partSlice = createSlice({
  name: "part",
  initialState: {
    isLoading: false,
    isPostPartSuccess: false,
    isBulkDeleteSuccess: false,
    parts: [],
  },
  reducers: {
    onLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    onGetPartsByCourseId: (state, action) => ({
      ...state,
      isLoading: true,
      isPostPartSuccess: false,
    }),
    onGetPartsByCourseIdSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isBulkDeleteSuccess: false,
      parts: action.payload,
    }),
    onPostPart: (state, action) => ({
      ...state,
      isLoading: true,
      isPostPartSuccess: false,
    }),
    onPostPartSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isPostPartSuccess: action.payload,
    }),
    onDeletePart: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onBulkDeletePart: (state, action) => ({
      ...state,
      isLoading: true,
      isBulkDeleteSuccess: false,
    }),
    onBulkDeletePartSuccess: (state, action) => ({
      ...state,
      isBulkDeleteSuccess: action.payload,
    }),
  },
});

export const {
  onLoading,
  onGetPartsByCourseId,
  onGetPartsByCourseIdSuccess,
  onPostPart,
  onPostPartSuccess,
  onDeletePart,
  onBulkDeletePart,
  onBulkDeletePartSuccess,
} = partSlice.actions;
// reducer
export default partSlice.reducer;
