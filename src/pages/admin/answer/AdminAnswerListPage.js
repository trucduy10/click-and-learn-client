import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as yup from "yup";
import { CheckBoxAntCom } from "../../../components/ant";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import AdminCardCom from "../../../components/common/card/admin/AdminCardCom";
import CardHeaderCom from "../../../components/common/card/CardHeaderCom";
import GapYCom from "../../../components/common/GapYCom";
import LoadingCom from "../../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import {
  IconCheckCom,
  IconEditCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TableCom } from "../../../components/table";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_MAINTENANCE,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_READONLY,
  NOT_FOUND_URL,
} from "../../../constants/config";
import useOnChangeCheckBox from "../../../hooks/useOnChangeCheckBox";
import {
  onBulkDeleteAnswer,
  onDeleteAnswer,
  onGetAnswersByQuestionId,
  onPostAnswer,
} from "../../../store/admin/answer/answerSlice";
import { fakeName, showMessageError, sliceText } from "../../../utils/helper";

const schemaValidation = yup.object().shape({
  description: yup.string().required(MESSAGE_FIELD_REQUIRED),
});

const AdminAnswerListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId, partId, questionId } = useParams();
  const { data } = useSelector((state) => state.course);
  const { parts } = useSelector((state) => state.part);
  const { questions } = useSelector((state) => state.question);
  const courseById = data?.find((item) => item.id === parseInt(courseId));
  const partById = parts?.find((item) => item.id === parseInt(partId));
  const questionById = questions?.find(
    (item) => item.id === parseInt(questionId)
  );
  if (!courseById || !partById || !questionById) navigate(NOT_FOUND_URL);

  const { answers, isLoading, isBulkDeleteSuccess, isPostAnswerSuccess } =
    useSelector((state) => state.answer);

  /********* State ********* */
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterItem, setFilterItem] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [description, setDescription] = useState("");

  const [isFetching, setIsFetching] = useState(false);

  // Fetch Data
  useEffect(() => {
    dispatch(onGetAnswersByQuestionId({ questionId }));
    if (isPostAnswerSuccess && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostAnswerSuccess]);

  // Search in Table if using Redux
  useEffect(() => {
    if (search) {
      if (!answers) return;

      const result = answers.filter((item) => {
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
      // Default, setPart for search
      if (answers) setFilterItem(answers);
    }
  }, [answers, search]);

  useEffect(() => {
    if (isBulkDeleteSuccess) clearSelectedRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBulkDeleteSuccess]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const [, handleChangeCorrect] = useOnChangeCheckBox(setValue, "correct");

  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Answer code",
      selector: (row) => fakeName("ANSWER", row.id),
      sortable: true,
    },
    {
      name: "Answer",
      selector: (row) => sliceText(row.description),
      sortable: true,
    },
    {
      name: "Correct",
      selector: (row) =>
        row.correct ? (
          <IconCheckCom className="text-tw-success" />
        ) : (
          <IconRemoveCom className="text-tw-danger" />
        ),
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
                answerId: row.id,
                name: fakeName("ANSWER", row.id),
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
  const handleDelete = ({ answerId, name }) => {
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
          onDeleteAnswer({
            questionId: parseInt(questionId),
            answerId,
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
        dispatch(onBulkDeleteAnswer(selectedRows));
      }
    });
  };

  ///********* Update Area *********
  const getAnswerById = (answerId, action = "n/a") => {
    setIsFetching(true);
    const item = answers.find((item) => item.id === answerId);
    switch (action) {
      case "fetch":
        typeof item !== "undefined" ? reset(item) : showMessageError("No data");
        setValue("correct", item?.correct ?? false);
        break;
      default:
        break;
    }
    setIsFetching(false);

    return typeof item !== "undefined" ? item : showMessageError("No data");
  };

  const handleEdit = (answerId) => {
    setIsOpen(true);
    getAnswerById(answerId, "fetch");
  };

  const handleSubmitForm = (values) => {
    dispatch(
      onPostAnswer({
        ...values,
        questionId: parseInt(questionId),
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

  return (
    <>
      {(isLoading || isFetching) && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Answer</HeadingH1Com>
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
              slug: `/admin/courses/${courseId}/parts/${partId}/questions`,
            },
            {
              title: "Answer",
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
                urlCreate={`/admin/courses/${courseId}/parts/${partId}/questions/${questionId}/answers/create`}
                classNameBtnCreate={`${answers?.length >= 4 && "hidden"}`}
                title={`${sliceText(courseById?.name, 30)}, ${fakeName(
                  "PART",
                  partId
                )}, ${fakeName("QUIZ", questionId)}`}
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
          <HeadingFormH5Com className="text-2xl">Edit Answer</HeadingFormH5Com>
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
              placeholder="ANSWER hidden id"
              errorMsg={errors.id?.message}
            ></InputCom>
            <CardHeaderCom
              title={fakeName("QUIZ", questionId)}
              subText={sliceText(questionById?.description, 200)}
              className="text-center text-tw-light-pink font-bold"
            />
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <LabelCom htmlFor="maxPoint">Answer Code</LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="code"
                    register={register}
                    placeholder={MESSAGE_READONLY}
                    defaultValue={fakeName("ANSWER", watch("id"))}
                    readOnly
                  ></InputCom>
                </div>
                <div className="col-sm-9">
                  <div className="flex items-center justify-between">
                    <LabelCom htmlFor="description" isRequired>
                      Answer
                    </LabelCom>
                    <CheckBoxAntCom
                      onChange={handleChangeCorrect}
                      isChecked={watch("correct")}
                    >
                      Correct
                    </CheckBoxAntCom>
                  </div>
                  <InputCom
                    type="text"
                    control={control}
                    name="description"
                    register={register}
                    placeholder="Input answer"
                    errorMsg={errors.description?.message}
                  ></InputCom>
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

export default AdminAnswerListPage;
