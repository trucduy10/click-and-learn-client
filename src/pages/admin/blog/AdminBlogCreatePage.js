import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

import { colors } from "@mui/material";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { axiosBearer } from "../../../api/axiosInstance";
import { TextEditorQuillCom } from "../../../components/texteditor";
import {
  ImageCropUploadAntCom,
  SelectSearchAntCom,
} from "../../../components/ant";
import { ButtonCom } from "../../../components/button";
import { LabelCom } from "../../../components/label";
import { InputCom } from "../../../components/input";
import GapYCom from "../../../components/common/GapYCom";
import { showMessageError } from "../../../utils/helper";
import { HeadingH1Com } from "../../../components/heading";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_UPLOAD_REQUIRED,
  categoryItems,
} from "../../../constants/config";
import { onPostBlog } from "../../../store/admin/blog/blogSlice";
import Swal from "sweetalert2";
/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  // name: yup.string().required(MESSAGE_FIELD_REQUIRED),
  // description: yup.string().required(MESSAGE_FIELD_REQUIRED),
  // status: yup.number().default(2),
  // image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
  // category_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
});
const AdminBlogCreatePage = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isPostBlogSuccess } = useSelector((state) => state.adminBlog);
  /********* API Area ********* */
  // const [tagItems, setTagItems] = useState([]);
  /********* END API Area ********* */
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [categorySelected, setCategorySelected] = useState(null);
  const [description, setDescription] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(true);

  const resetValues = () => {
    reset();
    setCategorySelected(null);
    setDescription("");
  };

  useEffect(() => {
    if (isPostBlogSuccess) navigate("/admin/blogs");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostBlogSuccess]);

  const handleSubmitForm = (values) => {
    dispatch(
      onPostBlog({
        ...values,
        user_id: user?.id,
        status: 2,
        view_count: 0,
      })
    );
  };

  /********* Library Function Area ********* */
  const handleChangeCategory = (value) => {
    setValue("category_id", value);
    setError("category_id", { message: "" });
    setCategorySelected(value);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Create Blog</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Admin",
              slug: "/admin",
            },
            {
              title: "Blog",
              slug: "/admin/blogs",
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
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <LabelCom htmlFor="name" isRequired>
                      Title
                    </LabelCom>
                    <InputCom
                      type="text"
                      control={control}
                      name="name"
                      register={register}
                      placeholder="Input title"
                      errorMsg={errors.name?.message}
                    ></InputCom>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-2 offset-5 text-center">
                    <LabelCom htmlFor="category_id" isRequired>
                      Blog Category
                    </LabelCom>
                    <div>
                      <SelectSearchAntCom
                        selectedValue={categorySelected}
                        listItems={categoryItems}
                        onChange={handleChangeCategory}
                        className="w-full py-1"
                        status={
                          errors.category_id &&
                          errors.category_id.message &&
                          "error"
                        }
                        errorMsg={errors.category_id?.message}
                        placeholder="Input category to search"
                      ></SelectSearchAntCom>
                      <InputCom
                        type="hidden"
                        control={control}
                        name="category_id"
                        register={register}
                      ></InputCom>
                    </div>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <LabelCom htmlFor="image" isRequired>
                      Image
                    </LabelCom>
                    <div className="w-full">
                      <ImageCropUploadAntCom
                        name="image"
                        onSetValue={setValue}
                        errorMsg={errors.image?.message}
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
                <div className="row text-center">
                  <LabelCom htmlFor="description" isRequired>
                    Content
                  </LabelCom>
                  <TextEditorQuillCom
                    value={description}
                    onChange={(newDescription) => {
                      setValue("description", newDescription);
                      setDescription(newDescription);
                      setIsDescriptionEmpty(newDescription.trim() === "");
                    }}
                    placeholder={
                      isDescriptionEmpty ? "Write your content ..." : ""
                    }
                    className="h-[500px]"
                  />
                </div>
                <div className="mt-10" style={{ color: "red" }}>
                  {errors.description?.message}
                </div>
                <GapYCom className="mb-3"></GapYCom>
              </div>
              <div className="card-footer flex justify-end gap-x-5">
                <ButtonCom type="submit" isLoading={isLoading}>
                  Create
                </ButtonCom>
                {/* <ButtonCom
                  backgroundColor="danger"
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      html: `You will reset all content you have input already - <span class="text-tw-success">Image still will keep</span>`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#7366ff",
                      cancelButtonColor: "#dc3545",
                      confirmButtonText: "Yes, please reset!",
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        resetValues();
                      }
                    });
                  }}
                >
                  Reset
                </ButtonCom> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBlogCreatePage;
