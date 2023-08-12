import { yupResolver } from "@hookform/resolvers/yup";
import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { ButtonCom } from "../../components/button";
import { CheckBoxCom } from "../../components/checkbox";
import FormGroupCom from "../../components/common/FormGroupCom";
import { HeadingFormH1Com } from "../../components/heading";
import { InputCom } from "../../components/input";
import { LabelCom } from "../../components/label";
import {
  MAX_LENGTH_PASSWORD,
  MESSAGE_CONFIRM_PASSWORD_INVALID,
  MESSAGE_FIELD_REQUIRED,
} from "../../constants/config";
import useClickToggleBoolean from "../../hooks/useClickToggleBoolean";
import {
  onLogin,
  onResetPassword,
  onResetPasswordSuccess,
} from "../../store/auth/authSlice";
import { setRememberUser } from "../../utils/auth";

const schemaValidation = yup.object().shape({
  password: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(8, "Minimum is 8 letters")
    .max(MAX_LENGTH_PASSWORD, `Maximum ${MAX_LENGTH_PASSWORD} letters`),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], MESSAGE_CONFIRM_PASSWORD_INVALID)
    .required(MESSAGE_FIELD_REQUIRED),
});

const ResetPasswordPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const { isLoading, isResetPasswordSuccess } = useSelector(
    (state) => state.auth
  );
  const { value: isRemember, handleToggleBoolean: setIsRemember } =
    useClickToggleBoolean();

  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  useEffect(() => {
    // First time go to this page, set onResetPasswordSuccess false
    dispatch(onResetPasswordSuccess(false));
    if (isResetPasswordSuccess) {
      const { password } = getValues();
      const email = jwt_decode(token)?.sub;
      if (isRemember) setRememberUser(email, password);
      dispatch(onLogin({ email, password }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetPasswordSuccess]);

  const handleSubmitForm = (values) => {
    dispatch(
      onResetPassword({
        ...values,
        token,
      })
    );
  };

  return (
    <>
      <form className="theme-form" onSubmit={handleSubmit(handleSubmitForm)}>
        <HeadingFormH1Com>Reset Password</HeadingFormH1Com>
        <FormGroupCom>
          <LabelCom htmlFor="password" isRequired>
            New password
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
          <LabelCom htmlFor="password" isRequired>
            Confirm password
          </LabelCom>
          <InputCom
            type="password"
            control={control}
            name="confirmPassword"
            register={register}
            placeholder="Same new password"
            errorMsg={errors.confirmPassword?.message}
          ></InputCom>
        </FormGroupCom>
        <FormGroupCom>
          <CheckBoxCom
            name="remember"
            onClick={setIsRemember}
            checked={isRemember}
          >
            Remember password after change
          </CheckBoxCom>
        </FormGroupCom>
        <FormGroupCom>
          <ButtonCom type="submit" className="w-full" isLoading={isLoading}>
            Change
          </ButtonCom>
        </FormGroupCom>
        <p className="mt-4 mb-0">
          Don't have account?
          <Link
            className="ms-2 text-tw-primary hover:opacity-60 tw-transition-all"
            to="/register"
          >
            Register
          </Link>
        </p>
      </form>
    </>
  );
};

export default ResetPasswordPage;
