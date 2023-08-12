import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    usersAllRole: [],
    isLoading: false,
    isPostUserSuccess: false,
    isBulkDeleteSuccess: false,
  },
  reducers: {
    onLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    onGetUsers: (state, action) => ({
      ...state,
      isLoading: true,
      isPostUserSuccess: false,
    }),
    onGetUsersSuccess: (state, action) => ({
      ...state,
      users: action.payload,
      isLoading: false,
    }),
    onGetAllUsers: (state, action) => ({
      ...state,
      isLoading: true,
      isPostUserSuccess: false,
    }),
    onGetAllUsersSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      usersAllRole: action.payload,
    }),
    onCreateUser: (state, action) => ({
      ...state,
      isLoading: true,
      isPostUserSuccess: false,
    }),
    onUpdateUser: (state, action) => ({
      ...state,
      isLoading: true,
      isPostUserSuccess: false,
    }),
    onPostUserSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      isPostUserSuccess: action.payload,
    }),
    onDeleteUser: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    onDeleteUserSuccess: (state, action) => ({
      ...state,
      isLoading: false,
      users: state.users.filter((item) => item.id !== action.payload),
    }),
    onBulkDeleteUser: (state, action) => ({
      ...state,
      isLoading: true,
      isBulkDeleteSuccess: false,
    }),
    onBulkDeleteUserSuccess: (state, action) => ({
      ...state,
      isBulkDeleteSuccess: action.payload,
    }),
  },
});

export const {
  onLoading,
  onGetUsers,
  onGetUsersSuccess,
  onGetAllUsers,
  onGetAllUsersSuccess,
  onCreateUser,
  onUpdateUser,
  onPostUserSuccess,
  onDeleteUser,
  onDeleteUserSuccess,
  onBulkDeleteUser,
  onBulkDeleteUserSuccess,
} = userSlice.actions;
// reducer
export default userSlice.reducer;
