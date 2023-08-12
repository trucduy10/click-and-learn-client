import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { sortItems } from "../../constants/config";
import { selectAllCourseState } from "../../store/course/courseSelector";
import {
  onDeleteNote,
  onLoadNote,
  onSaveNote,
  onSelectedNote,
} from "../../store/course/courseSlice";
import {
  convertSecondToDiffForHumans,
  convertSecondToTime,
} from "../../utils/helper";
import { SelectDefaultAntCom } from "../ant";
import { ButtonCom } from "../button";
import GapYCom from "../common/GapYCom";
import { IconEditCom, IconTrashCom } from "../icon";
import { DialogConfirmMuiCom } from "../mui";
import { TextEditorQuillCom } from "../texteditor";

const lessonItems = [
  {
    value: "all",
    label: "All Lessons",
  },
  {
    value: "current",
    label: "Current Lesson",
  },
];

const schemaValidation = yup.object().shape({
  note: yup.string(),
  // .required(MESSAGE_FIELD_REQUIRED)
});

const NoteCom = ({
  noteUrl = "/note",
  placeholder = "Write your note...",
  notePoint,
  onWriteNote,
  onSelectNote,
}) => {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowNote, setIsShowNote] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusNote, setIsFocusNote] = useState(false);
  const [openEditKey, setOpenEditKey] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [colorKey, setColorKey] = useState(0);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [filterValue, setFilterValue] = useState("all");
  const [order, setOrder] = useState("ASC");
  const [deleteNote, setDeleteNote] = useState(0);
  const dispatch = useDispatch();

  const { lessonId, sectionId, enrollId, courseId, video, learning, notes } =
    useSelector(selectAllCourseState);

  const [filterNote, setFilterNote] = useState(notes);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });
  useEffect(() => {
    dispatch(onLoadNote({ enrollmentId: enrollId, courseId }));
  }, [courseId, dispatch, enrollId]);

  const getLessonAndSectionName = ({ sectionId, lessonId }) => {
    const section = learning.sectionDto.find((s) => s.id === sectionId);
    const lesson = learning.lessonDto.find(
      (s) => s.id === lessonId && s.sectionId === sectionId
    );

    if (section && lesson) {
      return {
        sectionName: section.name,
        lessonName: lesson.name,
      };
    }
    return null;
  };

  useEffect(() => {
    setFilterValue("all");
    handleChangeFilterLesson("all");
  }, [lessonId]);

  const handleSubmitForm = ({ note }) => {
    const existingNote = notes.find(
      (note) =>
        note.resumePoint === notePoint &&
        note.sectionId === sectionId &&
        note.lessonId === lessonId
    );

    if (existingNote) {
      dispatch(
        onSaveNote({
          id: existingNote.id,
          description: note,
          lessonId,
          sectionId,
          enrollmentId: enrollId,
          courseId,
          videoId: video.id,
          resumePoint: notePoint,
        })
      );
    } else {
      dispatch(
        onSaveNote({
          description: note,
          lessonId,
          sectionId,
          enrollmentId: enrollId,
          courseId,
          videoId: video.id,
          resumePoint: notePoint,
        })
      );
    }
    setIsShowNote(false);
    setNote("");
  };

  useEffect(() => {
    let noteList = [];
    if (filterValue === "current") {
      noteList = [...notes.filter((n) => n.lessonId === lessonId)];
    } else {
      noteList = [...notes];
    }

    noteList = noteList.sort((a, b) => {
      if (order === "ASC") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilterNote(noteList);
  }, [filterValue, lessonId, notes, order]);

  const handleChangeFilterLesson = (value) => {
    setFilterValue(value);
  };

  const handleChangeSortLesson = (value) => {
    setOrder(value);
  };

  // Edit & Delete Area
  const handleEditNote = (editedNote) => {
    dispatch(
      onSaveNote({
        ...editedNote,
        description: note,
      })
    );
    setIsOpenEdit(false);
    setNote("");
  };

  const handleToggleEditNote = (note) => {
    setOpenEditKey(note.id);
    setNote(note.description);
    setIsOpenEdit(true);
  };

  const handleToggleDeleteNote = (noteId) => {
    setOpenDialog(true);
    setDeleteNote(noteId);
  };
  const onConfirm = () => {
    dispatch(onDeleteNote(deleteNote));
    setOpenDialog(false);
  };

  const handleSeekNote = (note) => {
    setColorKey(note.id);
    setIsFocusNote(true);
    dispatch(
      onSelectedNote({
        enrollmentId: enrollId,
        courseId,
        sectionId: note.sectionId,
        lessonId: note.lessonId,
        resumePoint: note.resumePoint,
      })
    );
    setTimeout(() => onSelectNote(note.resumePoint), 1000);
  };

  return (
    <div>
      <DialogConfirmMuiCom
        title="Warning"
        content="Do you want to delete this note?"
        confirmContent="Yes"
        closeContent="No"
        onConfirm={onConfirm}
        onClose={() => setOpenDialog(false)}
        open={openDialog}
      />
      <button
        className={`flex justify-between w-full border-2 solid ${
          isShowNote ? "border-tw-light-pink" : "border-tw-primary"
        } cursor-pointer items-center px-3 py-2 rounded-lg hover:opacity-70 transition-all duration-300`}
        onClick={() => {
          setIsShowNote(!isShowNote);
          setNote("");
          setIsFocus(!isFocus);
          onWriteNote(!isShowNote);
        }}
      >
        <p>
          <strong>Save</strong> a note at{" "}
          <span className="text-tw-light-pink">
            {convertSecondToDiffForHumans(notePoint)}
          </span>
        </p>
        <div
          className={`rounded-full ${
            isShowNote ? "bg-tw-light-pink" : "bg-tw-primary"
          } text-white flex justify-center items-center`}
        >
          <span
            className={`w-6 h-6 ${
              isShowNote ? "rotate-45" : ""
            } transition-transform duration-300`}
          >
            +
          </span>
        </div>
      </button>
      <div className="flex gap-x-2 mt-2">
        <div>
          <SelectDefaultAntCom
            listItems={lessonItems}
            defaultValue={"all"}
            value={filterValue}
            onChange={handleChangeFilterLesson}
            className="border-tw-primary border-2 solid rounded-lg bg-none"
          ></SelectDefaultAntCom>
        </div>
        <div>
          <SelectDefaultAntCom
            listItems={sortItems}
            defaultValue={"DESC"}
            value={order}
            onChange={handleChangeSortLesson}
            className="border-tw-primary border-2 solid rounded-lg bg-none"
          ></SelectDefaultAntCom>
        </div>
      </div>
      {isShowNote && (
        <React.Fragment>
          <GapYCom></GapYCom>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <TextEditorQuillCom
              value={note}
              onChange={(note) => {
                setValue("note", note);
                setNote(note);
              }}
              placeholder={placeholder}
              focus={isFocus}
              isUploadImage={false}
            ></TextEditorQuillCom>
            <GapYCom className="mb-5"></GapYCom>
            <div>
              <ButtonCom type="submit" isLoading={isLoading}>
                Save
              </ButtonCom>
              <ButtonCom
                className="!text-black ml-2"
                backgroundColor="gray"
                onClick={() => {
                  setIsShowNote(false);
                  setIsFocus(false);
                }}
              >
                Close
              </ButtonCom>
            </div>
          </form>
        </React.Fragment>
      )}
      {filterNote.map((n) => {
        const { sectionName, lessonName } = getLessonAndSectionName(n);
        return openEditKey === n.id && isOpenEdit ? (
          <div
            className="flex justify-between w-full items-center mt-4 "
            key={n.id}
          >
            <div className=" w-full">
              <div className="flex gap-x-2">
                <ButtonCom>{convertSecondToTime(n.resumePoint)}</ButtonCom>
                <span>
                  <strong>{sectionName}</strong>
                </span>

                <span>{lessonName}</span>
              </div>
              <GapYCom></GapYCom>
              <form className="ml-20 mr-20">
                <TextEditorQuillCom
                  value={note}
                  onChange={(note) => {
                    setValue("note", note);
                    setNote(note);
                  }}
                  placeholder={placeholder}
                  focus={isFocus}
                ></TextEditorQuillCom>
                <GapYCom className="mb-5"></GapYCom>
                <div>
                  <ButtonCom
                    isLoading={isLoading}
                    onClick={() => handleEditNote(n)}
                  >
                    Save
                  </ButtonCom>
                  <ButtonCom
                    className="!text-black ml-2"
                    backgroundColor="gray"
                    onClick={() => {
                      setIsOpenEdit(false);
                      setIsFocus(false);
                    }}
                  >
                    Close
                  </ButtonCom>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-4" key={n.id}>
            <div className="flex gap-x-2">
              <ButtonCom
                backgroundColor={
                  isFocusNote && colorKey === n.id ? "dark" : "primary"
                }
                onClick={() => handleSeekNote(n)}
              >
                {convertSecondToTime(n.resumePoint)}
              </ButtonCom>

              <div>
                {/*
              <h5 className="font-bold text-lg">2. Course: PHP Advance</h5>
              */}
                <div className="flex gap-x-2">
                  <span>
                    <strong>{sectionName}</strong>
                  </span>

                  <span>{lessonName}</span>
                </div>

                <div dangerouslySetInnerHTML={{ __html: n.description }}></div>
              </div>
            </div>
            <div className="flex-none">
              <ButtonCom
                className="px-3 rounded-lg mr-2"
                backgroundColor="info"
                onClick={() => {
                  // Truyền noteId
                  handleToggleEditNote(n);
                }}
              >
                <IconEditCom className="w-5"></IconEditCom>
              </ButtonCom>
              <ButtonCom
                className="px-3 rounded-lg"
                backgroundColor="danger"
                onClick={() => {
                  // Truyền noteId
                  handleToggleDeleteNote(n.id);
                }}
              >
                <IconTrashCom className="w-5"></IconTrashCom>
              </ButtonCom>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NoteCom;
