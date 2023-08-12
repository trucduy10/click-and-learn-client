import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as yup from "yup";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import AdminCardCom from "../../../components/common/card/admin/AdminCardCom";
import CardHeaderCom from "../../../components/common/card/CardHeaderCom";
import GapYCom from "../../../components/common/GapYCom";
import LoadingCom from "../../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import {
  IconAnswerCom,
  IconCheckCom,
  IconClockCom,
  IconEditCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TableCom } from "../../../components/table";
import { TextEditorQuillCom } from "../../../components/texteditor";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_MAINTENANCE,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_NUMBER_POSITIVE,
  MESSAGE_POINT_EXCEED_MAX,
  MESSAGE_READONLY,
  NOT_FOUND_URL,
} from "../../../constants/config";
import {
  onBulkDeleteQuestion,
  onDeleteQuestion,
  onGetQuestionsByPartId,
  onPostQuestion,
} from "../../../store/admin/question/questionSlice";
import {
  convertSecondToDiffForHumans,
  fakeName,
  showMessageError,
  sliceText,
} from "../../../utils/helper";

const schemaValidation = yup.object().shape({
  point: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .matches(/^\d+(\.\d+)?$/, MESSAGE_NUMBER_POSITIVE),
  description: yup.string().required(MESSAGE_FIELD_REQUIRED),
});

const AdminQuestionListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId, partId } = useParams();
  const { data } = useSelector((state) => state.course);
  const { parts } = useSelector((state) => state.part);
  const courseById = data?.find((item) => item.id === parseInt(courseId));
  const partById = parts?.find((item) => item.id === parseInt(partId));
  if (!courseById || !partById) navigate(NOT_FOUND_URL);

  const { questions, isLoading, isBulkDeleteSuccess, isPostQuestionSuccess } =
    useSelector((state) => state.question);

  const totalCurrentQuestionsPoint = questions.reduce(
    (acc, current) => acc + current.point,
    0
  );

  /********* State ********* */
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterItem, setFilterItem] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [description, setDescription] = useState("");
  const [questionByIdPoint, setQuestionByIdPoint] = useState(0);

  const [isFetching, setIsFetching] = useState(false);

  // Fetch Data
  useEffect(() => {
    dispatch(onGetQuestionsByPartId({ partId }));
    if (isPostQuestionSuccess && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostQuestionSuccess]);

  // Search in Table if using Redux
  useEffect(() => {
    if (search) {
      if (!questions) return;

      const result = questions.filter((item) => {
        const keys = Object.keys(item);
        // Return all items if search is empty
        if (!search) return true;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = item[key];

          if (
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
          ) {
            return true;
          }

          if (
            typeof value === "number" &&
            String(value).toLowerCase() === search.toLowerCase()
          ) {
            return true;
          }
        }

        return false;
      });

      setFilterItem(result);
    } else {
      // Default, setItem for search
      if (questions) {
        const sortedQuestions = [...questions].sort(
          (a, b) => Number(a.fullAnswer) - Number(b.fullAnswer)
        );
        setFilterItem(sortedQuestions);
      }
    }
  }, [questions, search]);

  useEffect(() => {
    if (isBulkDeleteSuccess) clearSelectedRows();
  }, [isBulkDeleteSuccess]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Quiz code",
      selector: (row) => fakeName("QUIZ", row.id),
      sortable: true,
    },
    {
      name: "Quiz",
      selector: (row) => sliceText(row.description),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) =>
        row.fullAnswer ? (
          <ButtonCom
            icon={<IconCheckCom />}
            padding="px-3"
            backgroundColor="success"
            className="!cursor-default rounded-none w-full"
          >
            Done
          </ButtonCom>
        ) : (
          <ButtonCom
            icon={<IconClockCom />}
            padding="px-3"
            backgroundColor="danger"
            className="!cursor-default rounded-none w-full"
          >
            Pending
          </ButtonCom>
        ),
      width: "150px",
    },
    {
      name: "Answer",
      cell: (row) => (
        <>
          <Link
            to={`/admin/courses/${courseId}/parts/${partId}/questions/${row.id}/answers`}
          >
            <ButtonCom className="px-3 rounded-lg mr-2" backgroundColor="gray">
              <IconAnswerCom className="text-tw-success" />
            </ButtonCom>
          </Link>
        </>
      ),
      width: "100px",
    },
    {
      name: "Point",
      selector: (row) => row.point,
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
              handleEdit(row.id);
            }}
          >
            <IconEditCom className="w-5"></IconEditCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDelete({
                questionId: row.id,
                name: fakeName("QUIZ", row.id),
              });
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
          // onClick={handleExport}
          onClick={() => toast.info(MESSAGE_MAINTENANCE)}
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
  const handleDelete = ({ questionId, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete quiz: <span class="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          onDeleteQuestion({
            partId: parseInt(partId),
            questionId,
          })
        );
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
      } selected ${selectedRows.length > 1 ? "quizzes" : "quiz"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onBulkDeleteQuestion(selectedRows));
      }
    });
  };

  ///********* Update Area *********
  const getQuestionById = (questionId, action = "n/a") => {
    setIsFetching(true);
    const item = questions.find((item) => item.id === questionId);
    switch (action) {
      case "fetch":
        typeof item !== "undefined" ? reset(item) : showMessageError("No data");
        break;
      default:
        break;
    }
    setIsFetching(false);

    setQuestionByIdPoint(totalCurrentQuestionsPoint - item.point);
    return typeof item !== "undefined" ? item : showMessageError("No data");
  };

  const handleEdit = (questionId) => {
    setIsOpen(true);
    getQuestionById(questionId, "fetch");
  };

  const handleSubmitForm = (values) => {
    const point = parseFloat(values.point);
    const currentPoint = totalCurrentQuestionsPoint > 0 ? questionByIdPoint : 0;
    if (partById?.maxPoint - currentPoint < point) {
      toast.error(MESSAGE_POINT_EXCEED_MAX);
      return;
    }
    dispatch(
      onPostQuestion({
        ...values,
        point,
        partId: parseInt(partId),
      })
    );
  };

  /********* Library Function Area ********* */
  const handleRowSelection = (currentRowsSelected) => {
    setSelectedRows(currentRowsSelected.selectedRows);
  };
  // Clear Selected after Bulk Delete
  const clearSelectedRows = () => {
    setSelectedRows([]);
    setTableKey((prevKey) => prevKey + 1);
  };

  // Check isFinish a Part
  const isFinish =
    partById?.maxPoint - totalCurrentQuestionsPoint === 0 ? true : false;
  return (
    <>
      {(isLoading || isFetching) && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Question</HeadingH1Com>
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
              title: "Part",
              slug: `/admin/courses/${courseId}/parts`,
            },
            {
              title: "Question",
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
                urlCreate={`/admin/courses/${courseId}/parts/${partId}/questions/create`}
                classNameBtnCreate={isFinish ? "hidden" : ""}
                title={`${sliceText(courseById?.name, 30)}, ${fakeName(
                  "PART",
                  partId
                )}`}
                columns={columns}
                items={filterItem}
                search={search}
                setSearch={setSearch}
                dropdownItems={dropdownItems}
                onSelectedRowsChange={handleRowSelection} // selected Multiple
              />
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
          <HeadingFormH5Com className="text-2xl">
            Edit Question
          </HeadingFormH5Com>
          <ButtonCom backgroundColor="danger" className="px-2">
            <IconRemoveCom
              className="flex items-center justify-center p-2 w-10 h-10 rounded-xl bg-opacity-20 text-white"
              onClick={() => setIsOpen(false)}
            ></IconRemoveCom>
          </ButtonCom>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <InputCom
              type="hidden"
              control={control}
              name="id"
              register={register}
              placeholder="Question hidden id"
              errorMsg={errors.id?.message}
            ></InputCom>
            <CardHeaderCom
              title={fakeName("PART", partId)}
              subText={`MaxPoint: ${
                partById?.maxPoint
              }, Duration: ${convertSecondToDiffForHumans(
                partById?.limitTime
              )}`}
              className="text-center text-tw-light-pink font-bold"
            />
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <LabelCom htmlFor="maxPoint">Quiz Code</LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="code"
                    register={register}
                    placeholder={MESSAGE_READONLY}
                    defaultValue={fakeName("QUIZ", watch("id"))}
                    readOnly
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom
                    htmlFor="point"
                    subText={`max = ${partById?.maxPoint}, other Quiz = ${
                      totalCurrentQuestionsPoint > 0 ? questionByIdPoint : 0
                    }`}
                    isRequired
                  >
                    Point
                  </LabelCom>
                  <InputCom
                    type="number"
                    control={control}
                    name="point"
                    register={register}
                    placeholder="Edit point"
                    errorMsg={errors.point?.message}
                    value={watch("point")}
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <LabelCom htmlFor="description" isRequired>
                    Quiz
                  </LabelCom>
                  <TextEditorQuillCom
                    value={watch("description")}
                    onChange={(description) => {
                      if (description === "<p><br></p>") {
                        setValue("description", "");
                        setDescription("");
                        setError("description", {
                          type: "required",
                          message: MESSAGE_FIELD_REQUIRED,
                        });
                      } else {
                        setValue("description", description);
                        setError("description", null);
                        setDescription(description);
                      }
                    }}
                    placeholder="Write your quiz ..."
                    errorMsg={errors.description?.message}
                  ></TextEditorQuillCom>
                  <GapYCom></GapYCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
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

export default AdminQuestionListPage;
