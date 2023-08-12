import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isSuccess: false,
  pagiAuthor: {
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
  searchValue: {
    categoryId: 0,
    sortKey: "ASC",
    searchKey: "name",
    searchValue: "",
    pageNo: 0,
    pageSize: 2,
  },
  top3: [],
  errorMessage: null,
  isFilter: false,
  subcribes: [],
  userSubcribes: [],
  isSubcribed: false,
  author: null,
  authors: [],
};
const authorSlice = createSlice({
  name: "author",
  initialState: { ...initialState },
  reducers: {
    onAuthorInitialState: (state, action) => ({
      ...initialState,
    }),
    onGetAuthors: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onGetAuthorsSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      authors: action.payload,
    }),
    onGetSubcribesByAuthorId: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onGetSubcribesByAuthorIdSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      userSubcribes: [
        ...state.userSubcribes,
        {
          authorId: action.payload.authorId,
          totalSubcribes: action.payload.data.length || 0,
          data: action.payload.data
        },
      ],
    }),
    onLoadTop3Authors: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadTop3AuthorsSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      top3: action.payload,
    }),
    onLoadAuthorsPagination: (state, action) => ({
      ...state,
      isLoading: true,
      searchValue: action.payload,
      isFilter: action.payload.isFilter,
    }),
    onLoadAuthorsPaginationSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      pagiAuthor: {
        ...state.pagiAuthor,
        content: state.isFilter
          ? action.payload.content
          : [...state.pagiAuthor.content, ...action.payload.content],
        empty: action.payload.empty,
        first: action.payload.first,
        last: action.payload.last,
        number: action.payload.number,
        numberOfElements: action.payload.numberOfElements,
        pageable: action.payload.pageable,
        size: action.payload.size,
        sort: action.payload.sort,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      },
    }),
    onLoadSubcribesByUserId: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadSubcribesByUserIdSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      subcribes: action.payload,
    }),
    onSubcribeAuthor: (state, action) => ({
      ...state,
      isLoading: true,
      subcribes: [...state.subcribes, action.payload],
    }),
    onSubcribeAuthorSuccess: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    onUnsubcribeAuthor: (state, action) => ({
      ...state,
      isLoading: true,
      subcribes: state.subcribes.filter(
        (s) => s.authorId !== action.payload.authorId
      ),
    }),
    onUnsubcribeAuthorSuccess: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    onLoadAuthor: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onLoadAuthorSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      author: action.payload,
    }),
  },
});

export const {
  onAuthorInitialState,
  onGetAuthors,
  onGetAuthorsSuccess,
  onGetSubcribesByAuthorId,
  onGetSubcribesByAuthorIdSuccess,
  onLoadTop3Authors,
  onLoadTop3AuthorsSuccess,
  onLoadAuthorsPagination,
  onLoadAuthorsPaginationSuccess,
  onLoadSubcribesByUserId,
  onLoadSubcribesByUserIdSuccess,
  onSubcribeAuthor,
  onSubcribeAuthorSuccess,
  onUnsubcribeAuthor,
  onUnsubcribeAuthorSuccess,
  onLoadAuthor,
  onLoadAuthorSuccess,
} = authorSlice.actions;
// authReducer
export default authorSlice.reducer;
