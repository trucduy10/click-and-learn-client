import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import * as yup from "yup";
import { axiosBearer } from "../../../api/axiosInstance";
import {
  ImageCropUploadAntCom,
  SelectDefaultAntCom,
  SelectSearchAntCom,
  SelectTagAntCom,
} from "../../../components/ant";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import AdminCardCom from "../../../components/common/card/admin/AdminCardCom";
import GapYCom from "../../../components/common/GapYCom";
import LoadingCom from "../../../components/common/LoadingCom";
import { HeadingFormH5Com, HeadingH1Com } from "../../../components/heading";
import {
  IconBookCom,
  IconEditCom,
  IconEyeCom,
  IconPartCom,
  IconRemoveCom,
  IconTrashCom,
  IconVideoCom,
} from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TableCom } from "../../../components/table";
import { TextEditorQuillCom } from "../../../components/texteditor";
import {
  categoryItems,
  levelItems,
  MAX_LENGTH_NAME,
  MESSAGE_FIELD_INVALID,
  MESSAGE_FIELD_MAX_LENGTH_NAME,
  MESSAGE_FIELD_MIN_LENGTH_NAME,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_GENERAL_FAILED,
  MESSAGE_NET_PRICE_HIGHER_PRICE,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_NUMBER_POSITIVE,
  MESSAGE_NUMBER_REQUIRED,
  MESSAGE_UPDATE_STATUS_SUCCESS,
  MESSAGE_UPLOAD_REQUIRED,
  MIN_LENGTH_NAME,
} from "../../../constants/config";
import {
  API_AUTHOR_URL,
  API_COURSE_URL,
  API_TAG_URL,
} from "../../../constants/endpoint";
import { ALLOWED_ADMIN_MANAGER } from "../../../constants/permissions";
import useExportExcel from "../../../hooks/useExportExcel";
import useOnChange from "../../../hooks/useOnChange";
import { onCourseLoading } from "../../../store/course/courseSlice";
import {
  convertIntToStrMoney,
  convertSecondToDiffForHumans,
  convertStrMoneyToInt,
  showMessageError,
  sliceText,
} from "../../../utils/helper";
import { helperChangeStatusCourse } from "../../../utils/helperCourse";

const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  status: yup.number().default(1),
  level: yup.number().default(0),
  image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
  category_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
  author_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
  tags: yup.string().required(MESSAGE_FIELD_REQUIRED),
  price: yup
    .string()
    .nullable()
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, MESSAGE_NUMBER_POSITIVE),
  net_price: yup
    .string()
    .nullable()
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, MESSAGE_NUMBER_POSITIVE),
});

const AdminCourseListPage = () => {
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

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  /********* API State ********* */
  const [tagItems, setTagItems] = useState([]);
  const [authorItems, setAuthorItems] = useState([]);
  const [image, setImage] = useState([]);

  const [categorySelected, setCategorySelected] = useState(null);
  const [authorSelected, setAuthorSelected] = useState(null);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [achievementSelected, setAchievementSelected] = useState([]);
  /********* END API State ********* */

  // Local State
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [search, setSearch] = useState("");

  // Edit State
  const [price, handleChangePrice, setPrice] = useOnChange(0);
  const [net_price, handleChangeNetPrice, setNetPrice] = useOnChange(0);

  /********* Export Excel ********* */
  const { handleExcelData } = useExportExcel("course");
  const handleExport = () => {
    const headers = [
      "No",
      "Course Name",
      "Category",
      "Level",
      "Image",
      "Status",
      "Price",
      "Duration",
      "Author Name",
      "Tags",
      "Achievement",
      "Total Enrolled",
      "Rating",
    ];
    const data = courses.map((item, index) => [
      index + 1,
      item.name,
      item.category_name,
      item.level === 0 ? "Basic" : "Advance",
      item.image,
      item.status === 1 ? "Active" : "Inactive",
      item.price === 0
        ? "Free"
        : item.net_price > 0
        ? item.net_price
        : item.price,
      convertSecondToDiffForHumans(item.duration),
      item.author_name,
      item.tags,
      item.achievements?.trim(),
      item.enrollmentCount,
      item.rating,
    ]);
    handleExcelData(headers, data);
  };

  /********* Fetch API Area ********* */
  const columns = [
    // {
    //   name: "No",
    //   selector: (row, i) => ++i,
    //   width: "60px",
    // },
    {
      name: "Image",
      selector: (row) => (
        <img width={50} height={50} src={`${row.image}`} alt={row.name} />
      ),
      width: "80px",
    },
    {
      name: "Course Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   cell: (row) => (
    //     <>
    //       {row.status === 1 ? (
    //         <ButtonCom onClick={() => {}} backgroundColor="success">
    //           Active
    //         </ButtonCom>
    //       ) : (
    //         <ButtonCom onClick={() => {}} backgroundColor="danger">
    //           InActive
    //         </ButtonCom>
    //       )}
    //     </>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) => (
        // <SwitchAntCom
        //   defaultChecked={row.status === 1 ? true : false}
        //   className={`${
        //     row.status === 1 ? "" : "bg-tw-danger hover:!bg-tw-orange"
        //   }`}
        //   onChange={(isChecked) => handleChangeSwitch(row.id, isChecked)}
        // />
        <>
          {ALLOWED_ADMIN_MANAGER.includes(user?.role) ? (
            row.status === 1 ? (
              <ButtonCom
                onClick={() => handleChangeStatus(row.id, true)}
                backgroundColor="success"
                className="px-3 rounded-lg !text-[12px]"
              >
                Active
              </ButtonCom>
            ) : (
              <ButtonCom
                onClick={() => handleChangeStatus(row.id, false)}
                backgroundColor="danger"
                className="px-3 rounded-lg !text-[12px]"
              >
                InActive
              </ButtonCom>
            )
          ) : (
            <div
              className={`text-white px-3 py-2 ${
                row.status === 1 ? "bg-tw-success" : "bg-tw-danger"
              }`}
            >
              {row.status === 1 ? "Active" : "InActive"}
            </div>
          )}
          {/* <div
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
          </div> */}
        </>
      ),
      width: "120px",
    },
    {
      name: "Section",
      cell: (row) => (
        <>
          <Link to={`/admin/courses/${row.id}/sections`}>
            <ButtonCom className="px-3 rounded-lg mr-2" backgroundColor="gray">
              <IconBookCom className="w-5 text-black"></IconBookCom>
            </ButtonCom>
          </Link>
        </>
      ),
      width: "80px",
    },
    {
      name: "Part",
      cell: (row) => (
        <>
          <Link to={`/admin/courses/${row.id}/parts`}>
            <ButtonCom className="px-3 rounded-lg mr-2" backgroundColor="gray">
              <IconPartCom className="w-5 text-black"></IconPartCom>
            </ButtonCom>
          </Link>
        </>
      ),
      width: "80px",
    },
    {
      name: "Learning",
      cell: (row) => (
        <>
          <ButtonCom
            className="px-3 rounded-lg mr-2"
            backgroundColor="gray"
            onClick={() => {
              window.open(`/learn/${row.slug}`, "_blank");
            }}
          >
            <IconVideoCom className="w-5 text-black"></IconVideoCom>
          </ButtonCom>
        </>
      ),
      width: "85px",
    },
    // {
    //   name: "$",
    //   selector: (row) =>
    //     row.net_price > 0
    //       ? `$${convertIntToStrMoney(row.net_price)}`
    //       : row.price > 0
    //       ? `$${convertIntToStrMoney(row.price)}`
    //       : "Free",
    //   sortable: true,
    //   width: "80px",
    // },
    {
      name: "Duration",
      selector: (row) => convertSecondToDiffForHumans(row.duration),
      sortable: true,
    },
    {
      name: "Updated By",
      selector: (row) => sliceText(row?.updated_by ?? "N/A", 12),
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
              handleEdit(row.id);
            }}
          >
            <IconEditCom className="w-5"></IconEditCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg mr-2"
            onClick={() => {
              window.open(`/courses/${row.slug}`, "_blank");
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

  // More Action Menu
  const dropdownItems = [
    {
      key: "1",
      label: <Link to="/admin/courses/authors">Author</Link>,
    },
    {
      key: "2",
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
      key: "3",
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

  const getCourses = async () => {
    try {
      const res = await axiosBearer.get(API_COURSE_URL);
      setCourses(res.data);
      setFilterCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTags = async () => {
    try {
      const res = await axiosBearer.get(`${API_TAG_URL}`);
      const newRes = res.data.map((item) => {
        const tagNames = item.name.split(" ");
        // ['Spring', 'Boot']
        const capitalLabelArr = tagNames.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        ); // slice 1 ký tự đầu);
        return {
          value: item.name.toLowerCase(),
          label: capitalLabelArr.join(" "),
        };
      });
      setTagItems(newRes);
    } catch (error) {
      showMessageError(error);
    }
  };

  const getAuthors = async () => {
    try {
      const res = await axiosBearer.get(`${API_AUTHOR_URL}`);
      const authors = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setAuthorItems(authors);
    } catch (error) {
      showMessageError(error);
    }
  };

  const getCourseById = async (courseId) => {
    try {
      const res = await axiosBearer.get(`${API_COURSE_URL}/${courseId}`);
      reset(res.data);
      setValue("price", convertIntToStrMoney(res.data.price));
      setValue("net_price", convertIntToStrMoney(res.data.net_price));

      setPrice(convertIntToStrMoney(res.data.price));
      setNetPrice(convertIntToStrMoney(res.data.net_price));
      setCategorySelected(res.data.category_id);
      setAuthorSelected(res.data.author_id);
      setTagsSelected(res.data.tags.split(","));
      if (res.data.achievements !== "") {
        setAchievementSelected(res.data.achievements.split(","));
      } else {
        setAchievementSelected([]);
      }

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
    getCourses();
    getTags();
    getAuthors();
    dispatch(onCourseLoading());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search in Table
  useEffect(() => {
    const result = courses.filter((course) => {
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
    setFilterCourse(result);
  }, [courses, search]);

  /********* Action Area ********* */
  const handleSubmitForm = async (values) => {
    const { price, net_price } = values;
    // if (image === "" || image[0] === undefined) {
    //   const imageSelector = document.querySelector('input[name="image"]');
    //   if (imageSelector) imageSelector.focus();
    //   toast.error(MESSAGE_GENERAL_FAILED);
    //   setError("image", { message: MESSAGE_UPLOAD_REQUIRED });
    //   setValue("image", null);
    // } else if
    if (convertStrMoneyToInt(net_price) > convertStrMoneyToInt(price)) {
      const netPriceSelector = document.querySelector(
        'input[name="net_price"]'
      );
      if (netPriceSelector) netPriceSelector.focus();
      toast.error(MESSAGE_GENERAL_FAILED);
      setError("net_price", { message: MESSAGE_NET_PRICE_HIGHER_PRICE });
    } else {
      try {
        setIsLoading(!isLoading);
        let fd = new FormData();
        fd.append(
          "courseJson",
          JSON.stringify({
            ...values,
            price: convertStrMoneyToInt(price),
            net_price: convertStrMoneyToInt(net_price),
          })
        );

        const res = await axiosBearer.put(`/course`, fd);
        getCourses();
        toast.success(`${res.data.message}`);
        setIsOpen(false);
      } catch (error) {
        showMessageError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Delete one
  const handleDelete = ({ id, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete course: <span className="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosBearer.delete(
            `${API_COURSE_URL}?courseId=${id}`
          );
          getCourses();
          reset(res.data);
          clearSelectedRows();
          toast.success(res.data.message);
        } catch (error) {
          showMessageError(error);
        }
      }
    });
  };

  ///********* Update Area *********
  const handleEdit = async (courseId) => {
    try {
      setIsFetching(true);
      await getCourseById(courseId);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  // const handleChangeStatus = (value) => {
  //   setValue("status", value);
  //   setError("status", { message: "" });
  // };

  const handleChangeLevel = (value) => {
    setValue("level", value);
    setError("level", { message: "" });
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

  const handleChangeSwitch = async (courseId, isChecked) => {
    // From InActive to Active, asking before Public to Client
    // if (isChecked) {
    //   Swal.fire({
    //     title: "Are you sure?",
    //     html: "After change, this course will public to client",
    //     icon: "question",
    //     showCancelButton: true,
    //     confirmButtonColor: "#7366ff",
    //     cancelButtonColor: "#dc3545",
    //     confirmButtonText: "Yes, delete it!",
    //   }).then(async (result) => {
    //     if (!result.isConfirmed) return;
    //   });
    // }
    try {
      // const newCourses = courses.map((course) =>
      //   course.id === courseId
      //     ? {
      //         ...course,
      //         status: isChecked ? 1 : 0,
      //       }
      //     : course
      // );

      // const dataBody = newCourses.find((course) => course.id === courseId);

      // const {
      //   id,
      //   name,
      //   status,
      //   level,
      //   image,
      //   category_id,
      //   author_id,
      //   price,
      //   net_price,
      //   duration,
      //   enrollmentCount,
      //   description,
      //   tags,
      //   achievements,
      // } = dataBody;

      // const fd = new FormData();
      // fd.append(
      //   "courseJson",
      //   JSON.stringify({
      //     id,
      //     name,
      //     status,
      //     level,
      //     image,
      //     category_id,
      //     author_id,
      //     price,
      //     net_price,
      //     duration,
      //     enrollmentCount,
      //     description,
      //     tags: tags
      //       .split(",")
      //       .map((tag) => tag.trim())
      //       .join(","),
      //     achievements:
      //       achievements !== null
      //         ? achievements
      //             .split(",")
      //             .map((achievement) => achievement.trim())
      //             .join(",")
      //         : "",
      //   })
      // );

      const fd = helperChangeStatusCourse(isChecked, courseId, courses, true);

      await axiosBearer.put(`/course`, fd);
      toast.success(MESSAGE_UPDATE_STATUS_SUCCESS);
      getCourses();
    } catch (error) {
      showMessageError(error);
    }
  };

  const handleChangeStatus = async (courseId, isChecked) => {
    const fd = helperChangeStatusCourse(isChecked, courseId, courses);
    if (!isChecked) {
      Swal.fire({
        title: "Are you sure?",
        html: "After change, this course will public to client",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7366ff",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosBearer.put(`/course`, fd);
            toast.success(MESSAGE_UPDATE_STATUS_SUCCESS);
            getCourses();
            dispatch(onCourseLoading());
          } catch (error) {
            showMessageError(error);
          }
        }
      });
    } else {
      try {
        await axiosBearer.put(`/course`, fd);
        toast.success(MESSAGE_UPDATE_STATUS_SUCCESS);
        getCourses();
        dispatch(onCourseLoading());
      } catch (error) {
        showMessageError(error);
      }
    }
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
      } selected ${selectedRows.length > 1 ? "courses" : "course"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = selectedRows.map((row) =>
            axiosBearer.delete(`${API_COURSE_URL}?courseId=${row.id}`)
          );
          await Promise.all(deletePromises);
          toast.success(
            `Delete [${selectedRows.length}] ${
              selectedRows.length > 1 ? "courses" : "course"
            } success`
          );
        } catch (error) {
          showMessageError(error);
        } finally {
          getCourses();
          clearSelectedRows();
        }
      }
    });
  };

  const handleChangeCategory = (value) => {
    setValue("category_id", value);
    setError("category_id", { message: "" });
    setCategorySelected(value);
  };

  const handleChangeAuthor = (value) => {
    setValue("author_id", value);
    setError("author_id", { message: "" });
    setAuthorSelected(value);
  };

  // itemsArrs = ["PHP", "PROGRAMMING"]
  const handleChangeTags = (itemsArrs) => {
    const regex = /[,!@#$%^&*()+=[\]\\';./{}|":<>?~_]/;
    const hasSpecialChar = itemsArrs.some((item) => regex.test(item));
    // const hasComma = itemsArrs.some((item) => item.includes(","));
    if (hasSpecialChar) {
      toast.error("Invalid tag! Only accept: - for special character");
      setValue("tags", "");
      setError("tags", { message: MESSAGE_FIELD_INVALID });
      return;
    }

    // Cut the space and - if more than one
    const strReplace = itemsArrs.map((item) =>
      item.replace(/\s+/g, " ").replace(/-+/g, "-").trim().toLowerCase()
    );
    const itemsString = strReplace.join(",").toLowerCase();

    setValue("tags", itemsString);
    setError("tags", { message: "" });
    setTagsSelected(itemsArrs);
  };

  // itemsArrs = ["PHP", "PROGRAMMING"]
  const handleChangeAchievements = (itemsArrs) => {
    // Cut the space and - if more than one
    const strReplace = itemsArrs
      .filter((item, index) => {
        if (item.includes(",")) {
          toast.error("Achievements not accept the Comma !");
          return false;
        }
        return true;
      })
      .map((item) => item.replace(/\s+/g, " "));
    const itemsString = strReplace.join(",");

    setValue("achievements", itemsString);
    setError("achievements", { message: "" });
    setAchievementSelected(itemsArrs);
  };

  return (
    <>
      {isFetching && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Learning</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "Course",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <AdminCardCom>
        <TableCom
          tableKey={tableKey}
          urlCreate="/admin/courses/create"
          title="List Courses"
          columns={columns}
          items={filterCourse}
          search={search}
          setSearch={setSearch}
          dropdownItems={dropdownItems}
          onSelectedRowsChange={handleRowSelection} // selected Mutilple
        ></TableCom>
      </AdminCardCom>

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
          <HeadingFormH5Com className="text-2xl">Edit Course</HeadingFormH5Com>
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
              placeholder="Course hidden id"
              errorMsg={errors.id?.message}
            ></InputCom>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <LabelCom htmlFor="name" isRequired>
                    Course Name
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="name"
                    register={register}
                    placeholder="Input Course Name"
                    errorMsg={errors.name?.message}
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-6">
                  <LabelCom htmlFor="price" subText="($)">
                    Price
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="price"
                    register={register}
                    placeholder="Input Price"
                    errorMsg={errors.price?.message}
                    onChange={handleChangePrice}
                    defaultValue={price}
                    value={price}
                  ></InputCom>
                </div>
                <div className="col-sm-6">
                  <LabelCom htmlFor="net_price" subText="($)">
                    Net Price
                  </LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="net_price"
                    register={register}
                    placeholder="Input Net Price"
                    errorMsg={errors.net_price?.message}
                    onChange={handleChangeNetPrice}
                    defaultValue={net_price}
                    value={net_price}
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
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
                <div className="col-sm-4">
                  <LabelCom htmlFor="author_id">Author</LabelCom>
                  <div>
                    <SelectSearchAntCom
                      selectedValue={authorSelected}
                      listItems={authorItems}
                      onChange={handleChangeAuthor}
                      className="w-full py-1"
                      status={
                        errors.author_id && errors.author_id.message && "error"
                      }
                      errorMsg={errors.author_id?.message}
                      placeholder="Search authors"
                    ></SelectSearchAntCom>
                    <InputCom
                      type="hidden"
                      control={control}
                      name="author_id"
                      register={register}
                    ></InputCom>
                  </div>
                </div>
                <div className="col-sm-4">
                  <LabelCom htmlFor="level" className="pb-[11px]">
                    Level
                  </LabelCom>
                  <div>
                    <SelectDefaultAntCom
                      listItems={levelItems}
                      onChange={handleChangeLevel}
                      defaultValue={watch("level")}
                    ></SelectDefaultAntCom>
                    <InputCom
                      type="hidden"
                      control={control}
                      name="level"
                      register={register}
                      defaultValue={watch("level")}
                    ></InputCom>
                  </div>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <LabelCom
                    htmlFor="tags"
                    isRequired
                    subText="'enter' every tags"
                  >
                    Tags
                  </LabelCom>
                  <SelectTagAntCom
                    listItems={tagItems}
                    selectedValue={tagsSelected}
                    onChange={handleChangeTags}
                    placeholder="Search or Input new Tags..."
                    status={errors.tags && errors.tags.message && "error"}
                    errorMsg={errors.tags?.message}
                  ></SelectTagAntCom>
                  <InputCom
                    type="hidden"
                    control={control}
                    name="tags"
                    register={register}
                  ></InputCom>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="col-sm-12 text-center">
                  <LabelCom
                    htmlFor="achievements"
                    subText="'enter' every achievement"
                  >
                    Achievement
                  </LabelCom>
                  <SelectTagAntCom
                    listItems={[]}
                    selectedValue={achievementSelected}
                    onChange={handleChangeAchievements}
                    placeholder="Input the achievement..."
                    status={
                      errors.achievements &&
                      errors.achievements.message &&
                      "error"
                    }
                    errorMsg={errors.achievements?.message}
                  ></SelectTagAntCom>
                  <InputCom
                    type="hidden"
                    control={control}
                    name="achievements"
                    register={register}
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <LabelCom htmlFor="image" isRequired>
                    Image
                  </LabelCom>
                  {/* <InputCom
                      type="file"
                      control={control}
                      name="image"
                      register={register}
                      placeholder="Upload image"
                      errorMsg={errors.image?.message}
                    ></InputCom> */}
                  <div>
                    <ImageCropUploadAntCom
                      name="image"
                      onSetValue={setValue}
                      errorMsg={errors.image?.message}
                      editImage={image}
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
              <div className="row">
                <div className="col-sm-12 text-center">
                  <LabelCom htmlFor="description">Description</LabelCom>
                  <TextEditorQuillCom
                    value={watch("description")}
                    onChange={(description) => {
                      setValue("description", description);
                    }}
                    placeholder="Describe your course ..."
                    className="h-[215px]"
                  ></TextEditorQuillCom>
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

export default AdminCourseListPage;
