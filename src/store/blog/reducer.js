import { BLOG_ACTION_TYPES } from "./type";

const BLOG_INITIAL_TYPES = {
  error: "",
  isFetching: false, //load se co tgian cho
  blogs: {},
};

export const blogReducer = (state = BLOG_INITIAL_TYPES, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case BLOG_ACTION_TYPES.FETCH_BLOG_START:
      return {
        ...state,
        isFetching: true,
      };
    case BLOG_ACTION_TYPES.FETCH_BLOG_SUCCESS:
      return {
        ...state,
        isFetching: false,
        blogs: payload,
      };
    case BLOG_ACTION_TYPES.FETCH_BLOG_FAILED:
      return {
        ...state,
        isFetching: false,
        error: payload,
      };
    default:
      return state;
  }
};
