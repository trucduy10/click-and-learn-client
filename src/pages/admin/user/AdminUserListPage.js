import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import * as yup from "yup";
import {
  ImageCropUploadAntCom,
  SelectSearchAntCom,
} from "../../../components/ant";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import DividerCom from "../../../components/common/DividerCom";
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
import { MultipleSelectMuiCom } from "../../../components/mui";
import { TableCom } from "../../../components/table";
import {
  AVATAR_DEFAULT,
  MAX_LENGTH_NAME,
  MAX_LENGTH_PASSWORD,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NO_ITEM_SELECTED,
  MESSAGE_READONLY,
  MESSAGE_REGEX_NAME,
} from "../../../constants/config";
import { regexName } from "../../../constants/regex";
import {
  onBulkDeleteUser,
  onDeleteUser,
  onGetAllUsers,
  onUpdateUser,
} from "../../../store/admin/user/userSlice";
import { selectRolesAndPermissions } from "../../../store/auth/authSelector";
import {
  onGetManagerEmployeeRoles,
  onLoadPermission,
  onLoadRole,
  onUpdatePermission,
} from "../../../store/auth/authSlice";
import {
  getUserNameByEmail,
  showMessageError,
  sliceText,
} from "../../../utils/helper";

const schemaValidation = yup.object().shape({
  first_name: yup
    .string()
    .trim()
    .required(MESSAGE_FIELD_REQUIRED)
    .matches(regexName, MESSAGE_REGEX_NAME)
    .min(3, "Minimum is 3 letters")
    .max(MAX_LENGTH_NAME, `Maximum ${MAX_LENGTH_NAME} letters`),
  last_name: yup
    .string()
    .trim()
    .required(MESSAGE_FIELD_REQUIRED)
    .matches(regexName, MESSAGE_REGEX_NAME)
    .min(3, "Minimum is 3 letters")
    .max(MAX_LENGTH_NAME, `Maximum ${MAX_LENGTH_NAME} letters`),
  newPassword: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .min(8, "Minimum is 8 letters")
    .max(MAX_LENGTH_PASSWORD, `Maximum ${MAX_LENGTH_PASSWORD} letters`),
});

const schemaValidationPermission = yup.object().shape({});

const AdminUserListPage = () => {
  const dispatch = useDispatch();
  const { usersAllRole, isPostUserSuccess, isBulkDeleteSuccess } = useSelector(
    (state) => state.user
  );

  const { roles, permissions, managerEmployeeRoles } = useSelector(
    selectRolesAndPermissions
  );

  /********* State ********* */
  //API State
  const [image, setImage] = useState([]);

  // Local State
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPermission, setIsOpenPermission] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [filterUser, setFilterUser] = useState([]);
  const [search, setSearch] = useState("");

  const { user, isLoading } = useSelector((state) => state.auth);

  const [role, setRole] = useState();
  const [permission, setPermission] = React.useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState(0);
  //const [roleItem, setRoleItem] = useState([]);

  /********* END API State ********* */

  /********* More Action Menu ********* */
  const dropdownItems = [
    {
      key: "1",
      label: (
        <div
          rel="noopener noreferrer"
          className="hover:text-tw-success transition-all duration-300"
          onClick={() => toast.info("Developing...")}
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

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const { handleSubmit: handleSubmitPermission } = useForm({
    resolver: yupResolver(schemaValidationPermission),
  });

  const resetValues = () => {
    reset();
  };

  /********* Fetch API Area ********* */
  const columns = [
    {
      name: "Avatar",
      selector: (row) => (
        <img
          width={50}
          height={50}
          src={`${row.imageUrl || AVATAR_DEFAULT}`}
          alt={row.name}
        />
      ),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Verify",
      selector: (row) =>
        row.verified ? (
          <IconCheckCom className="text-tw-success" />
        ) : (
          <IconRemoveCom className="text-tw-danger" />
        ),
      width: "100px",
    },
    {
      name: "Authorize",
      selector: (row) =>
        row?.role !== "USER" && (
          <ButtonCom
            className="px-3 rounded-lg !text-[12px]"
            onClick={() => {
              handlePermission(row);
            }}
          >
            Permission
          </ButtonCom>
        ),
      width: "150px",
    },
    {
      name: "Role",
      selector: (row) => row.role,
      width: "150px",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row.status === 1 ? (
            <ButtonCom
              onClick={() => handleChangeStatus(row.id)}
              backgroundColor="success"
              className="px-3 rounded-lg !text-[12px]"
            >
              Active
            </ButtonCom>
          ) : (
            <ButtonCom
              onClick={() => handleChangeStatus(row.id)}
              backgroundColor="danger"
              className="px-3 rounded-lg !text-[12px]"
            >
              InActive
            </ButtonCom>
          )}
        </>
      ),
      width: "150px",
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
              handleEdit(row.id);
            }}
          >
            <IconEditCom className="w-5"></IconEditCom>
          </ButtonCom>
          <ButtonCom
            className="px-3 rounded-lg"
            backgroundColor="danger"
            onClick={() => {
              handleDeleteUser(row);
            }}
          >
            <IconTrashCom className="w-5"></IconTrashCom>
          </ButtonCom>
        </>
      ),
    },
  ];

  /********* Call API ********* */
  //Get All user
  useEffect(() => {
    dispatch(onGetAllUsers());
    if (isPostUserSuccess) setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostUserSuccess]);

  useEffect(() => {
    dispatch(onLoadRole());
    dispatch(onGetManagerEmployeeRoles());
    dispatch(onLoadPermission());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    role
      ? setPermissionList(permissions.filter((p) => p.role.id === role.id))
      : setPermissionList([]);
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      if (role?.value === "EMPLOYEE") {
        const permission = permissions.find((p) => p.permission === "EMPLOYEE");
        setPermission([permission]);
      } else {
        setPermission([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, role]);

  const clearSelectedRows = () => {
    setSelectedRows([]);
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleRowSelection = (currentRowsSelected) => {
    setSelectedRows(currentRowsSelected.selectedRows);
  };

  /********* Search ********* */
  useEffect(() => {
    const result = usersAllRole.filter((item) => {
      if (user?.role === item.role) {
        return false;
      }
      if (user?.role === item.role) {
        return false;
      }
      const keys = Object.keys(item);
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

    setFilterUser(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersAllRole, search]);

  useEffect(() => {
    if (isBulkDeleteSuccess) clearSelectedRows();
  }, [isBulkDeleteSuccess]);

  /********* Delete one API ********* */
  const handleDeleteUser = ({ id, name }) => {
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete user: <span class="text-tw-danger">${name}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onDeleteUser(id));
      }
    });
  };

  /********* Bulk Delete API ********* */
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.warning(MESSAGE_NO_ITEM_SELECTED);
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      html: `You will delete <span class="text-tw-danger">${
        selectedRows.length
      } selected ${selectedRows.length > 1 ? "users" : "user"}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7366ff",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(onBulkDeleteUser(selectedRows));
      }
    });
  };
  /********* Update Status API ********* */
  const handleChangeStatus = async (userId) => {
    const { id, email, first_name, last_name, imageUrl, status } =
      usersAllRole.find((user) => user.id === userId);
    const formData = {
      id,
      first_name,
      last_name,
      imageUrl,
      status: status === 1 ? 0 : 1,
    };

    if (status === 1) {
      Swal.fire({
        title: "Are you sure?",
        html: `Your will set inactive user: <span class="text-tw-danger">${getUserNameByEmail(
          email
        )}</span>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7366ff",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, please continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(onUpdateUser(formData));
        }
      });
    } else {
      dispatch(onUpdateUser(formData));
    }
  };

  /********* Update User ********* */
  const getUserById = (userId, action = "n/a") => {
    setIsFetching(true);
    const user = usersAllRole.find((item) => item.id === userId);
    switch (action) {
      case "fetch":
        typeof user !== "undefined" ? reset(user) : showMessageError("No data");
        const resImage = user.imageUrl;
        const imgObj = [
          {
            uid: v4(),
            name: resImage?.substring(resImage.lastIndexOf("/") + 1),
            status: "done",
            url: resImage,
          },
        ];
        setImage(imgObj);
        break;
      default:
        break;
    }
    setIsFetching(false);
    return typeof user !== "undefined" ? user : showMessageError("No data");
  };

  const handleEdit = (userId) => {
    setIsOpen(true);
    getUserById(userId, "fetch");
  };

  const handleSubmitForm = (values) => {
    const { id, first_name, last_name, email, imageUrl, newPassword } = values;
    if (values.newPassword) {
      Swal.fire({
        title: "Are you sure?",
        html: `Password of user will be change after you update`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7366ff",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, please continue!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(
            onUpdateUser({
              id,
              first_name,
              last_name,
              email,
              imageUrl,
              password: newPassword,
            })
          );
        }
      });
    } else {
      dispatch(
        onUpdateUser({
          id,
          first_name,
          last_name,
          email,
          imageUrl,
          password: newPassword,
        })
      );
    }
  };

  /********* Update Authorize ********* */
  const handlePermission = (item) => {
    setFirstLoad(true);

    const role = managerEmployeeRoles.find((r) => r.name === item.role);
    setRole({ id: role.id, value: role.name, label: role.name });
    setSelectedUser(item.id);

    const userPermissions = [];
    for (let i = 0; i < item.permissions.length; i++) {
      const element = permissions.find(
        (p) => p.permission === item.permissions[i]
      );
      if (element) {
        userPermissions.push(element);
      }
    }

    setPermission(userPermissions);
    setIsOpenPermission(true);
  };

  const handleSubmitFormPermission = () => {
    const payload = {
      userId: selectedUser,
      permissions: permission,
      role: { id: role.id, name: role.value },
    };

    dispatch(onUpdatePermission(payload));
    setIsOpenPermission(false);
  };

  const handleChangeRole = (value) => {
    console.log("value:", value);
    setRole(value);
  };

  const handleChangePermission = (event) => {
    const {
      target: { value },
    } = event;

    if (role.value === "EMPLOYEE") {
      const permission = permissions.find((p) => p.permission === role.value);
      if (permission && !value.find((p) => p.permission === "EMPLOYEE")) {
        value.unshift(permission);
      }
    }

    setPermission(value);
  };

  return (
    <>
      {isFetching && <LoadingCom />}
      <div className="flex justify-between items-center">
        <HeadingH1Com>Management Users</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "User",
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
                  urlCreate="/admin/users/create"
                  tableKey={tableKey}
                  title="List Users"
                  columns={columns}
                  items={filterUser}
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

      {/* Modal Edit Authorize */}
      <ReactModal
        isOpen={isOpenPermission}
        onRequestClose={() => setIsOpenPermission(false)}
        overlayClassName="modal-overplay fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        className={`modal-content scroll-hidden  max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg outline-none transition-all duration-300 ${
          isOpenPermission ? "w-50" : "w-0"
        }`}
      >
        <div className="card-header bg-tw-primary flex justify-between text-white">
          <HeadingFormH5Com className="text-2xl">Authorize</HeadingFormH5Com>
          <ButtonCom backgroundColor="danger" className="px-2">
            <IconRemoveCom
              className="flex items-center justify-center p-2 w-10 h-10 rounded-xl bg-opacity-20 text-white"
              onClick={() => setIsOpenPermission(false)}
            ></IconRemoveCom>
          </ButtonCom>
        </div>
        <div className="card-body">
          <form
            className="theme-form"
            onSubmit={handleSubmitPermission(handleSubmitFormPermission)}
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
                <div className="col-sm-3">
                  <LabelCom htmlFor="role" isRequired>
                    Role
                  </LabelCom>
                  <div>
                    <SelectSearchAntCom
                      selectedValue={role}
                      listItems={managerEmployeeRoles.map((r) => {
                        return {
                          id: r.id,
                          value: r.name,
                          label: r.name,
                        };
                      })}
                      onChange={handleChangeRole}
                      isGetObject={true}
                      className="w-full py-1"
                      status={
                        errors.category_id &&
                        errors.category_id.message &&
                        "error"
                      }
                      errorMsg={errors.role?.message}
                      placeholder="Choose a role"
                    ></SelectSearchAntCom>
                    <MultipleSelectMuiCom
                      onChange={handleChangePermission}
                      selectedValue={permission}
                      permissions={permissionList}
                    ></MultipleSelectMuiCom>
                  </div>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
            </div>
            <div className="card-footer flex justify-end gap-x-5">
              <ButtonCom type="submit" disabled={permission.length === 0}>
                Update
              </ButtonCom>
            </div>
          </form>
        </div>
      </ReactModal>

      {/* Modal Edit User */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName="modal-overplay fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        className={`modal-content scroll-hidden  max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg outline-none transition-all duration-300 ${
          isOpen ? "w-50" : "w-0"
        }`}
      >
        <div className="card-header bg-tw-primary flex justify-between text-white">
          <HeadingFormH5Com className="text-2xl">Edit User</HeadingFormH5Com>
          <ButtonCom backgroundColor="danger" className="px-2">
            <IconRemoveCom
              className="flex items-center justify-center p-2 w-10 h-10 rounded-xl bg-opacity-20 text-white"
              onClick={() => setIsOpen(false)}
            ></IconRemoveCom>
          </ButtonCom>
        </div>
        <div className="login-card bg-none items-baseline">
          <div className="login-main">
            <form
              className="theme-form"
              onSubmit={handleSubmit(handleSubmitForm)}
            >
              <InputCom
                type="hidden"
                control={control}
                name="id"
                register={register}
                placeholder="User hidden id"
                errorMsg={errors.id?.message}
              ></InputCom>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <LabelCom htmlFor="first_name" isRequired>
                      First Name
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="first_name"
                      register={register}
                      placeholder="Input first name"
                      errorMsg={errors.first_name?.message}
                    ></InputCom>
                  </div>
                  <div className="col-sm-6">
                    <LabelCom htmlFor="first_name" isRequired>
                      Last Name
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="last_name"
                      register={register}
                      placeholder="Input last name"
                      errorMsg={errors.last_name?.message}
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12">
                    <LabelCom htmlFor="email" subText="Read Only">
                      Email
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="email"
                      register={register}
                      placeholder={MESSAGE_READONLY}
                      errorMsg={errors.email?.message}
                      readOnly
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12">
                    <LabelCom htmlFor="newPassword">New password</LabelCom>
                    <InputCom
                      type="password"
                      control={control}
                      name="newPassword"
                      register={register}
                      placeholder="Input the new will reset password"
                      errorMsg={errors.newPassword?.message}
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <LabelCom htmlFor="imageUrl">Avatar</LabelCom>
                    <div>
                      <ImageCropUploadAntCom
                        name="imageUrl"
                        onSetValue={setValue}
                        errorMsg={errors.imageUrl?.message}
                        isCropped={false}
                        editImage={image}
                      ></ImageCropUploadAntCom>
                      <InputCom
                        type="hidden"
                        control={control}
                        name="imageUrl"
                        register={register}
                      ></InputCom>
                    </div>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>

                <DividerCom />
                <ButtonCom
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Update
                </ButtonCom>
              </div>
            </form>
          </div>
        </div>
      </ReactModal>
    </>
  );
};
export default AdminUserListPage;
