import { configureStore } from "@reduxjs/toolkit";
//import logger from "redux-logger";
import { createLogger } from "redux-logger";
import rootSaga from "./rootSaga";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import storage from "redux-persist/lib/storage";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "course",
    "part",
    "question",
    "answer",
    "user",
    "adminCourse",
    "adminBlog",
  ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const logger = createLogger({
  predicate: (getState, action) => {
    const excludedActions = [
      "course/onUnloadExam",
      "course/onAddNotification",
      // "course/onCountdown",
    ];
    return !excludedActions.includes(action.type);
  },
});
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }).concat(logger, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
