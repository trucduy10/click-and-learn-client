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
import GapYCom from "../../../components/common/GapYCom";
import LoadingCom from "../../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import {
  IconEditCom,
  IconQuestionCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TableCom } from "../../../components/table";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_GENERAL_FAILED,
  MESSAGE_MAINTENANCE,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_NUMBER_REQUIRED,
  MESSAGE_READONLY,
  NOT_FOUND_URL,
} from "../../../constants/config";
import {
  onBulkDeletePart,
  onDeletePart,
  onGetPartsByCourseId,
  onPostPart,
} from "../../../store/admin/part/partSlice";
import {
  convertSecondToDiffForHumans,
  fakeName,
  showMessageError,
  sliceText,
} from "../../../utils/helper";

const schemaValidation = yup.object().shape({
  maxPoint: yup
    .number(MESSAGE_FIELD_REQUIRED)
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, "This field must be greater than 0"),
  limitTime: yup
    .number(MESSAGE_FIELD_REQUIRED)
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(600, "This field must be greater than 600"),
});

const AdminPartListPage = () => {
  /********* State ********* */
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterItem, setFilterItem] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data } = useSelector((state) => state.course);
  const courseById = data?.find((item) => item.id === parseInt(courseId));
  if (!courseById) navigate(NOT_FOUND_URL);

  const { parts, isLoading, isBulkDeleteSuccess, isPostPartSuccess } =
    useSelector((state) => state.part);
  // Fetch Data
  useEffect(() => {
    dispatch(onGetPartsByCourseId({ courseId }));
    if (isPostPartSuccess && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostPartSuccess]);

  // Search in Table if using Redux
  useEffect(() => {
    if (search) {
      if (!parts) return;
      const result = parts.filter((item) => {
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
      if (parts) setFilterItem(parts);
    }
  }, [parts, search]);

  useEffect(() => {
    if (isBulkDeleteSuccess) clearSelectedRows();
  }, [isBulkDeleteSuccess]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  /********* Export Excel ********* */
  //   const { handleExcelData } = useExportExcel("part");
  //   const handleExport = () => {
  //     const headers = ["No", "Section Name", "Status", "Order"];
  //     const data = sections.map((section, index) => [
  //       index + 1,
  //       section.name,
  //       section.status === 1 ? "Active" : "Inactive",
  //       section.ordered,
  //     ]);
  //     handleExcelData(headers, data);
  //   };

  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Part Code",
      selector: (row) => fakeName("PART", row.id),
      sortable: true,
    },
    {
      name: "Max Point",
      selector: (row) => row.maxPoint,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <>
          {row.status === 1 ? (
            <ButtonCom
              onClick={() => handleChangeStatus(row)}
              backgroundColor="success"
            >
              Active
            </ButtonCom>
          ) : (
            <ButtonCom
              onClick={() => handleChangeStatus(row)}
              backgroundColor="danger"
            >
              InActive
            </ButtonCom>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Question",
      cell: (row) => (
        <>
          <Link to={`/admin/courses/${courseId}/parts/${row.id}/questions`}>
            <ButtonCom className="px-3 rounded-lg mr-2" backgroundColor="gray">
              <IconQuestionCom className="text-tw-danger" />
            </ButtonCom>
          </Link>
        </>
      ),
    },
    {
      name: "Limit Time",
      selector: (row) => convertSecondToDiffForHumans(row.limitTime),
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
              handleDelete({ partId: row.id, name: fakeName("PART", row.id) });
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
  const handleDelete = ({ partId, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete part: <span class="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          onDeletePart({
            courseId: parseInt(courseId),
            partId,
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
      } selected ${selectedRows.length > 1 ? "parts" : "part"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onBulkDeletePart(selectedRows));
      }
    });
  };

  ///********* Update Area *********
  const getPartById = (partId, action = "n/a") => {
    setIsFetching(true);
    const part = parts.find((item) => item.id === partId);
    switch (action) {
      case "fetch":
        typeof part !== "undefined" ? reset(part) : showMessageError("No data");
        break;
      default:
        break;
    }
    setIsFetching(false);
    return typeof part !== "undefined" ? part : showMessageError("No data");
  };

  const handleEdit = (partId) => {
    setIsOpen(true);
    getPartById(partId, "fetch");
  };

  const handleSubmitForm = (values) => {
    const part = getPartById(values.id);
    if (part.maxPoint !== values.maxPoint) {
      Swal.fire({
        title: `The <span class="text-tw-danger">Max Point</span> are being reduced!`,
        html: `If you change the max point of this Part, the point of all quizzes in <span class="text-tw-danger">${fakeName(
          "PART",
          part?.id
        )}</span> will be reset to 0`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7366ff",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, please continue",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(
            onPostPart({
              ...values,
              courseId: parseInt(courseId),
            })
          );
        }
      });
    } else {
      dispatch(
        onPostPart({
          ...values,
          courseId: parseInt(courseId),
        })
      );
    }
  };

  const handleChangeStatus = (part) => {
    dispatch(
      onPostPart({
        ...part,
        status: part.status === 1 ? 0 : 1,
        courseId: parseInt(courseId),
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
        <HeadingH1Com>Admin Part</HeadingH1Com>
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
                urlCreate={`/admin/courses/${courseId}/parts/create`}
                title={`Course: ${sliceText(courseById?.name, 30)}`}
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
          <HeadingFormH5Com className="text-2xl">Edit Part</HeadingFormH5Com>
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
              placeholder="Part hidden id"
              errorMsg={errors.id?.message}
            ></InputCom>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 offset-3 text-center">
                  <LabelCom htmlFor="maxPoint">Part Code</LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="code"
                    register={register}
                    placeholder={MESSAGE_READONLY}
                    defaultValue={fakeName("PART", watch("id"))}
                    readOnly
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-6">
                  <LabelCom htmlFor="maxPoint" isRequired>
                    Max Point
                  </LabelCom>
                  <InputCom
                    type="number"
                    control={control}
                    name="maxPoint"
                    register={register}
                    placeholder="Input max point"
                    errorMsg={errors.maxPoint?.message}
                    value={watch("maxPoint")}
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom htmlFor="limitTime" subText="(second)" isRequired>
                    Limit Time
                  </LabelCom>
                  <InputCom
                    type="number"
                    control={control}
                    name="limitTime"
                    register={register}
                    placeholder="Input limit time"
                    errorMsg={errors.limitTime?.message}
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

export default AdminPartListPage;
