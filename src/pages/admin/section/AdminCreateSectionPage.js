import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HeadingH1Com } from "../../../components/heading";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ButtonCom } from "../../../components/button";
import "react-quill/dist/quill.snow.css";
import GapYCom from "../../../components/common/GapYCom";
import { toast } from "react-toastify";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NUMBER_REQUIRED,
} from "../../../constants/config";
import { useParams } from "react-router-dom";
import { API_COURSE_URL } from "../../../constants/endpoint";
import { useNavigate } from "react-router-dom/dist";
import { showMessageError } from "../../../utils/helper";
import { axiosBearer } from "../../../api/axiosInstance";
import { BreadcrumbCom } from "../../../components/breadcrumb";

/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  name: yup.string().trim().required(MESSAGE_FIELD_REQUIRED),
  ordered: yup.number(MESSAGE_NUMBER_REQUIRED),
});

const AdminCreateSectionPage = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  /********* API Area ********* */
  // const [tagItems, setTagItems] = useState([]);
  /********* END API Area ********* */
  const [isLoading, setIsLoading] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const resetValues = () => {
    reset();
  };

  const getMaxOrderedSectionByCourseId = async () => {
    try {
      const res = await axiosBearer.get(
        `${API_COURSE_URL}/${courseId}/section/max-ordered`
      );
      setValue(
        "ordered",
        res?.data > 0 ? res?.data + 1 : res?.data === 0 ? 1 : 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMaxOrderedSectionByCourseId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /********* Get Course ID from API  ********* */
  const handleSubmitForm = async (values) => {
    try {
      setIsLoading(!isLoading);
      const res = await axiosBearer.post(
        `${API_COURSE_URL}/${courseId}/section`,
        {
          ...values,
          courseId,
        }
      );
      toast.success(`${res.data.message}`);
      navigate(`/admin/courses/${courseId}/sections`);
    } catch (error) {
      showMessageError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create Section</HeadingH1Com>
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
              title: "Section",
              slug: `/admin/courses/${courseId}/sections`,
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
            <form
              className="theme-form"
              onSubmit={handleSubmit(handleSubmitForm)}
            >
              {/* <div className="card-header">
                <h5>Form Create Course</h5>
                <span>Lorem ipsum dolor sit amet consectetur</span>
              </div> */}
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <LabelCom htmlFor="name" isRequired>
                      Section Name
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="name"
                      register={register}
                      placeholder="Input section name"
                      errorMsg={errors.name?.message}
                    ></InputCom>
                  </div>

                  <div className="col-sm-6">
                    <LabelCom htmlFor="ordered">Ordered</LabelCom>
                    <InputCom
                      type="number"
                      control={control}
                      name="ordered"
                      register={register}
                      placeholder="Input section ordered"
                      errorMsg={errors.ordered?.message}
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

export default AdminCreateSectionPage;
