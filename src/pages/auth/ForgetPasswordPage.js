import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FormGroupCom from "../../components/common/FormGroupCom";
import { HeadingFormH1Com } from "../../components/heading";
import { InputCom } from "../../components/input";
import { LabelCom } from "../../components/label";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  MESSAGE_EMAIL_INVALID,
  MESSAGE_FIELD_REQUIRED,
} from "../../constants/config";
import { useDispatch, useSelector } from "react-redux";
import { ButtonCom } from "../../components/button";
import GapYCom from "../../components/common/GapYCom";
import { onForgetPassword } from "../../store/auth/authSlice";

const schemaValidation = yup.object().shape({
  email: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED ?? "This fields is required")
    .email(MESSAGE_EMAIL_INVALID ?? "Invalid email"),
});

const ForgetPasswordPage = () => {
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((state) => state.auth);

  const handleSubmitForm = (values) => {
    dispatch(onForgetPassword(values));
  };

  return (
    <>
      <form className="theme-form" onSubmit={handleSubmit(handleSubmitForm)}>
        <HeadingFormH1Com>Forgot Password</HeadingFormH1Com>
        <FormGroupCom>
          <LabelCom htmlFor="email" isRequired>
            Your email
          </LabelCom>
          <InputCom
            type="text"
            control={control}
            name="email"
            register={register}
            placeholder="test123@gmail.com"
            errorMsg={errors.email?.message}
          ></InputCom>
        </FormGroupCom>
        <FormGroupCom>
          <ButtonCom type="submit" className="w-full" isLoading={isLoading}>
            Send
          </ButtonCom>
        </FormGroupCom>
        {/* Check After Submit, show Resend */}
        <div className="mt-4 mb-4">
          <span className="reset-password-link">
            If don't receive email! Please try again
            {/* <Link className="btn-link text-danger" to="/">
              Resend
            </Link> */}
          </span>
        </div>
        <p className="mt-4 mb-0 text-center">
          Already have an password?
          <Link
            className="ms-2 text-tw-primary hover:opacity-60 tw-transition-all"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default ForgetPasswordPage;
