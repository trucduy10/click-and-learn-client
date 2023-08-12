import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import * as yup from "yup";
import { BreadcrumbCom } from "../../../components/breadcrumb";
import { ButtonCom } from "../../../components/button";
import CardHeaderCom from "../../../components/common/card/CardHeaderCom";
import GapYCom from "../../../components/common/GapYCom";
import { HeadingH1Com } from "../../../components/heading";
import { IconCheckCom } from "../../../components/icon";
import { InputCom } from "../../../components/input";
import { LabelCom } from "../../../components/label";
import { TextEditorQuillCom } from "../../../components/texteditor";
import {
  MESSAGE_FIELD_REQUIRED,
  MESSAGE_NUMBER_POSITIVE, NOT_FOUND_URL
} from "../../../constants/config";
import { onPostQuestion } from "../../../store/admin/question/questionSlice";
import { convertSecondToDiffForHumans } from "../../../utils/helper";

/********* Validation for Section function ********* */
const schemaValidation = yup.object().shape({
  point: yup
    .string()
    .required(MESSAGE_FIELD_REQUIRED)
    .matches(/^\d+(\.\d+)?$/, MESSAGE_NUMBER_POSITIVE),
  description: yup.string().required(MESSAGE_FIELD_REQUIRED),
});

const AdminCreateQuestionPage = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseId, partId } = useParams();
  const { data } = useSelector((state) => state.course);
  const { parts } = useSelector((state) => state.part);
  const { questions, isLoading, isPostQuestionSuccess } = useSelector(
    (state) => state.question
  );

  const courseById = data?.find((item) => item.id === parseInt(courseId));
  const partById = parts?.find((item) => item.id === parseInt(partId));
  if (!courseById || !partById) navigate(NOT_FOUND_URL);
  const totalCurrentQuestionsPoint = questions.reduce(
    (acc, current) => acc + current.point,
    0
  );

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isPostQuestionSuccess)
      navigate(`/admin/courses/${courseId}/parts/${partId}/questions`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostQuestionSuccess]);

  /********* Get Course ID from API  ********* */
  const handleSubmitForm = (values) => {
    dispatch(
      onPostQuestion({
        ...values,
        partId: parseInt(partId),
      })
    );
  };

  /********* Library Function Area ********* */
  // Check isFinish a Part
  const isFinish =
    partById?.maxPoint - totalCurrentQuestionsPoint === 0 ? true : false;

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Admin Create Question</HeadingH1Com>
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
              <CardHeaderCom
                title={`Part ${partId}`}
                subText={`MaxPoint: ${
                  partById?.maxPoint
                }, Duration: ${convertSecondToDiffForHumans(
                  partById?.limitTime
                )}`}
                className="text-center text-tw-light-pink font-bold"
              />
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-9">
                    <div className="col-sm-12 text-center">
                      <LabelCom htmlFor="description" isRequired>
                        Quiz
                      </LabelCom>
                      <TextEditorQuillCom
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
                      ></TextEditorQuillCom>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    {/* <div className="col-sm-12">
                      <LabelCom htmlFor="name">Question Name</LabelCom>
                      <InputCom
                        type="text"
                        control={control}
                        name="name"
                        register={register}
                        placeholder={MESSAGE_READONLY}
                        defaultValue={fakeName("QUIZ", parts?.[0]?.id + 1)}
                        readOnly
                      ></InputCom>
                    </div>
                    <GapYCom className="mb-3" /> */}
                    <div className="col-sm-12">
                      <LabelCom
                        htmlFor="point"
                        subText={`max = ${partById?.maxPoint}, current = ${
                          totalCurrentQuestionsPoint ?? 0
                        }`}
                        isRequired
                      >
                        Point
                      </LabelCom>
                      <InputCom
                        type="text"
                        control={control}
                        name="point"
                        register={register}
                        placeholder={`Still remaining ${
                          partById?.maxPoint - totalCurrentQuestionsPoint
                        } point to finish this part`}
                        errorMsg={errors.point?.message}
                        readOnly={isFinish}
                      ></InputCom>
                    </div>
                  </div>
                </div>
                <GapYCom className="mb-3"></GapYCom>
              </div>
              <div className="card-footer flex justify-end gap-x-5">
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

export default AdminCreateQuestionPage;
