import React, { useEffect, useMemo, useState } from "react";
import { axiosBearer } from "../../../api/axiosInstance";
import { ButtonCom } from "../../../components/button";
import GapYCom from "../../../components/common/GapYCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import { TableCom } from "../../../components/table";
import {
  IconEditCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../components/icon";
import * as yup from "yup";
import {
  CAPTION_EXT_REGEX,
  CAPTION_EXT_VALID,
  MESSAGE_CAPTION_FILE_INVALID,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_GENERAL_FAILED,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_NUMBER_POSITIVE,
  MESSAGE_NUMBER_REQUIRED,
  MESSAGE_UPDATE_STATUS_SUCCESS,
  MESSAGE_UPLOAD_REQUIRED,
  MESSAGE_VIDEO_FILE_INVALID,
  NOT_FOUND_URL,
  VIDEO_EXT_VALID,
} from "../../../constants/config";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import ReactModal from "react-modal";
import { LabelCom } from "../../../components/label";
import { InputCom } from "../../../components/input";
import {
  convertSecondToDiffForHumans,
  getDurationFromVideo,
  showMessageError,
  sliceText,
} from "../../../utils/helper";
import { useNavigate } from "react-router-dom/dist";
import {
  API_COURSE_URL,
  API_LESSON_URL,
  API_SECTION_URL,
} from "../../../constants/endpoint";
import { SwitchAntCom } from "../../../components/ant";
import ReactPlayer from "react-player";
import { TextEditorQuillCom } from "../../../components/texteditor";
import { getToken } from "../../../utils/auth";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import useExportExcel from "../../../hooks/useExportExcel";
import AdminCardCom from "../../../components/common/card/admin/AdminCardCom";

const AdminLessonListPage = () => {
  /********* API State ********* */
  const [lessons, setLessons] = useState([]);
  const [section, setSection] = useState({});
  const [course, setCourse] = useState({});
  const [video, setVideo] = useState(); //{} ko có null, undefined nên kiểm tra lúc nào cũng + token -> lỗi
  const [videoFile, setVideoFile] = useState([]);
  /********* END API State ********* */
  /********* Validation for Section function ********* */
  const schemaValidation = yup.object().shape({
    id: yup.number(),
    name: yup.string().trim().required(MESSAGE_FIELD_REQUIRED),
    duration: yup
      .number(MESSAGE_FIELD_REQUIRED)
      .typeError(MESSAGE_NUMBER_REQUIRED)
      .min(0, MESSAGE_NUMBER_POSITIVE),
    status: yup.number().default(1),
    ordered: yup.number(MESSAGE_NUMBER_REQUIRED),
    // videoFile: yup
    //   .mixed()
    //   .test("fileFormat", MESSAGE_VIDEO_FILE_INVALID, function (value) {
    //     if (!value) return true;
    //     const extValidArr = VIDEO_EXT_VALID.split(", ");
    //     const videoFileExt = value[0]?.name.split(".").pop().toLowerCase();
    //     return extValidArr.includes(videoFileExt);
    //   }),
    captionFiles: yup
      .mixed()
      .test("fileRequired", MESSAGE_UPLOAD_REQUIRED, function (value) {
        // Check if existed upload videoFile
        if (videoFile?.length > 0 && !value) return false;
        return true;
      })
      .test("fileFormat", MESSAGE_CAPTION_FILE_INVALID, function (value) {
        if (!value) return true;
        for (let i = 0; i < value.length; i++) {
          const captionFile = value[i]?.name.toLowerCase();
          if (!CAPTION_EXT_REGEX.test(captionFile)) return false;
        }
        return true;
      }),
  });

  /********* Variable State ********* */
  const [filterLesson, setFilterLesson] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { access_token } = getToken();

  const resetState = () => {
    setShowUpload(false);
    setShowVideo(true);
    setValue("videoFile", "");
    setValue("captionFiles", "");
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });
  const { courseId, sectionId } = useParams();

  const { handleExcelData } = useExportExcel("lesson");
  const handleExport = () => {
    const headers = [
      "No",
      "Lesson Name",
      "Course",
      "Section",
      "Status",
      "Ordered",
      "Duration",
    ];
    const data = lessons.map((item, index) => [
      index + 1,
      item.name,
      course?.name,
      section?.name,
      item.status === 1 ? "Active" : "InActive",
      item.ordered,
      convertSecondToDiffForHumans(item?.duration),
    ]);
    handleExcelData(headers, data);
  };

  /********* Fetch data Area ********* */
  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      sortable: true,
      width: "70px",
    },
    {
      name: "Lesson Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => convertSecondToDiffForHumans(row.duration),
    },
    {
      name: "Status",
      selector: (row) => (
        <SwitchAntCom
          defaultChecked={row.status === 1 ? true : false}
          className={`${
            row.status === 1 ? "" : "bg-tw-danger hover:!bg-tw-orange"
          }`}
          onChange={(isChecked) => handleChangeSwitch(row.id, isChecked)}
        />
      ),
    },
    {
      name: "Order",
      selector: (row) => row.ordered,
      sortable: true,
    },
    {
      name: "Updated By",
      selector: (row) => sliceText(row?.updatedBy ?? "N/A", 12),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <ButtonCom
            className="px-3 rounded-lg mr-2"
            backgroundColor="info"
            onClick={() => {
              setIsOpen(true);
              getLessonById(row.id);
              getVideoByLessonId(row.id);
              resetState();
            }}
          >
            <IconEditCom className="w-5"></IconEditCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDelete({ lessonId: row.id, name: row.name });
            }}
          >
            <IconTrashCom className="w-5"></IconTrashCom>
          </ButtonCom>
        </>
      ),
    },
  ];
  /********* More Actions ********* */
  const dropdownItems = [
    {
      key: "1",
      label: (
        <div
          rel="noopener noreferrer"
          className="hover:text-tw-success transition-all duration-300"
          onClick={handleExport}
        >
          Export
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          rel="noopener noreferrer"
          className="hover:text-tw-danger transition-all duration-300"
          onClick={() => handleBulkDelete()}
        >
          Bulk Delete
        </div>
      ),
    },
  ];

  /********* Delete One ********* */
  const handleDelete = ({ lessonId, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete lesson: <span class="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosBearer.delete(
            `${API_SECTION_URL}/${sectionId}/lesson?lessonId=${lessonId}`
          );

          getLessonsBySectionId();
          reset(res.data);
          toast.success(res.data.message);
        } catch (error) {
          showMessageError(error);
        }
      }
    });
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.warning(MESSAGE_NO_ITEM_SELECTED);
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete <span className="text-tw-danger">${
        selectedRows.length
      } selected ${selectedRows.length > 1 ? "lessons" : "lesson"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = selectedRows.map((row) =>
            axiosBearer.delete(
              `${API_SECTION_URL}/${sectionId}/lesson?lessonId=${row.id}`
            )
          );
          await Promise.all(deletePromises);
          toast.success(
            `Delete [${selectedRows.length}] ${
              selectedRows.length > 1 ? "lessons" : "lesson"
            } success`
          );
        } catch (error) {
          showMessageError(error);
        } finally {
          fetchingData();
          clearSelectedRows();
        }
      }
    });
  };

  /********** Fetch data Area ************ */
  /********* API List Section ********* */
  const getLessonsBySectionId = async () => {
    try {
      const res = await axiosBearer.get(`/section/${sectionId}/lesson`);

      setLessons(res.data);
      setFilterLesson(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseById = async () => {
    try {
      const res = await axiosBearer.get(`${API_COURSE_URL}/${courseId}`);
      setCourse(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        navigate(NOT_FOUND_URL);
        return false;
      }
      console.log(error);
    }
  };

  const getSectionById = async () => {
    try {
      const res = await axiosBearer.get(
        `${API_COURSE_URL}/${courseId}/section/${sectionId}`
      );
      setSection(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        navigate(NOT_FOUND_URL);
        return false;
      }
    }
  };

  /********* Get getLessonById from row ********* */
  const getLessonById = async (lessonId) => {
    try {
      const res = await axiosBearer.get(
        `/section/${sectionId}/lesson/${lessonId}`
      );
      reset(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getVideoByLessonId = async (lessonId) => {
    try {
      const res = await axiosBearer.get(`${API_LESSON_URL}/${lessonId}/video`);
      setVideo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingData = async () => {
    try {
      setIsFetching(true);
      await getLessonsBySectionId();
      await getCourseById();
      await getSectionById();
    } catch (error) {
      showMessageError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /********** END Fetch data Area ************ */

  /********* API Search Section ********* */
  useEffect(() => {
    const result = lessons.filter((lesson) => {
      const keys = Object.keys(lesson);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = lesson[key];
        if (
          typeof value === "string" &&
          value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        ) {
          return true;
        }
        if (
          typeof value === "number" &&
          String(value).toLocaleLowerCase() === search.toLocaleLowerCase()
        ) {
          return true;
        }
      }
      return false;
    });

    setFilterLesson(result);
  }, [lessons, search]);

  /********* Update ********* */
  const handleSubmitForm = async (values) => {
    if (videoFile && videoFile.length > 0) {
      const extValidArr = VIDEO_EXT_VALID.split(", ");
      const file = videoFile[0];
      const videoFileExt = file.name.split(".").pop().toLowerCase();

      if (!extValidArr.includes(videoFileExt)) {
        toast.error(MESSAGE_GENERAL_FAILED);
        setError("videoFile", { message: MESSAGE_VIDEO_FILE_INVALID });
        setValue("videoFile", null);
        return;
      }
    }

    const {
      id,
      name,
      status,
      duration,
      ordered,
      description,
      // videoFile,
      captionFiles,
    } = values;
    // Case Click choose Caption then click again and choose cancel then submit
    if (captionFiles !== "" && captionFiles.length === 0) {
      const captionSelector = document.querySelector(
        'input[name="captionFiles"]'
      );
      if (captionSelector) captionSelector.focus();
      setError("captionFiles", { message: MESSAGE_UPLOAD_REQUIRED });
      setValue("captionFiles", "");
      return;
    }
    try {
      setIsLoading(!isLoading);
      const res = await axiosBearer.put(`/section/${sectionId}/lesson`, {
        name,
        sectionId,
        id,
        status,
        duration,
        ordered,
        description,
      });
      // Update lessons State
      setLessons((prev) => {
        const newData = prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              name,
              status,
              duration,
              ordered,
              description,
            };
          }
          return item;
        });
        return newData;
      });
      if (videoFile && videoFile.length > 0) {
        const fd = new FormData();
        fd.append("videoFile", videoFile[0]);
        for (let i = 0; i < captionFiles.length; i++) {
          fd.append("captionFiles", captionFiles[i]);
        }
        await axiosBearer.post(`${API_LESSON_URL}/${id}/video`, fd);
      }
      toast.success(`${res.data.message}`);
    } catch (error) {
      showMessageError(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleChangeSwitch = async (lessonId, isChecked) => {
    try {
      const newLessons = lessons.map((lession) =>
        lession.id === lessonId
          ? {
              ...lession,
              status: isChecked ? 1 : 0,
            }
          : lession
      );
      const dataBody = newLessons.find((lesson) => lesson.id === lessonId);
      await axiosBearer.put(`${API_SECTION_URL}/${sectionId}/lesson`, dataBody);
      toast.success(MESSAGE_UPDATE_STATUS_SUCCESS);
      getLessonsBySectionId();
    } catch (error) {
      showMessageError(error);
    }
  };

  const handleToggleChangeVideo = () => {
    setShowUpload(!showUpload);
    setShowVideo(!showVideo);
    // Check if input video already, then Back will reset value
    if (!showVideo) {
      setValue("videoFile", "");
      setValue("captionFiles", "");
    }
  };

  /********* Library Function Area ********* */
  const handleRowSelection = (currentRowsSelected) => {
    setSelectedRows(currentRowsSelected.selectedRows);
  };
  // Clear Selected after Mutiple Delete
  const clearSelectedRows = () => {
    setSelectedRows([]);
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleGetDurationForVideo = (e) => {
    const file = e.target.files;
    setVideoFile(file);
    getDurationFromVideo(file[0], setValue);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Lesson</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "Course",
              slug: "/admin/courses",
            },
            {
              title: "Section",
              slug: `/admin/courses/${courseId}/sections`,
            },
            {
              title: "Lesson",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <AdminCardCom>
              <TableCom
                tableKey={tableKey}
                urlCreate={`/admin/courses/${courseId}/sections/${sectionId}/lessons/create`}
                title={`Course: ${course?.name}, Section: ${section?.name}`}
                columns={columns}
                items={filterLesson}
                search={search}
                dropdownItems={dropdownItems}
                setSearch={setSearch}
                onSelectedRowsChange={handleRowSelection} // selected Mutilple
              ></TableCom>
            </AdminCardCom>
          </div>
        </div>
      </div>
      {/* Modal Edit */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName="modal-overplay fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        className={`modal-content scroll-hidden  max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg outline-none transition-all duration-300 ${
          isOpen ? "w-50" : "w-0"
        }`}
      >
        <div className="card-header bg-tw-primary flex justify-between text-white">
          <HeadingFormH5Com className="text-2xl">Edit Lesson</HeadingFormH5Com>
          <ButtonCom backgroundColor="danger" className="px-2">
            <IconRemoveCom
              className="flex items-center justify-center p-2 w-10 h-10 rounded-xl bg-opacity-20 text-white"
              onClick={() => setIsOpen(false)}
            ></IconRemoveCom>
          </ButtonCom>
        </div>
        <div className="card-body">
          <form
            className="theme-form"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <InputCom
              type="hidden"
              control={control}
              name="id"
              register={register}
              placeholder="Lesson hidden id"
              errorMsg={errors.id?.message}
            ></InputCom>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <LabelCom htmlFor="name" isRequired>
                    Lesson Name
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="name"
                    register={register}
                    placeholder="Input lesson Name"
                    errorMsg={errors.name?.message}
                    defaultValue={watch("name")}
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom htmlFor="ordered">Ordered</LabelCom>
                  <InputCom
                    type="number"
                    control={control}
                    name="ordered"
                    register={register}
                    placeholder="Input lesson ordered"
                    errorMsg={errors.ordered?.message}
                    defaultValue={0}
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row justify-center">
                <div className="col-sm-3 text-center">
                  <ButtonCom
                    backgroundColor={`${showVideo ? "info" : "danger"}`}
                    onClick={handleToggleChangeVideo}
                  >
                    {showVideo ? "Change Video" : "Back"}
                  </ButtonCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className={`row upload-new ${showUpload ? "" : "hidden"}`}>
                <div className="col-sm-6">
                  <LabelCom
                    htmlFor="videoFile"
                    subText={`File: ${sliceText(VIDEO_EXT_VALID, 20)}`}
                  >
                    Video
                  </LabelCom>
                  <InputCom
                    type="file"
                    control={control}
                    name="videoFile"
                    register={register}
                    placeholder="Upload video"
                    errorMsg={errors.videoFile?.message}
                    onChange={(e) => handleGetDurationForVideo(e)}
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom
                    htmlFor="captionFiles"
                    subText={`File: ${CAPTION_EXT_VALID}`}
                  >
                    Caption Files
                  </LabelCom>
                  <InputCom
                    type="file"
                    control={control}
                    name="captionFiles"
                    register={register}
                    placeholder="Upload caption files"
                    multiple
                    errorMsg={errors.captionFiles?.message}
                  ></InputCom>
                </div>
              </div>
              <div className={`row current-video ${showVideo ? "" : "hidden"}`}>
                <div className="col-sm-12 text-center flex justify-center items-center">
                  <ReactPlayer
                    url={video ? video.url + "?token=" + access_token : ""}
                    config={{
                      youtube: {
                        playerVars: { showinfo: 1, controls: 1 },
                      },
                      file: {
                        tracks:
                          video?.captionData &&
                          Object.entries(video?.captionData)?.map(
                            ([lang, src]) => ({
                              kind: "subtitles",
                              src: src,
                              srcLang: lang,
                              default: lang === "en",
                            })
                          ),
                        attributes: {
                          controlsList: "nodownload",
                          crossOrigin: "noorigin",
                        },
                      },
                    }}
                    playing={true}
                    controls
                    muted
                    autoPlay
                  />
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12">
                  <LabelCom htmlFor="description">Description</LabelCom>
                  <TextEditorQuillCom
                    value={watch("description")}
                    onChange={(description) => {
                      setValue("description", description);
                    }}
                    placeholder="Describe your lesson ..."
                  ></TextEditorQuillCom>
                </div>
              </div>
              <GapYCom className="mb-5"></GapYCom>
            </div>
            <div className="card-footer flex justify-end gap-x-5">
              <ButtonCom type="submit" isLoading={isLoading}>
                Update
              </ButtonCom>
            </div>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default AdminLessonListPage;
