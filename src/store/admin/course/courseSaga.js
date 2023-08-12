import { takeLatest } from "redux-saga/effects";
import {
  handleOnGetCourses,
  handleOnUpdateCourse,
} from "./courseHandlers";
import { onGetCourses, onUpdateCourse } from "./courseSlice";

export default function* courseSaga() {
  yield takeLatest(onGetCourses.type, handleOnGetCourses);
  yield takeLatest(onUpdateCourse.type, handleOnUpdateCourse);
}
