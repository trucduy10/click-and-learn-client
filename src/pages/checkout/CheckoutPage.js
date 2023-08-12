// **** Mui ****
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { axiosBearer } from "../../api/axiosInstance";
import { BreadcrumbCom } from "../../components/breadcrumb";
import { ButtonCom } from "../../components/button";
import DividerCom from "../../components/common/DividerCom";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH3Com } from "../../components/heading";
import { InputReadOnlyCom } from "../../components/input";
import { LabelCom } from "../../components/label";
import { TextAreaCom } from "../../components/textarea";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_LOGIN_REQUIRED,
  NOT_FOUND_URL,
} from "../../constants/config";
import { API_CHECKOUT_URL } from "../../constants/endpoint";
import {
  selectAllCourseState,
  selectEnrollIdAndCourseId,
} from "../../store/course/courseSelector";
import { convertIntToStrMoney, showMessageError } from "../../utils/helper";
import { toast } from "react-toastify";
import { checkUserLogin } from "../../utils/auth";

const schemaValidation = yup.object().shape({
  payment_method: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .oneOf(["MOMO", "PAYPAL"], "Only accept payment method: MOMO or PAYPAL"),
});

const CheckoutPage = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const [paymentMethod, setPaymentMethod] = useState("MOMO");

  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    checkUserLogin(user?.id, navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
  const { data } = useSelector(selectAllCourseState);
  const { isEnrolled } = useSelector(selectEnrollIdAndCourseId);
  const courseBySlug = data.find((item, index) => item.slug === slug);
  useEffect(() => {
    if (!courseBySlug) navigate(NOT_FOUND_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseBySlug]);

  useEffect(() => {
    if (isEnrolled && user?.role === "USER")
      navigate(`/learn/${courseBySlug?.slug}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnrolled]);

  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentMethod = (e) => {
    const selectedPaymentMethod = e.target.value;
    setPaymentMethod(selectedPaymentMethod);
    setValue("payment_method", selectedPaymentMethod);
  };

  const handleSubmitForm = async (values) => {
    if (!user?.id) {
      toast.warning(MESSAGE_LOGIN_REQUIRED);
      navigate("/login");
    } else {
      try {
        setIsLoading(!isLoading);
        const res = await axiosBearer.post(API_CHECKOUT_URL, {
          amount:
            courseBySlug?.price === 0
              ? 0
              : courseBySlug?.net_price > 0
              ? courseBySlug?.net_price
              : courseBySlug?.price,
          userId: user?.id,
          courseId: courseBySlug?.id,
          paymentType: values.payment_method,
          userDescription: values.description,
        });
        if (res?.data?.statusCodeValue === 200)
          window.location.href = res.data.body.payUrl;
      } catch (error) {
        showMessageError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Checkout Page</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Course",
              slug: "/courses",
            },
            {
              title: "Detail",
              slug: `/courses/${slug ?? "not-found"}`,
            },
            {
              title: "Checkout",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="card">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="card-body">
            <div className="row">
              <div className="checkout-user-detail col-xl-6 col-sm-12">
                {/* <div className="row">
                  <div className="col-sm-12">
                    <div className="title-box">
                      <h3 className="text-2xl font-bold text-[#444] pb-[1.25rem]">
                        Customer Details
                      </h3>
                      <hr className="text-gray-400"></hr>
                    </div>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom> */}
                <div className="row">
                  <div className="col-sm-6">
                    <LabelCom htmlFor="first_name">First Name</LabelCom>
                    <InputReadOnlyCom
                      name="first_name"
                      value={user?.first_name}
                    />
                    {/* <InputCom
                      type="text"
                      control={control}
                      name="first_name"
                      register={register}
                      placeholder="First Name"
                      errorMsg={errors.first_name?.message}
                      value={user?.first_name}
                    ></InputCom> */}
                  </div>
                  <div className="col-sm-6">
                    <LabelCom htmlFor="last_name">Last Name</LabelCom>
                    <InputReadOnlyCom
                      name="last_name"
                      value={user?.last_name}
                    />
                    {/* <InputCom
                      type="text"
                      control={control}
                      name="last_name"
                      register={register}
                      placeholder="Last Name"
                      errorMsg={errors.last_name?.message}
                      value={user?.last_name}
                    ></InputCom> */}
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  {/* <div className="col-sm-6">
                    <LabelCom htmlFor="phone">
                      Phone
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="phone"
                      register={register}
                      placeholder="0902xxxxxx"
                      errorMsg={errors.phone?.message}
                    ></InputCom>
                  </div> */}
                  <div className="col-sm-12">
                    <LabelCom htmlFor="email">Email</LabelCom>
                    <InputReadOnlyCom name="email" value={user?.email} />
                    {/* <InputCom
                      type="text"
                      control={control}
                      name="email"
                      register={register}
                      placeholder="test123@gmail.com"
                      errorMsg={errors.email?.message}
                    ></InputCom> */}
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12">
                    <LabelCom htmlFor="description">Noted</LabelCom>
                    <TextAreaCom
                      name="description"
                      control={control}
                      register={register}
                      placeholder="Write your noted..."
                    ></TextAreaCom>
                  </div>
                </div>
              </div>
              <div className="checkout-order-detail col-xl-6 col-sm-12">
                <div className="checkout-details">
                  <div className="order-box">
                    <div className="title-box">
                      <div className="checkbox-title items-center">
                        <h4>Course</h4>
                        <span>Total</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <HeadingH3Com className="bg-gradient-to-r from-tw-light-pink to-tw-primary bg-clip-text text-transparent hover:text-black flex-1">
                        {courseBySlug?.name}
                      </HeadingH3Com>
                      <span>
                        {courseBySlug?.price === 0
                          ? "Free"
                          : courseBySlug?.net_price > 0
                          ? `$${convertIntToStrMoney(courseBySlug?.net_price)}`
                          : `$${convertIntToStrMoney(courseBySlug?.price)}`}
                      </span>
                    </div>
                    <DividerCom></DividerCom>
                    {/* <ul className="qty">
                      <li>
                        <h3 className="bg-gradient-to-r from-tw-light-pink to-tw-primary bg-clip-text text-transparent !text-lg !font-bold">
                          Become Master PHP
                        </h3>
                        <span>$300</span>
                      </li>
                    </ul> */}
                    {/* <ul className="sub-total">
                      <li>
                        Subtotal <span className="count">$300</span>
                      </li>
                    </ul> */}
                    <ul className="sub-total total">
                      <li className="!font-bold">
                        Total{" "}
                        <span className="count !font-bold">
                          {courseBySlug?.price === 0
                            ? "Free"
                            : courseBySlug?.net_price > 0
                            ? `$${convertIntToStrMoney(
                                courseBySlug?.net_price
                              )}`
                            : `$${convertIntToStrMoney(courseBySlug?.price)}`}
                        </span>
                      </li>
                    </ul>
                    <div className="animate-chk">
                      <div className="row">
                        <div className="col">
                          <FormControl>
                            <LabelCom htmlFor="payment_method">
                              Payment Methods
                            </LabelCom>
                            <RadioGroup
                              id="payment_method"
                              aria-labelledby="payment_method"
                              name="radio-buttons-group"
                              value={paymentMethod}
                            >
                              <FormControlLabel
                                value="MOMO"
                                control={
                                  <Radio
                                    style={{ color: "#7366ff" }}
                                    onClick={handlePaymentMethod}
                                  />
                                }
                                label="Momo"
                              />
                              <FormControlLabel
                                value="PAYPAL"
                                control={
                                  <Radio
                                    style={{ color: "#7366ff" }}
                                    onClick={handlePaymentMethod}
                                  />
                                }
                                label="Paypal"
                              />
                            </RadioGroup>
                            <input
                              type="hidden"
                              value={paymentMethod}
                              {...register("payment_method")}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer flex justify-end gap-x-5">
            <ButtonCom type="submit" isLoading={isLoading}>
              Continue
            </ButtonCom>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckoutPage;
