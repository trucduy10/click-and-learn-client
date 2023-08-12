import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { ButtonCom } from "../../components/button";
import { CheckBoxCom } from "../../components/checkbox";
import FormGroupCom from "../../components/common/FormGroupCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingFormH1Com } from "../../components/heading";
import { InputCom } from "../../components/input";
import { LabelCom } from "../../components/label";
import {
  MAX_LENGTH_NAME,
  MAX_LENGTH_PASSWORD,
  MESSAGE_EMAIL_INVALID,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_POLICY_REQUIRED,
  MESSAGE_REGEX_NAME,
} from "../../constants/config";
import { regexName } from "../../constants/regex";
import useClickToggleBoolean from "../../hooks/useClickToggleBoolean";
import {
  onLoading,
  onRegister,
  onRegisterSuccess,
} from "../../store/auth/authSlice";
import OAuth2Page from "./OAuth2Page";

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

const RegisterPage = () => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isRegisterSuccess } = useSelector((state) => state.auth);

  const { value: acceptTerm, handleToggleBoolean: handleToggleTerm } =
    useClickToggleBoolean();

  const {
    value: isRegisterEmployee,
    handleToggleBoolean: handleToggleRegisterEmployee,
  } = useClickToggleBoolean();

  const handleRegister = (values) => {
    if (!acceptTerm) {
      toast.warning(MESSAGE_POLICY_REQUIRED);
      return;
    }
    if (isRegisterEmployee) values = { ...values, status: 0, role: "EMPLOYEE" };
    dispatch(onRegister(values));
  };

  useEffect(() => {
    dispatch(onLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRegisterSuccess) {
      dispatch(onRegisterSuccess(false));
      navigate("/login");
    }
  }, [isRegisterSuccess]);
  return (
    <>
      <form className="theme-form" onSubmit={handleSubmit(handleRegister)}>
        <HeadingFormH1Com>Register Page</HeadingFormH1Com>
        <FormGroupCom>
          <LabelCom htmlFor="first_name" isRequired>
            Your Name
          </LabelCom>
          <div className="row g-2">
            <div className="col-6">
              <InputCom
                control={control}
                name="first_name"
                register={register}
                placeholder="First name"
                errorMsg={errors.first_name?.message}
              ></InputCom>
            </div>
            <div className="col-6">
              <InputCom
                control={control}
                name="last_name"
                register={register}
                placeholder="Last name"
                errorMsg={errors.last_name?.message}
              ></InputCom>
            </div>
          </div>
        </FormGroupCom>
        <FormGroupCom>
          <LabelCom htmlFor="email" isRequired>
            Email Address
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
          <LabelCom htmlFor="password" isRequired>
            Password
          </LabelCom>
          <InputCom
            type="password"
            control={control}
            name="password"
            register={register}
            placeholder="Input your password"
            errorMsg={errors.password?.message}
          ></InputCom>
        </FormGroupCom>
        <FormGroupCom>
          <CheckBoxCom
            name="register_employee"
            checked={isRegisterEmployee}
            onClick={handleToggleRegisterEmployee}
          >
            Register as an
            <span className="ms-2 text-tw-light-pink hover:opacity-60 tw-transition-all">
              Employee
            </span>
          </CheckBoxCom>
        </FormGroupCom>
        <FormGroupCom>
          <CheckBoxCom
            name="term"
            checked={acceptTerm}
            onClick={handleToggleTerm}
          >
            Agree with
            <Link
              className="ms-2 text-tw-primary hover:opacity-60 tw-transition-all"
              to="/privacy-policy"
            >
              Privacy Policy
            </Link>
          </CheckBoxCom>
          <GapYCom></GapYCom>
          <ButtonCom type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </ButtonCom>
        </FormGroupCom>
        <h6 className="text-muted mt-4 or">Or register with</h6>
        <GapYCom></GapYCom>
        <OAuth2Page></OAuth2Page>
        <p className="mt-4 mb-0">
          Already have an account?
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

export default RegisterPage;
