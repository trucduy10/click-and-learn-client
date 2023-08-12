import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ImageCropUploadAntCom,
  SelectDefaultAntCom,
  SelectSearchAntCom,
  SwitchAntCom,
} from "../../../components/ant";
import { axiosBearer } from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  AVATAR_DEFAULT,
  MAX_LENGTH_NAME,
  MESSAGE_FIELD_MAX_LENGTH_NAME,
  MESSAGE_FIELD_MIN_LENGTH_NAME,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_UPDATE_STATUS_SUCCESS,
  MESSAGE_UPLOAD_REQUIRED,
  MIN_LENGTH_NAME,
  categoryItems,
  statusBlogItems,
  MESSAGE_ITEM_NOT_FOUND,
} from "../../../constants/config";
import { showMessageError, sliceText } from "../../../utils/helper";
import LoadingCom from "../../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import ButtonBackCom from "../../../components/button/ButtonBackCom";
import GapYCom from "../../../components/common/GapYCom";
import { TableCom } from "../../../components/table";
import { blog } from "../../../assets/blog_data/data";
import ButtonCom from "../../../components/button/ButtonCom";
import {
  IconEditCom,
  IconEyeCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../../components/icon";
import { Link } from "@mui/material";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TextEditorQuillCom } from "../../../components/texteditor";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { mainColor } from "../../../constants/mainTheme";
import {
  onBulkDeleteBlog,
  onDeleteBlog,
  onGetBlogsForAdmin,
  onPostBlog,
} from "../../../store/admin/blog/blogSlice";
import useExportExcel from "../../../hooks/useExportExcel";
const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  status: yup.number().default(2),
  image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
  category_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
});

const AdminBlogListPage = () => {
  const dispatch = useDispatch();
  const {
    adminBlogs: blogs,
    isPostBlogSuccess,
    isBulkDeleteSuccess,
  } = useSelector((state) => state.adminBlog);
  /********* State ********* */
  //API State
  const [image, setImage] = useState([]);
  const [categorySelected, setCategorySelected] = useState(null);
  const [statusSelected, setStatusSelected] = useState(null);

  // Local State
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  // const [blogs, setBlogs] = useState([]);
  const [filterBlog, setFilterBlog] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => state.auth);
  /********* END API State ********* */

  const { handleExcelData } = useExportExcel("blog");
  const handleExport = () => {
    const headers = ["No", "Title", "Category", "Image", "Status", "Content"];
    const data = blogs.map((item, index) => [
      index + 1,
      item.name,
      item.category_name,
      item.image,
      item.status === 1
        ? "Published"
        : item.status === 0
        ? "UnPublished"
        : "Proccessing",
      item.description,
    ]);
    handleExcelData(headers, data);
  };

  /********* More Action Menu ********* */
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
          Bulk delete
        </div>
      ),
    },
  ];

  //manage status and event in form
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

  /********* Fetch API Area ********* */
  const columns = [
    {
      name: "No",
      selector: (row, i) => ++i,
      width: "70px",
    },
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
      width: "250px",
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <img
          width={50}
          height={50}
          src={`${row.image || AVATAR_DEFAULT}`}
          alt={row.name}
        />
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <SelectDefaultAntCom
          control={control}
          name="status"
          defaultValue={row.status}
          options={statusBlogItems}
          className={`${
            row.status === 1
              ? "blog-dropdown-success"
              : row.status === 2
              ? "blog-dropdown-warning"
              : "blog-dropdown-dark"
          } rounded-full`}
          onChange={(selectedStatus) =>
            handleChangeStatus(row.slug, selectedStatus)
          }
        />
      ),
    },
    {
      name: "Created By",
      selector: (row) => sliceText(row?.createdBy ?? "N/A", 12),
      sortable: true,
    },
    {
      name: "Updated By",
      selector: (row) => sliceText(row?.updatedBy ?? "N/A", 12),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <ButtonCom
            className="px-3 rounded-lg mr-2"
            backgroundColor="info"
            onClick={() => {
              handleEdit(row.slug);
            }}
          >
            <IconEditCom className="w-5"></IconEditCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg mr-2"
            onClick={() => {
              window.open(`/blogs/${row.slug}`, "_blank");
            }}
          >
            <IconEyeCom className="w-5"></IconEyeCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDelete(row);
            }}
          >
            <IconTrashCom className="w-5"></IconTrashCom>
          </ButtonCom>
        </>
      ),
    },
  ];

  /********* Call API ********* */
  //Get All Blog
  useEffect(() => {
    dispatch(onGetBlogsForAdmin());
    if (isPostBlogSuccess && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostBlogSuccess]);

  useEffect(() => {
    if (isBulkDeleteSuccess) clearSelectedRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBulkDeleteSuccess]);

  const handleChangeCategory = (value) => {
    setValue("category_id", value);
    setError("category_id", { message: "" });
    setCategorySelected(value);
  };

  const clearSelectedRows = () => {
    setSelectedRows([]);
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleRowSelection = (currentRowsSelected) => {
    setSelectedRows(currentRowsSelected.selectedRows);
  };

  /********* Search ********* */
  useEffect(() => {
    console.log("blogs:", blogs);
    const result = blogs.filter((blog) => {
      const keys = Object.keys(blog);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = blog[key];
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
    setFilterBlog(result);
  }, [blogs, search]);

  /********* Delete one API ********* */
  const handleDelete = ({ id, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete blog: <span class="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onDeleteBlog(id));
      }
    });
  };

  /********* Multi Delete API ********* */
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.warning(MESSAGE_NO_ITEM_SELECTED);
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete <span class="text-tw-danger">${
        selectedRows.length
      } selected ${selectedRows.length > 1 ? "blogs" : "blog"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onBulkDeleteBlog(selectedRows));
      }
    });
  };
  /********* Update Status API ********* */

  const handleChangeStatus = (slug, selectedStatus) => {
    const blogBySlug = getBlogBySlug(slug);
    if (!blogBySlug) toast.error(MESSAGE_ITEM_NOT_FOUND);

    dispatch(
      onPostBlog({
        ...blogBySlug,
        status: selectedStatus,
      })
    );
  };

  /********* Update API ********* */
  const getBlogBySlug = (slug, action = "n/a") => {
    setIsFetching(true);
    const item = blogs.find((item) => item.slug === slug);
    switch (action) {
      case "fetch":
        typeof item !== "undefined" ? reset(item) : showMessageError("No data");
        setCategorySelected(item?.category_id);
        setStatusSelected(item?.status);
        const imageUrl = item?.image;
        const imgObj = [
          {
            uid: v4(),
            name: imageUrl?.substring(imageUrl.lastIndexOf("/") + 1),
            status: "done",
            url: imageUrl,
          },
        ];
        setImage(imgObj);
        break;
      default:
        break;
    }
    setIsFetching(false);

    return typeof item !== "undefined" ? item : showMessageError("No data");
  };

  const handleEdit = async (slug) => {
    setIsOpen(true);
    getBlogBySlug(slug, "fetch");
  };

  const handleSubmitForm = (values) => {
    dispatch(
      onPostBlog({
        ...values,
        status: values.status || 2,
      })
    );
  };
  return (
    <>
      {(isLoading || isFetching) && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Blogs</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "Blog",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header py-3">
              <span>
                <TableCom
                  urlCreate="/admin/blogs/create"
                  tableKey={tableKey}
                  title="List Blogs"
                  columns={columns}
                  items={filterBlog}
                  search={search}
                  setSearch={setSearch}
                  dropdownItems={dropdownItems}
                  onSelectedRowsChange={handleRowSelection} // selected Mutilple
                ></TableCom>
              </span>
            </div>
            <div className="card-body flex gap-x-4 h-[50vh]"></div>
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
          <HeadingFormH5Com className="text-2xl">Edit Blog</HeadingFormH5Com>
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
              placeholder="Blog hidden id"
              errorMsg={errors.id?.message}
            ></InputCom>

            <div className="card-body">
              <div className="row">
                <div className="col-sm-8">
                  <LabelCom htmlFor="name" isRequired>
                    Title
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="name"
                    register={register}
                    placeholder="Input Title"
                    errorMsg={errors.name?.message}
                    defaultValue={watch("name")}
                  ></InputCom>
                </div>
                <div className="col-sm-2 relative">
                  <LabelCom htmlFor="image" isRequired>
                    Image
                  </LabelCom>
                  <div className="absolute w-full">
                    <ImageCropUploadAntCom
                      name="image"
                      onSetValue={setValue}
                      errorMsg={errors.image?.message}
                      editImage={image}
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
              <GapYCom className="mb-20"></GapYCom>
              <div className="row">
                <div className="col-sm-4">
                  <LabelCom htmlFor="category_id" isRequired>
                    Choose Category
                  </LabelCom>
                  <div>
                    <SelectSearchAntCom
                      selectedValue={categorySelected}
                      listItems={categoryItems}
                      onChange={handleChangeCategory}
                      className="w-full py-1"
                      status={
                        errors.category_id &&
                        errors.category_id.message &&
                        "error"
                      }
                      errorMsg={errors.category_id?.message}
                      placeholder="Input category to search"
                    ></SelectSearchAntCom>
                    <InputCom
                      type="hidden"
                      control={control}
                      name="category_id"
                      register={register}
                    ></InputCom>
                  </div>
                </div>
              </div>
              <GapYCom className="mb-35 bt-10"></GapYCom>
              <div className="row">
                <div className="col-sm-12">
                  <LabelCom htmlFor="description" isRequired>
                    Description
                  </LabelCom>
                  <TextEditorQuillCom
                    value={watch("description")}
                    onChange={(description) => {
                      setValue("description", description);
                    }}
                    placeholder="Write your blog..."
                  />
                </div>
                <div className="mt-10 " style={{ color: "red" }}>
                  {errors.description?.message}
                </div>
              </div>
              <GapYCom></GapYCom>
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

export default AdminBlogListPage;
