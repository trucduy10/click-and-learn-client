import React, { useEffect, useState } from "react";
import * as yup from "yup";
import {
  categoryItems,
  MAX_LENGTH_NAME,
  MESSAGE_FIELD_MAX_LENGTH_NAME,
  MESSAGE_FIELD_MIN_LENGTH_NAME,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_UPLOAD_REQUIRED,
  MIN_LENGTH_NAME,
} from "../../constants/config";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import { axiosBearer } from "../../api/axiosInstance";
import {
  ImageCropUploadAntCom,
  SelectSearchAntCom,
} from "../../components/ant";
import { BreadcrumbCom } from "../../components/breadcrumb";
import { ButtonCom } from "../../components/button";
import GapYCom from "../../components/common/GapYCom";
import LoadingCom from "../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../components/heading";
import {
  IconEditCom,
  IconEyeCom,
  IconRemoveCom,
  IconTrashCom,
} from "../../components/icon";
import { InputCom } from "../../components/input";
import { LabelCom } from "../../components/label";
import { TableCom } from "../../components/table";
import { TextEditorQuillCom } from "../../components/texteditor";
import {
  onBulkDeleteMyBlog,
  onDeleteBlog,
  onDeleteMyBlog,
  onGetMyBlogs,
  onPostBlog,
} from "../../store/admin/blog/blogSlice";
import { showMessageError } from "../../utils/helper";
import useExportExcel from "../../hooks/useExportExcel";

/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
  category_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
  description: yup.string().required(MESSAGE_FIELD_REQUIRED),
});

const BlogListPage = () => {
  const dispatch = useDispatch();
  const {
    myBlogs: blogs,
    isPostBlogSuccess,
    isBulkDeleteMyBlogSuccess,
  } = useSelector((state) => state.adminBlog);
  /********* State ********* */
  //API State
  const [image, setImage] = useState([]);
  const [categorySelected, setCategorySelected] = useState(null);

  // Local State
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [filterBlog, setFilterBlog] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => state.auth);
  /********* END API State ********* */
  const { handleExcelData } = useExportExcel(
    `blog_${user?.first_name.toLowerCase()}`
  );
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
      name: "Status",
      selector: (row) => (
        <div
          className={`text-white px-3 py-2 ${
            row.status === 1
              ? "bg-tw-success"
              : row.status === 2
              ? "bg-tw-warning"
              : "bg-tw-dark"
          }`}
        >
          {row.status === 1
            ? "Published"
            : row.status === 2
            ? "Proccessing"
            : "UnPublished"}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <img width={50} height={50} src={`${row.image}`} alt={row.name} />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status === 2 && (
            <ButtonCom
              className="px-3 rounded-lg mr-2"
              backgroundColor="info"
              onClick={() => {
                handleEdit(row.slug);
              }}
            >
              <IconEditCom className="w-5"></IconEditCom>
            </ButtonCom>
          )}
          {row.status !== 0 && (
            <ButtonCom
              className="px-3 rounded-lg mr-2"
              onClick={() => {
                window.open(`/blogs/${row.slug}`);
              }}
            >
              <IconEyeCom className="w-5"></IconEyeCom>
            </ButtonCom>
          )}
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

  /********* API List Blog ********* */

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

  useEffect(() => {
    dispatch(onGetMyBlogs(user?.id));
    if (isPostBlogSuccess && isOpen) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isPostBlogSuccess]);

  useEffect(() => {
    if (isBulkDeleteMyBlogSuccess) clearSelectedRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBulkDeleteMyBlogSuccess]);

  /********* Search ********* */
  useEffect(() => {
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
        dispatch(
          onDeleteMyBlog({
            id,
            user_id: user?.id,
          })
        );
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
        dispatch(
          onBulkDeleteMyBlog({
            data: selectedRows,
            user_id: user?.id,
          })
        );
      }
    });
  };
  /********* Update API ********* */
  const handleEdit = async (slug) => {
    setIsOpen(true);
    getBlogBySlug(slug, "fetch");
  };

  const getBlogBySlug = (slug, action = "n/a") => {
    setIsFetching(true);
    const item = blogs.find((item) => item.slug === slug);
    switch (action) {
      case "fetch":
        typeof item !== "undefined" ? reset(item) : showMessageError("No data");
        setCategorySelected(item?.category_id);
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

  const handleSubmitForm = async (values) => {
    console.log("values: ", values);
    dispatch(
      onPostBlog({
        ...values,
        status: values.status || 2,
      })
    );
  };

  return (
    <>
      {isFetching && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Management Blogs</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Blog",
              slug: "/blogs",
            },
            {
              title: "Management",
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
                  tableKey={tableKey}
                  urlCreate="/blogs/create"
                  title="Your blogs"
                  columns={columns}
                  items={filterBlog}
                  search={search}
                  setSearch={setSearch}
                  dropdownItems={dropdownItems}
                  onSelectedRowsChange={handleRowSelection} // selected Mutilple
                ></TableCom>
              </span>
            </div>
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
export default BlogListPage;
