import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";
import axios from "axios";
import {  MESSAGE_UPLOAD_IMAGE_FAILED } from "../../constants/config";
import { toast } from "react-toastify";
import { IMG_BB_URL } from "../../constants/endpoint";

const ImageUploadCom = (props) => {
  const {
    register = () => {},
    control,
    onSetValue = () => {},
    name,
    errorMsg = "",
    children,
    ...rest
  } = props;

  const handleChange = async (e) => {
    const file = e.target.files;
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file[0]);
    try {
      const res = await axios({
        method: "POST",
        url: IMG_BB_URL,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imgUrl = res.data.data.url;
      if (!imgUrl) {
        toast.error(MESSAGE_UPLOAD_IMAGE_FAILED);
        return;
      }
      // CallBack
      onSetValue(name, imgUrl);
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <>
      <div className="form-input position-relative">
        <input
          type="file"
          id={name}
          className={`form-control tw-transition-all ${
            errorMsg &&
            errorMsg.length > 0 &&
            "is-invalid border-tw-danger text-tw-danger"
          }`}
          onChange={handleChange}
          //   {...register(name)}
          //   {...fields}
          {...rest}
        />
      </div>
      {errorMsg && errorMsg.length > 0 && (
        <span className="text-tw-danger text-sm">{errorMsg}</span>
      )}
    </>
  );
};

ImageUploadCom.propTypes = {
  //   control: PropTypes.any.isRequired,
  //   register: PropTypes.func.isRequired,
  onSetValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  errorMsg: PropTypes.string,
  children: PropTypes.node,
};
export default withErrorBoundary(ImageUploadCom, {
  FallbackComponent: ErrorCom,
});
