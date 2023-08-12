import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import * as yup from "yup";
import { axiosBearer } from "../../../../api/axiosInstance";
import { ImageCropUploadAntCom } from "../../../../components/ant";
import { BreadcrumbCom } from "../../../../components/breadcrumb";
import { ButtonCom } from "../../../../components/button";
import AdminCardCom from "../../../../components/common/card/admin/AdminCardCom";
import GapYCom from "../../../../components/common/GapYCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../../components/heading";
import {
  IconEditCom,
  IconEyeCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../../components/icon";
import { InputCom } from "../../../../components/input";
import { LabelCom } from "../../../../components/label";
import { TableCom } from "../../../../components/table";
import { TextAreaCom } from "../../../../components/textarea";
import {
  AVATAR_DEFAULT,
  MAX_LENGTH_NAME,
  MESSAGE_FIELD_MAX_LENGTH_NAME,
  MESSAGE_FIELD_MIN_LENGTH_NAME,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_UPLOAD_REQUIRED,
  MIN_LENGTH_NAME,
} from "../../../../constants/config";
import { API_AUTHOR_URL } from "../../../../constants/endpoint";
import useExportExcel from "../../../../hooks/useExportExcel";
import { onGetAuthors } from "../../../../store/author/authorSlice";
import { showMessageError, sliceText } from "../../../../utils/helper";

const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  title: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  information: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME),
  image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
});

const AdminAuthorListPage = () => {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [authors, setAuthors] = useState([]);
  const [filterAuthor, setFilterAuthor] = useState([]);
  const [search, setSearch] = useState("");
  const [image, setImage] = useState([]);

  const { handleExcelData } = useExportExcel("author");
  const handleExport = () => {
    const headers = ["No", "Author Name", "Title", "Information", "Avatar"];
    const data = authors.map((item, index) => [
      index + 1,
      item.name,
      item.title,
      item.information,
      item.image,
    ]);
    handleExcelData(headers, data);
  };

  // More Action Menu
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
  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Image",
      selector: (row) => (
        <img
          width={50}
          height={50}
          src={`${row.image === null ? AVATAR_DEFAULT : row.image}`}
          alt={row.name}
        />
      ),
      width: "80px",
    },
    {
      name: "Author Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Title",
      selector: (row) => sliceText(row.title, 50),
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
            className="px-3 rounded-lg mr-2"
            onClick={() => {
              window.open(`/authors/${row.id}`, "_blank");
            }}
          >
            <IconEyeCom className="w-5"></IconEyeCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDelete(row.id, row.name);
            }}
          >
            <IconTrashCom className="w-5"></IconTrashCom>
          </ButtonCom>
        </>
      ),
    },
  ];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const resetValues = () => {
    reset();
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

  /********* Fetch API Area ********* */
  const getAuthors = async () => {
    try {
      const res = await axiosBearer.get(API_AUTHOR_URL);
      setAuthors(res.data);
      setFilterAuthor(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAuthorById = async (authorId) => {
    try {
      const res = await axiosBearer.get(`${API_AUTHOR_URL}/${authorId}`);
      reset(res.data);

      const resImage = res.data.image;
      const imgObj = [
        {
          uid: v4(),
          name: resImage?.substring(resImage.lastIndexOf("/") + 1),
          status: "done",
          url: resImage,
        },
      ];

      setImage(imgObj);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(onGetAuthors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authors]);

  useEffect(() => {
    getAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search in Table
  useEffect(() => {
    const result = authors.filter((course) => {
      const keys = Object.keys(course);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = course[key];
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
    setFilterAuthor(result);
  }, [authors, search]);

  // Delete one
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete author: <span className="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosBearer.delete(
            `${API_AUTHOR_URL}?authorId=${id}`
          );
          getAuthors();
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
      } selected ${selectedRows.length > 1 ? "authors" : "author"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = selectedRows.map((row) =>
            axiosBearer.delete(`${API_AUTHOR_URL}?authorId=${row.id}`)
          );
          await Promise.all(deletePromises);
          toast.success(
            `Delete [${selectedRows.length}] ${
              selectedRows.length > 1 ? "authors" : "author"
            } success`
          );
        } catch (error) {
          showMessageError(error);
        } finally {
          getAuthors();
          clearSelectedRows();
        }
      }
    });
  };

  //********* Update Area *********
  const handleEdit = async (authorId) => {
    try {
      setIsFetching(true);
      await getAuthorById(authorId);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      setIsLoading(!isLoading);
      const res = await axiosBearer.post(`${API_AUTHOR_URL}`, values);
      // Update sections State
      setAuthors((prev) => {
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
      getAuthors();
      toast.success(`${res.data.message}`);
    } catch (error) {
      showMessageError(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Author</HeadingH1Com>
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
              title: "Author",
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
                urlCreate={`/admin/courses/authors/create`}
                title="List Author"
                columns={columns}
                items={filterAuthor}
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
              placeholder="Author hidden id"
            ></InputCom>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <LabelCom htmlFor="name" isRequired>
                    Author Name
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="name"
                    register={register}
                    placeholder="Input author name"
                    errorMsg={errors.name?.message}
                    defaultValue={watch("name")}
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom htmlFor="title" isRequired>
                    Title
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="title"
                    register={register}
                    placeholder="Input author title"
                    errorMsg={errors.title?.message}
                    defaultValue={watch("title")}
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <LabelCom htmlFor="image" isRequired>
                    Avatar
                  </LabelCom>
                  <div className="w-full">
                    <ImageCropUploadAntCom
                      name="image"
                      onSetValue={setValue}
                      errorMsg={errors.image?.message}
                      editImage={image}
                      aspect={4 / 4}
                      isWidthFull
                    ></ImageCropUploadAntCom>
                    <InputCom
                      type="hidden"
                      control={control}
                      name="image"
                      register={register}
                    ></InputCom>
                  </div>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>

              <div className="row">
                <div className="col-sm-12">
                  <LabelCom htmlFor="information">Information</LabelCom>
                  <TextAreaCom
                    name="information"
                    control={control}
                    register={register}
                    value={watch("information")}
                    placeholder="Write the information of author..."
                  />
                </div>
              </div>
            </div>
            <div className="card-footer flex justify-end gap-x-5">
              <ButtonCom type="submit" isLoading={isLoading} className="w-full">
                Update
              </ButtonCom>
            </div>
          </form>
        </div>
      </ReactModal>
    </>
  );
};

export default AdminAuthorListPage;
