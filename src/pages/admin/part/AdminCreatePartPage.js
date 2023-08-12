import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import * as yup from "yup";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import GapYCom from "../../../components/common/GapYCom";
import { HeadingH1Com } from "../../../components/heading";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NUMBER_REQUIRED,
  MESSAGE_READONLY,
} from "../../../constants/config";
import { onPostPart } from "../../../store/admin/part/partSlice";

/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  // name: yup.string().required(MESSAGE_FIELD_REQUIRED),
  // ordered: yup.number(MESSAGE_NUMBER_REQUIRED),
  maxPoint: yup
    .number(MESSAGE_FIELD_REQUIRED)
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, "This field must be greater than 0"),
  limitTime: yup
    .number(MESSAGE_FIELD_REQUIRED)
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(600, "This field must be greater than 600"),
});

const AdminCreatePartPage = () => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  /********* API Area ********* */
  // const [tagItems, setTagItems] = useState([]);
  /********* END API Area ********* */
  const { isLoading, isPostPartSuccess } = useSelector(
    (state) => state.part
  );

  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetValues = () => {
    reset();
  };
  // Nếu ko muốn chuyển trang sau khi create, hủy phần này
  useEffect(() => {
    if (isPostPartSuccess) navigate(`/admin/courses/${courseId}/parts`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostPartSuccess]);

  /********* Get Course ID from API  ********* */
  const handleSubmitForm = (values) => {
    dispatch(
      onPostPart({
        ...values,
        courseId: parseInt(courseId),
      })
    );
  };

  /********* Library Function Area ********* */

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create Part</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "Course",
              slug: "/admin/courses",
            },
            {
              title: "Part",
              slug: `/admin/courses/${courseId}/parts`,
            },
            {
              title: "Create",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="card-body">
                {/* <div className="row">
                  <div className="col-sm-6 offset-3 text-center">
                    <LabelCom htmlFor="maxPoint">Part Name</LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="name"
                      register={register}
                      placeholder={MESSAGE_READONLY}
                      defaultValue={fakeName("PART", parts?.[0]?.id + 1)}
                      readOnly
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom> */}
                <div className="row">
                  <div className="col-sm-6">
                    <LabelCom htmlFor="maxPoint" isRequired>
                      Max Point
                    </LabelCom>
                    <InputCom
                      type="number"
                      control={control}
                      name="maxPoint"
                      register={register}
                      placeholder="Input max point"
                      errorMsg={errors.maxPoint?.message}
                    ></InputCom>
                  </div>

                  <div className="col-sm-6">
                    <LabelCom htmlFor="limitTime" subText="(second)" isRequired>
                      Limit Time
                    </LabelCom>
                    <InputCom
                      type="number"
                      control={control}
                      name="limitTime"
                      register={register}
                      placeholder={MESSAGE_READONLY}
                      errorMsg={errors.limitTime?.message}
                      defaultValue={600}
                      autoFocus
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
              </div>
              <div className="card-footer flex justify-end gap-x-5">
                <ButtonCom type="submit" isLoading={isLoading}>
                  Create
                </ButtonCom>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCreatePartPage;
