import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { axiosBearer } from "../../../../api/axiosInstance";
import { ImageCropUploadAntCom } from "../../../../components/ant";
import { BreadcrumbCom } from "../../../../components/breadcrumb";
import { ButtonCom } from "../../../../components/button";
import GapYCom from "../../../../components/common/GapYCom";
import { HeadingH1Com } from "../../../../components/heading";
import { InputCom } from "../../../../components/input";
import { LabelCom } from "../../../../components/label";
import { TextAreaCom } from "../../../../components/textarea";
import {
  MAX_LENGTH_NAME,
  MESSAGE_FIELD_MAX_LENGTH_NAME,
  MESSAGE_FIELD_MIN_LENGTH_NAME,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_UPLOAD_REQUIRED,
  MIN_LENGTH_NAME,
} from "../../../../constants/config";
import { API_AUTHOR_URL } from "../../../../constants/endpoint";
import { showMessageError } from "../../../../utils/helper";

const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  title: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  information: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME),
  image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
});

const AdminCreateAuthorPage = () => {
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

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /********* Get Course ID from API  ********* */
  const handleSubmitForm = async (values) => {
    try {
      setIsLoading(!isLoading);
      const res = await axiosBearer.post(`${API_AUTHOR_URL}`, {
        ...values,
      });
      toast.success(`${res.data.message}`);
      navigate(`/admin/courses/authors`);
    } catch (error) {
      showMessageError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create Author</HeadingH1Com>
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
              title: "Author",
              slug: `/admin/courses/authors`,
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
        <div className="col-sm-6 offset-3">
          <div className="card">
            <form
              className="theme-form"
              onSubmit={handleSubmit(handleSubmitForm)}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <LabelCom htmlFor="name" isRequired>
                      Author Name
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="name"
                      register={register}
                      placeholder="Input author name"
                      errorMsg={errors.name?.message}
                    ></InputCom>
                  </div>
                  <div className="col-sm-6">
                    <LabelCom htmlFor="title" isRequired>
                      Title
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="title"
                      register={register}
                      placeholder="Input author title"
                      errorMsg={errors.title?.message}
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <LabelCom htmlFor="image" isRequired>
                      Avatar
                    </LabelCom>
                    <div className="w-full">
                      <ImageCropUploadAntCom
                        name="image"
                        onSetValue={setValue}
                        errorMsg={errors.image?.message}
                        aspect={4 / 4}
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
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <LabelCom htmlFor="information">Information</LabelCom>
                    <TextAreaCom
                      name="information"
                      control={control}
                      register={register}
                      placeholder="Write the information of author..."
                    ></TextAreaCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
              </div>
              <div className="card-footer flex justify-end gap-x-5">
                <ButtonCom
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
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

export default AdminCreateAuthorPage;
