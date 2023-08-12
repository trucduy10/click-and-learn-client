import { createSelector } from "@reduxjs/toolkit";

const selectUserReducer = (state) => state.auth; //store in rootReducer

export const selectUser = createSelector(
  [selectUserReducer],
  (authSlice) => authSlice.user
);
export const selectUserId = createSelector(
  [selectUserReducer],
  (authSlice) => authSlice.user.id
);

export const selectIsUserChangePasswordSuccess = createSelector(
  [selectUserReducer],
  (authSlice) => authSlice.isUserChangePasswordSuccess
);

export const selectRolesAndPermissions = createSelector(
  [selectUserReducer],
  (authSlice) => ({
    roles: authSlice.roles,
    managerEmployeeRoles: authSlice.managerEmployeeRoles,
    permissions: authSlice.permissions,
  })
);

// export const selectUserIsSuccess = createSelector(
//   [selectUserReducer],
//   (userSlice) => userSlice.isSuccess
// );

// export const selectUserFailed = createSelector(
//   [selectUserReducer],
//   (userSlice) => userSlice.error
// );
