import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { axiosBearer } from "../../../api/axiosInstance";
import { SwitchAntCom } from "../../../components/ant";
import BreadcrumbCom from "../../../components/breadcrumb/BreadcrumbCom";
import { ButtonCom } from "../../../components/button";
import GapYCom from "../../../components/common/GapYCom";
import LoadingCom from "../../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import {
  IconDocumentCom,
  IconEditCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TableCom } from "../../../components/table";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_NUMBER_POSITIVE,
  MESSAGE_NUMBER_REQUIRED,
  MESSAGE_UPDATE_STATUS_SUCCESS,
  NOT_FOUND_URL,
} from "../../../constants/config";
import { API_COURSE_URL } from "../../../constants/endpoint";
import useExportExcel from "../../../hooks/useExportExcel";
import { showMessageError, sliceText } from "../../../utils/helper";
import AdminCardCom from "../../../components/common/card/admin/AdminCardCom";

/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  name: yup.string().trim().required(MESSAGE_FIELD_REQUIRED),
  ordered: yup
    .number(MESSAGE_FIELD_REQUIRED)
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, MESSAGE_NUMBER_POSITIVE),
});

const AdminSectionListPage = () => {
  /********* API State ********* */
  const [sections, setSections] = useState([]);
  const [course, setCourse] = useState({});
  /********* END API State ********* */

  /********* State ********* */
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterSection, setFilterSection] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const resetValues = () => {
    reset();
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
  const { courseId } = useParams();

  /********* Export Excel ********* */
  const { handleExcelData } = useExportExcel("section");
  const handleExport = () => {
    const headers = ["No", "Section Name", "Status", "Order"];
    const data = sections.map((section, index) => [
      index + 1,
      section.name,
      section.status === 1 ? "Active" : "Inactive",
      section.ordered,
    ]);
    handleExcelData(headers, data);
  };

  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Section Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      // cell: (row) => (
      //   <SwitchAntCom
      //     defaultChecked={row.status === 1 ? true : false}
      //     className={`${
      //       row.status === 1 ? "" : "bg-tw-danger hover:!bg-tw-orange"
      //     }`}
      //     onChange={(isChecked) =>
      //       handleChangeSwitch(row.id, courseId, isChecked)
      //     }
      //   />
      // ),
      selector: (row) => (
        <>
          {row.status === 1 ? (
            <ButtonCom
              onClick={() => handleChangeStatus(row.id, courseId, true)}
              backgroundColor="success"
              className="px-3 rounded-lg !text-[12px]"
            >
              Active
            </ButtonCom>
          ) : (
            <ButtonCom
              onClick={() => handleChangeStatus(row.id, courseId, false)}
              backgroundColor="danger"
              className="px-3 rounded-lg !text-[12px]"
            >
              InActive
            </ButtonCom>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Lessons",
      cell: (row) => (
        <>
          <Link to={`/admin/courses/${courseId}/sections/${row.id}/lessons`}>
            <ButtonCom
              className="px-3 rounded-lg mr-2"
              backgroundColor="gray"
              onClick={() => {
                // alert(`Update Course id: ${row.id}`);
              }}
            >
              <IconDocumentCom className="w-5 text-black"></IconDocumentCom>
            </ButtonCom>
          </Link>
        </>
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
              handleEdit(row.id);
            }}
          >
            <IconEditCom className="w-5"></IconEditCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDelete({ sectionId: row.id, name: row.name });
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
  const handleDelete = ({ sectionId, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete section: <span class="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosBearer.delete(
            `${API_COURSE_URL}/${courseId}/section?sectionId=${sectionId}`
          );

          getSectionsByCourseId();
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
      } selected ${selectedRows.length > 1 ? "sections" : "section"}</span>`,
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
              `${API_COURSE_URL}/${courseId}/section?sectionId=${row.id}`
            )
          );
          await Promise.all(deletePromises);
          toast.success(
            `Delete [${selectedRows.length}] ${
              selectedRows.length > 1 ? "sections" : "section"
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

  const navigate = useNavigate();
  /********** Fetch data Area ************ */
  /********* API List Section ********* */
  const getSectionsByCourseId = async () => {
    try {
      const res = await axiosBearer.get(
        `${API_COURSE_URL}/${courseId}/section`
      );
      setSections(res.data);
      setFilterSection(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        navigate(NOT_FOUND_URL);
        return false;
      }
      console.log(error);
    }
  };

  /********* Get SectionId from row ********* */
  const getSectionById = async (sectionId) => {
    try {
      const res = await axiosBearer.get(
        `${API_COURSE_URL}/${courseId}/section/${sectionId}`
      );
      reset(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseById = async () => {
    try {
      const res = await axiosBearer.get(`${API_COURSE_URL}/${courseId}`);
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingData = async () => {
    try {
      setIsFetching(true);
      await getSectionsByCourseId();
      await getCourseById();
    } catch (error) {
      // showMessageError(error);
      console.log(error);
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
    const result = sections.filter((section) => {
      const keys = Object.keys(section);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = section[key];
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

    setFilterSection(result);
  }, [sections, search]);

  /********* Edit ********* */
  const handleEdit = async (sectionId) => {
    try {
      setIsFetching(true);
      await getSectionById(sectionId);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  //********* Update Area *********
  // const handleChangeSwitch = async (sectionId, courseId, isChecked) => {
  //   try {
  //     const newSections = sections.map((section) =>
  //       section.id === sectionId
  //         ? {
  //             ...section,
  //             status: isChecked ? 1 : 0,
  //           }
  //         : section
  //     );

  //     const dataBody = newSections.find((section) => section.id === sectionId);
  //     await axiosBearer.put(`${API_COURSE_URL}/${courseId}/section`, dataBody);
  //     toast.success(MESSAGE_UPDATE_STATUS_SUCCESS);
  //     getSectionsByCourseId();
  //   } catch (error) {
  //     showMessageError(error);
  //   }
  // };

  const handleChangeStatus = async (sectionId, courseId, isChecked) => {
    const newSections = sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            status: isChecked ? 0 : 1,
          }
        : section
    );

    const dataBody = newSections.find((section) => section.id === sectionId);
    try {
      await axiosBearer.put(`${API_COURSE_URL}/${courseId}/section`, dataBody);
      toast.success(MESSAGE_UPDATE_STATUS_SUCCESS);
      getSectionsByCourseId();
    } catch (error) {
      showMessageError(error);
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      setIsLoading(!isLoading);
      const res = await axiosBearer.put(
        `${API_COURSE_URL}/${courseId}/section`,
        values
      );
      // Update sections State
      setSections((prev) => {
        const newData = prev.map((item) => {
          if (item.id === values.id) {
            return {
              ...item,
              ...values,
            };
          }
          return item;
        });
        return newData;
      });
      toast.success(`${res.data.message}`);
    } catch (error) {
      showMessageError(error);
    } finally {
      getSectionsByCourseId();
      setIsLoading(false);
      setIsOpen(false);
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

  return (
    <>
      {isFetching && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Section</HeadingH1Com>
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
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-sm-12">
          <AdminCardCom>
            <TableCom
              tableKey={tableKey}
              urlCreate={`/admin/courses/${courseId}/sections/create`}
              title={`Course: ${course.name}`}
              columns={columns}
              items={filterSection}
              search={search}
              dropdownItems={dropdownItems}
              setSearch={setSearch}
              onSelectedRowsChange={handleRowSelection} // selected Mutilple
            ></TableCom>
          </AdminCardCom>
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
          <HeadingFormH5Com className="text-2xl">Edit Section</HeadingFormH5Com>
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
              placeholder="Section hidden id"
              // errorMsg={errors.id?.message}
            ></InputCom>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <LabelCom htmlFor="name" isRequired>
                    Section Name
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="name"
                    register={register}
                    placeholder="Input session name"
                    errorMsg={errors.name?.message}
                    defaultValue={watch("name")}
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom htmlFor="ordered" isRequired>
                    Ordered
                  </LabelCom>
                  <InputCom
                    type="number"
                    control={control}
                    name="ordered"
                    register={register}
                    placeholder="Input section ordered"
                    errorMsg={errors.ordered?.message}
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

export default AdminSectionListPage;
