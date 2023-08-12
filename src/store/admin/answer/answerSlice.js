const { createSlice } = require("@reduxjs/toolkit");

const answerSlice = createSlice({
  name: "answer",
  initialState: {
    isLoading: false,
    isPostAnswerSuccess: false,
    isBulkDeleteSuccess: false,
    answers: [],
  },
  reducers: {
    onLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    onGetAnswersByQuestionId: (state, action) => ({
      ...state,
      isLoading: true,
      isPostAnswerSuccess: false,
    }),
    onGetAnswersByQuestionIdSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isBulkDeleteSuccess: false,
      answers: action.payload,
    }),
    onPostAnswer: (state, action) => ({
      ...state,
      isLoading: true,
      isPostAnswerSuccess: false,
    }),
    onPostAnswerSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isPostAnswerSuccess: action.payload,
    }),
    onDeleteAnswer: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onBulkDeleteAnswer: (state, action) => ({
      ...state,
      isLoading: true,
      isBulkDeleteSuccess: false,
    }),
    onBulkDeleteAnswerSuccess: (state, action) => ({
      ...state,
      isBulkDeleteSuccess: action.payload,
    }),
  },
});

export const {
  onLoading,
  onGetAnswersByQuestionId,
  onGetAnswersByQuestionIdSuccess,
  onPostAnswer,
  onPostAnswerSuccess,
  onDeleteAnswer,
  onBulkDeleteAnswer,
  onBulkDeleteAnswerSuccess,
} = answerSlice.actions;
// reducer
export default answerSlice.reducer;
