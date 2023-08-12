const { createSlice } = require("@reduxjs/toolkit");

const questionSlice = createSlice({
  name: "question",
  initialState: {
    isLoading: false,
    isPostQuestionSuccess: false,
    isBulkDeleteSuccess: false,
    questions: [],
  },
  reducers: {
    onLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    onGetQuestionsByPartId: (state, action) => ({
      ...state,
      isLoading: true,
      isPostQuestionSuccess: false,
    }),
    onGetQuestionsByPartIdSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isBulkDeleteSuccess: false,
      questions: action.payload,
    }),
    onPostQuestion: (state, action) => ({
      ...state,
      isLoading: true,
      isPostQuestionSuccess: false,
    }),
    onPostQuestionSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isPostQuestionSuccess: action.payload,
    }),
    onDeleteQuestion: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onBulkDeleteQuestion: (state, action) => ({
      ...state,
      isLoading: true,
      isBulkDeleteSuccess: false,
    }),
    onBulkDeleteQuestionSuccess: (state, action) => ({
      ...state,
      isBulkDeleteSuccess: action.payload,
    }),
  },
});

export const {
  onLoading,
  onGetQuestionsByPartId,
  onGetQuestionsByPartIdSuccess,
  onPostQuestion,
  onPostQuestionSuccess,
  onDeleteQuestion,
  onBulkDeleteQuestion,
  onBulkDeleteQuestionSuccess,
} = questionSlice.actions;
// reducer
export default questionSlice.reducer;
