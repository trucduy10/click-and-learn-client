import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  ImageCropUploadAntCom,
  SelectDefaultAntCom,
} from "../../../components/ant";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import DividerCom from "../../../components/common/DividerCom";
import GapYCom from "../../../components/common/GapYCom";
import { HeadingH1Com } from "../../../components/heading";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import {
  MAX_LENGTH_NAME,
  MAX_LENGTH_PASSWORD,
  MESSAGE_EMAIL_INVALID,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_REGEX_NAME,
} from "../../../constants/config";
import { ALL_ROLES } from "../../../constants/permissions";
import { regexName } from "../../../constants/regex";
import { onCreateUser } from "../../../store/admin/user/userSlice";

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
  email: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .email(MESSAGE_EMAIL_INVALID),
  password: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(8, "Minimum is 8 letters")
    .max(MAX_LENGTH_PASSWORD, `Maximum ${MAX_LENGTH_PASSWORD} letters`),
});

const AdminCreateUserPage = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isPostUserSuccess, isLoading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [role, setRole] = useState("USER");

  useEffect(() => {
    if (isPostUserSuccess) navigate("/admin/users");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostUserSuccess]);

  const handleSubmitForm = (values) => {
    dispatch(
      onCreateUser({
        ...values,
      })
    );
  };

  const handleChangeRole = (value) => {
    setValue("role", value);
    setRole(value);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create User</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "User",
              slug: "/admin/users",
            },
            {
              title: "Create",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="login-card bg-none items-baseline">
        <div className="login-main">
          <form
            className="theme-form"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
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
                  <LabelCom htmlFor="email">Email</LabelCom>
                  <InputCom
                    type="text"
                    control={control}
                    name="email"
                    register={register}
                    placeholder="Input email"
                    errorMsg={errors.email?.message}
                    autoComplete="off"
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12">
                  <LabelCom htmlFor="password" isRequired>
                    Password
                  </LabelCom>
                  <InputCom
                    type="password"
                    control={control}
                    name="password"
                    register={register}
                    placeholder="Input password"
                    errorMsg={errors.password?.message}
                    autoComplete="off"
                  ></InputCom>
                </div>
              </div>
              <GapYCom className="mb-3"></GapYCom>
              <div className="row">
                <div className="col-sm-12">
                  <LabelCom htmlFor="role" isRequired>
                    Role
                  </LabelCom>
                  <div>
                    <SelectDefaultAntCom
                      selectedValue={role}
                      listItems={ALL_ROLES.filter((r) => {
                        if (user?.role === "MANAGER") {
                          return r.value !== "ADMIN" && r.value !== "MANAGER";
                        }
                        return r.value !== "ADMIN";
                      })}
                      defaultValue={ALL_ROLES[3].value}
                      onChange={handleChangeRole}
                      className="w-full py-1"
                      status={
                        errors.category_id &&
                        errors.category_id.message &&
                        "error"
                      }
                      errorMsg={errors.role?.message}
                      placeholder="Choose a role"
                      autoComplete="off"
                    ></SelectDefaultAntCom>
                  </div>
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
              <ButtonCom type="submit" isLoading={isLoading} className="w-full">
                Create
              </ButtonCom>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreateUserPage;
