import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import * as yup from "yup";
import { CheckBoxAntCom } from "../../../components/ant";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import CardHeaderCom from "../../../components/common/card/CardHeaderCom";
import GapYCom from "../../../components/common/GapYCom";
import { HeadingH1Com } from "../../../components/heading";
import { IconCheckCom } from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import {
  MESSAGE_FIELD_REQUIRED,
  NOT_FOUND_URL,
} from "../../../constants/config";
import useOnChangeCheckBox from "../../../hooks/useOnChangeCheckBox";
import { onPostAnswer } from "../../../store/admin/answer/answerSlice";
import { fakeName, sliceText } from "../../../utils/helper";

/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  description: yup.string().required(MESSAGE_FIELD_REQUIRED),
});

const AdminCreateAnswerPage = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseId, partId, questionId } = useParams();
  const { data } = useSelector((state) => state.course);
  const { parts } = useSelector((state) => state.part);
  const { questions, isLoading } = useSelector((state) => state.question);
  const { answers } = useSelector((state) => state.answer);
  const { isPostAnswerSuccess } = useSelector((state) => state.answer);
  useEffect(() => {
    answers?.length > 0
      ? setValue("correct", false)
      : setValue("correct", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const courseById = data?.find((item) => item.id === parseInt(courseId));
  const partById = parts?.find((item) => item.id === parseInt(partId));
  const questionById = questions?.find(
    (item) => item.id === parseInt(questionId)
  );
  const [isCorrect, handleChangeCorrect] = useOnChangeCheckBox(
    setValue,
    "correct",
    answers?.length > 0 ? false : true
  );

  if (!courseById || !partById || !questionById) navigate(NOT_FOUND_URL);

  useEffect(() => {
    if (isPostAnswerSuccess)
      navigate(
        `/admin/courses/${courseId}/parts/${partId}/questions/${questionId}/answers`
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostAnswerSuccess]);

  /********* Get Course ID from API  ********* */
  const handleSubmitForm = (values) => {
    dispatch(
      onPostAnswer({
        ...values,
        correct: values?.correct ?? false,
        questionId: parseInt(questionId),
      })
    );
  };

  const isFinish = answers?.length >= 4 ? true : false;
  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create Answer</HeadingH1Com>
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
              title: "Question",
              slug: `/admin/courses/${courseId}/parts/${partId}/questions`,
            },
            {
              title: "Answer",
              slug: `/admin/courses/${courseId}/parts/${partId}/questions/${questionId}/answers`,
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
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <CardHeaderCom
                title={fakeName("QUIZ", questionId)}
                subText={sliceText(questionById?.description, 200)}
                className="text-center text-tw-light-pink font-bold"
              />
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="flex items-center justify-between">
                      <LabelCom htmlFor="description" isRequired>
                        Answer
                      </LabelCom>
                      <CheckBoxAntCom
                        onChange={handleChangeCorrect}
                        isChecked={isCorrect}
                      >
                        Correct
                      </CheckBoxAntCom>
                    </div>
                    <InputCom
                      type="text"
                      control={control}
                      name="description"
                      register={register}
                      placeholder={
                        isFinish
                          ? "This quiz have enough answers already"
                          : answers?.length > 0
                          ? "Input the wrong answer"
                          : "Input the correct answer"
                      }
                      readOnly={isFinish}
                      errorMsg={errors.description?.message}
                    ></InputCom>
                    {/* <TextEditorQuillCom
                        value={description}
                        readOnly={isFinish}
                        onChange={(description) => {
                          if (description === "<p><br></p>") {
                            setValue("description", "");
                            setDescription("");
                            setError("description", {
                              type: "required",
                              message: MESSAGE_FIELD_REQUIRED,
                            });
                          } else {
                            setValue("description", description);
                            setError("description", null);
                            setDescription(description);
                          }
                        }}
                        placeholder="Write your quiz ..."
                        errorMsg={errors.description?.message}
                      ></TextEditorQuillCom> */}
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
              </div>
              <div className="card-footer flex justify-end gap-x-5">
                {/* <ButtonCom type="submit" isLoading={isLoading} >
                  Create
                </ButtonCom> */}
                <ButtonCom
                  type={isFinish ? "button" : "submit"}
                  isLoading={isLoading}
                  backgroundColor={isFinish ? "finish" : "primary"}
                  icon={isFinish ? <IconCheckCom /> : ""}
                >
                  {isFinish ? "Finish" : "Create"}
                </ButtonCom>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCreateAnswerPage;
