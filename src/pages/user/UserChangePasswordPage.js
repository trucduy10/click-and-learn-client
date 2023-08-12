import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { BreadcrumbCom } from "../../components/breadcrumb";
import { ButtonCom } from "../../components/button";
import FormGroupCom from "../../components/common/FormGroupCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com } from "../../components/heading";
import { InputCom } from "../../components/input";
import { LabelCom } from "../../components/label";
import {
  MAX_LENGTH_PASSWORD,
  MAX_LENGTH_VARCHAR,
  MESSAGE_CONFIRM_PASSWORD_INVALID,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_THIRD_PARTY_WARNING,
} from "../../constants/config";
import { selectIsUserChangePasswordSuccess } from "../../store/auth/authSelector";
import { onUserChangePassword } from "../../store/auth/authSlice";

const schemaValidation = yup.object().shape({
  oldPassword: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(8, "Minimum is 8 letters")
    .max(MAX_LENGTH_VARCHAR, `Maximum ${MAX_LENGTH_VARCHAR} letters`),
  password: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(8, "Minimum is 8 letters")
    .max(MAX_LENGTH_PASSWORD, `Maximum ${MAX_LENGTH_PASSWORD} letters`),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], MESSAGE_CONFIRM_PASSWORD_INVALID)
    .min(8, "Minimum is 8 letters")
    .max(MAX_LENGTH_PASSWORD, `Maximum ${MAX_LENGTH_PASSWORD} letters`)
    .required(MESSAGE_FIELD_REQUIRED),
});

const UserChangePasswordPage = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const isChangePassword = useSelector(selectIsUserChangePasswordSuccess);

  useEffect(() => {
    if (user && user.provider !== "local") {
      toast.warn(MESSAGE_THIRD_PARTY_WARNING);
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (isChangePassword) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChangePassword]);
  const dispatch = useDispatch();

  const handleSubmitForm = (values) => {
    dispatch(
      onUserChangePassword({
        ...values,
        email: user?.email,
      })
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Change password</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Profile",
              slug: `/profile/${user?.email.split("@")[0]}`,
            },
            {
              title: "Change Password",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="login-card bg-none block p-0">
        <div className="login-main mx-auto">
          <form
            className="theme-form"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <FormGroupCom>
              <LabelCom htmlFor="oldPassword" isRequired>
                Old password
              </LabelCom>
              <InputCom
                type="password"
                control={control}
                name="oldPassword"
                register={register}
                placeholder="Your old password"
                errorMsg={errors.oldPassword?.message}
              ></InputCom>
            </FormGroupCom>
            <FormGroupCom>
              <LabelCom htmlFor="password" isRequired>
                New Password
              </LabelCom>
              <InputCom
                type="password"
                control={control}
                name="password"
                register={register}
                placeholder="Input new password"
                errorMsg={errors.password?.message}
              ></InputCom>
            </FormGroupCom>
            <FormGroupCom>
              <LabelCom htmlFor="confirmPassword" isRequired>
                Confirm Password
              </LabelCom>
              <InputCom
                type="password"
                control={control}
                name="confirmPassword"
                register={register}
                placeholder="Input confirm password"
                errorMsg={errors.confirmPassword?.message}
              ></InputCom>
            </FormGroupCom>
            <div className="card-footer p-0">
              <ButtonCom
                type="submit"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Save
              </ButtonCom>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserChangePasswordPage;
