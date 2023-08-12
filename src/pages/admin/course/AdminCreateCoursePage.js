import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { axiosBearer } from "../../../api/axiosInstance";
import {
  ImageCropUploadAntCom,
  SelectDefaultAntCom,
  SelectSearchAntCom,
  SelectTagAntCom,
} from "../../../components/ant";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import GapYCom from "../../../components/common/GapYCom";
import { HeadingH1Com } from "../../../components/heading";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TextEditorQuillCom } from "../../../components/texteditor";
import {
  categoryItems,
  levelItems,
  MAX_LENGTH_NAME,
  MESSAGE_FIELD_INVALID,
  MESSAGE_FIELD_MAX_LENGTH_NAME,
  MESSAGE_FIELD_MIN_LENGTH_NAME,
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_GENERAL_FAILED,
  MESSAGE_NET_PRICE_HIGHER_PRICE,
  MESSAGE_NUMBER_POSITIVE,
  MESSAGE_NUMBER_REQUIRED,
  MESSAGE_UPLOAD_REQUIRED,
  MIN_LENGTH_NAME,
} from "../../../constants/config";
import {
  API_AUTHOR_URL,
  API_COURSE_URL,
  API_TAG_URL,
} from "../../../constants/endpoint";
import useOnChange from "../../../hooks/useOnChange";
import { convertStrMoneyToInt, showMessageError } from "../../../utils/helper";

const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(MESSAGE_FIELD_REQUIRED)
    .min(MIN_LENGTH_NAME, MESSAGE_FIELD_MIN_LENGTH_NAME)
    .max(MAX_LENGTH_NAME, MESSAGE_FIELD_MAX_LENGTH_NAME),
  status: yup.number().default(0),
  level: yup.number().default(0),
  image: yup.string().required(MESSAGE_UPLOAD_REQUIRED),
  category_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
  author_id: yup.string().required(MESSAGE_FIELD_REQUIRED),
  tags: yup.string().required(MESSAGE_FIELD_REQUIRED),
  price: yup
    .string()
    .nullable()
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, MESSAGE_NUMBER_POSITIVE),
  net_price: yup
    .string()
    .nullable()
    .typeError(MESSAGE_NUMBER_REQUIRED)
    .min(0, MESSAGE_NUMBER_POSITIVE),
  // duration: yup
  //   .number(MESSAGE_FIELD_REQUIRED)
  //   .typeError(MESSAGE_NUMBER_REQUIRED)
  //   .min(0, MESSAGE_NUMBER_POSITIVE),
});

const AdminCreateCoursePage = () => {
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
  /********* API State ********* */
  const [tagItems, setTagItems] = useState([]);
  const [authorItems, setAuthorItems] = useState([]);
  /********* END API State ********* */
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState(null);
  const [authorSelected, setAuthorSelected] = useState(null);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [achievementSelected, setAchievementSelected] = useState([]);
  const [description, setDescription] = useState("");
  const [price, handleChangePrice, setPrice] = useOnChange(0);
  const [net_price, handleChangeNetPrice, setNetPrice] = useOnChange(0);

  const resetValues = () => {
    setCategorySelected(null);
    setTagsSelected([]);
    setAchievementSelected([]);
    setDescription("");
    setPrice(0);
    setNetPrice(0);
    reset();
    getTags();
    getAuthors();
  };

  const handleSubmitForm = async (values) => {
    // if (image === "" || image[0] === undefined) {
    //   const imageSelector = document.querySelector('input[name="image"]');
    //   if (imageSelector) imageSelector.focus();
    //   toast.error(MESSAGE_GENERAL_FAILED);
    //   setError("image", { message: MESSAGE_UPLOAD_REQUIRED });
    //   setValue("image", null);
    // } else if
    if (convertStrMoneyToInt(net_price) > convertStrMoneyToInt(price)) {
      const netPriceSelector = document.querySelector(
        'input[name="net_price"]'
      );
      if (netPriceSelector) netPriceSelector.focus();
      toast.error(MESSAGE_GENERAL_FAILED);
      setError("net_price", { message: MESSAGE_NET_PRICE_HIGHER_PRICE });
    } else {
      try {
        setIsLoading(!isLoading);
        const fd = new FormData();
        fd.append(
          "courseJson",
          JSON.stringify({
            ...values,
            status: 0,
            price: convertStrMoneyToInt(price),
            net_price: convertStrMoneyToInt(net_price),
          })
        );
        // fd.append("file", image[0]);
        // const res = await axiosBearer.post(`/course`, fd, {
        //   headers: {
        //     "Content-type": "multipart/form-data",
        //   },
        // });
        const res = await axiosBearer.post(API_COURSE_URL, fd);
        toast.success(`${res.data.message}`);
        resetValues();
        navigate("/admin/courses");
      } catch (error) {
        showMessageError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTags = async () => {
    try {
      const res = await axiosBearer.get(`${API_TAG_URL}`);
      const newRes = res.data.map((item) => {
        const tagNames = item.name.split(" ");
        // ['Spring', 'Boot']
        const capitalLabelArr = tagNames.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        ); // slice 1 ký tự đầu);
        return {
          value: item.name.toLowerCase(),
          label: capitalLabelArr.join(" "),
        };
      });
      setTagItems(newRes);
    } catch (error) {
      showMessageError(error);
    }
  };

  const getAuthors = async () => {
    try {
      const res = await axiosBearer.get(`${API_AUTHOR_URL}`);
      const authors = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setAuthorItems(authors);
    } catch (error) {
      showMessageError(error);
    }
  };

  /********* Fetch API Area ********* */
  useEffect(() => {
    getTags();
    getAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /********* END Fetch API Area ********* */

  /********* Library Function Area ********* */
  const handleChangeCategory = (value) => {
    setValue("category_id", value);
    setError("category_id", { message: "" });
    setCategorySelected(value);
  };

  const handleChangeAuthor = (value) => {
    setValue("author_id", value);
    setError("author_id", { message: "" });
    setAuthorSelected(value);
  };

  // itemsArrs = ["PHP", "PROGRAMMING"]
  const handleChangeTags = (itemsArrs) => {
    const regex = /[,!@#$%^&*()+=[\]\\';./{}|":<>?~_]/;
    const hasSpecialChar = itemsArrs.some((item) => regex.test(item));
    // const hasComma = itemsArrs.some((item) => item.includes(","));
    if (hasSpecialChar) {
      toast.error("Invalid tag! Only accept: - for case special character");
      setValue("tags", "");
      setError("tags", { message: MESSAGE_FIELD_INVALID });
      return;
    }

    // Cut the space and - if more than one
    const strReplace = itemsArrs.map((item) =>
      item.replace(/\s+/g, " ").replace(/-+/g, "-").trim().toLowerCase()
    );
    const itemsString = strReplace.join(",").toLowerCase();

    setValue("tags", itemsString);
    setError("tags", { message: "" });
    setTagsSelected(itemsArrs);
  };

  // itemsArrs = ["PHP", "PROGRAMMING"]
  const handleChangeAchievements = (itemsArrs) => {
    // Cut the space and - if more than one
    const strReplace = itemsArrs
      .filter((item, index) => {
        if (item.includes(",")) {
          toast.error("Achievements not accept the Comma !");
          return false;
        }
        return true;
      })
      .map((item) => item.replace(/\s+/g, " "));
    const itemsString = strReplace.join(",");

    setValue("achievements", itemsString);
    setError("achievements", { message: "" });
    setAchievementSelected(itemsArrs);
  };

  // const handleChangeStatus = (value) => {
  //   setValue("status", value);
  //   setError("status", { message: "" });
  // };

  const handleChangeLevel = (value) => {
    setValue("level", value);
    setError("level", { message: "" });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create Course</HeadingH1Com>
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
                  <div className="col-sm-5">
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <LabelCom htmlFor="name" isRequired>
                          Course Name
                        </LabelCom>
                        <InputCom
                          type="text"
                          control={control}
                          name="name"
                          register={register}
                          placeholder="Input course's name"
                          errorMsg={errors.name?.message}
                        ></InputCom>
                      </div>
                      {/* <div className="col-sm-3">
                        <LabelCom htmlFor="status">Status</LabelCom>
                        <div>
                          <SelectDefaultAntCom
                            listItems={statusItems}
                            onChange={handleChangeStatus}
                            status={
                              errors.status && errors.status.message && "error"
                            }
                            errorMsg={errors.status?.message}
                            placeholder="Choose Status"
                            defaultValue={0}
                          ></SelectDefaultAntCom>
                          <InputCom
                            type="hidden"
                            control={control}
                            name="status"
                            register={register}
                            defaultValue={1}
                          ></InputCom>
                        </div>
                      </div> */}
                    </div>
                    <GapYCom className="mb-3"></GapYCom>
                    <div className="row">
                      <div className="col-sm-6">
                        <LabelCom htmlFor="price" subText="($)">
                          Price
                        </LabelCom>
                        <InputCom
                          type="text"
                          control={control}
                          name="price"
                          register={register}
                          placeholder="Input Price"
                          errorMsg={errors.price?.message}
                          onChange={handleChangePrice}
                          defaultValue={price}
                          value={price}
                        ></InputCom>
                      </div>
                      <div className="col-sm-6">
                        <LabelCom htmlFor="net_price" subText="($)">
                          Net Price
                        </LabelCom>
                        <InputCom
                          type="text"
                          control={control}
                          name="net_price"
                          register={register}
                          placeholder="Input Net Price"
                          errorMsg={errors.net_price?.message}
                          onChange={handleChangeNetPrice}
                          defaultValue={net_price}
                          value={net_price}
                        ></InputCom>
                      </div>
                    </div>
                    <GapYCom className="mb-3"></GapYCom>
                    <div className="row">
                      <div className="col-sm-4">
                        <LabelCom htmlFor="category_id" isRequired>
                          Category
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
                            placeholder="Search categories"
                          ></SelectSearchAntCom>
                          <InputCom
                            type="hidden"
                            control={control}
                            name="category_id"
                            register={register}
                          ></InputCom>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <LabelCom htmlFor="author_id" isRequired>
                          Author
                        </LabelCom>
                        <div>
                          <SelectSearchAntCom
                            selectedValue={authorSelected}
                            listItems={authorItems}
                            onChange={handleChangeAuthor}
                            className="w-full py-1"
                            status={
                              errors.author_id &&
                              errors.author_id.message &&
                              "error"
                            }
                            errorMsg={errors.author_id?.message}
                            placeholder="Search authors"
                          ></SelectSearchAntCom>
                          <InputCom
                            type="hidden"
                            control={control}
                            name="author_id"
                            register={register}
                          ></InputCom>
                        </div>
                        {/* <div>
                      <SelectDefaultAntCom
                        listItems={authors}
                        onChange={handleChangeLevel}
                      ></SelectDefaultAntCom>
                      <InputCom
                        type="hidden"
                        control={control}
                        name="level"
                        register={register}
                        defaultValue={0}
                      ></InputCom>
                    </div> */}
                      </div>
                      <div className="col-sm-4">
                        <LabelCom htmlFor="level" className="pb-[11px]">
                          Level
                        </LabelCom>
                        <div>
                          <SelectDefaultAntCom
                            listItems={levelItems}
                            onChange={handleChangeLevel}
                            defaultValue={0}
                          ></SelectDefaultAntCom>
                          <InputCom
                            type="hidden"
                            control={control}
                            name="level"
                            register={register}
                            defaultValue={0}
                          ></InputCom>
                        </div>
                      </div>
                    </div>
                    <GapYCom className="mb-3"></GapYCom>
                    <div className="row">
                      <div className="col-sm-12">
                        <LabelCom
                          htmlFor="tags"
                          isRequired
                          subText="'enter' every tags"
                          className="mb-1"
                        >
                          Tags
                        </LabelCom>
                        <SelectTagAntCom
                          listItems={tagItems}
                          selectedValue={tagsSelected}
                          onChange={handleChangeTags}
                          placeholder="Search or Input new Tags..."
                          status={errors.tags && errors.tags.message && "error"}
                          errorMsg={errors.tags?.message}
                        ></SelectTagAntCom>
                        <InputCom
                          type="hidden"
                          control={control}
                          name="tags"
                          register={register}
                        ></InputCom>
                      </div>
                      <GapYCom className="mb-3"></GapYCom>
                      <div className="col-sm-12">
                        <LabelCom
                          htmlFor="achievements"
                          subText="'enter' every achievement"
                          className="mb-1"
                        >
                          Achievement
                        </LabelCom>
                        <SelectTagAntCom
                          listItems={[]}
                          selectedValue={achievementSelected}
                          onChange={handleChangeAchievements}
                          placeholder="Input the achievement..."
                          status={
                            errors.achievements &&
                            errors.achievements.message &&
                            "error"
                          }
                          errorMsg={errors.achievements?.message}
                        ></SelectTagAntCom>
                        <InputCom
                          type="hidden"
                          control={control}
                          name="achievements"
                          register={register}
                        ></InputCom>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <LabelCom htmlFor="image" isRequired>
                          Image
                        </LabelCom>
                        {/* <InputCom
                          type="file"
                          control={control}
                          name="image"
                          register={register}
                          placeholder="Upload image"
                          errorMsg={errors.image?.message}
                        ></InputCom> */}
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
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <LabelCom htmlFor="description">Description</LabelCom>
                        <TextEditorQuillCom
                          value={description}
                          onChange={(description) => {
                            setValue("description", description);
                            setDescription(description);
                          }}
                          placeholder="Describe your course ..."
                          className="h-[215px]"
                        ></TextEditorQuillCom>
                      </div>
                    </div>
                  </div>
                </div>
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

export default AdminCreateCoursePage;
