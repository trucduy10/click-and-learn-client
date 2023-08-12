import { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { IMG_BB_URL } from "../../constants/endpoint";
import PropTypes from "prop-types";
import { withErrorBoundary } from "react-error-boundary";
import ErrorCom from "../common/ErrorCom";
import "react-quill/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
Quill.register("modules/imageUploader", ImageUploader);

const TextEditorQuillCom = ({
  onChange = (value) => {},
  value = "",
  errorMsg = "",
  focus = false,
  placeholder = "Write your description...",
  className = "h-36",
  isUploadImage = true,
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.focus();
    }
  }, [focus]);

  const modules = useMemo(() => {
    const toolbar = [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ];
    if (isUploadImage) toolbar.push(["link", "image"]);
    return {
      toolbar,
      imageUploader: {
        upload: async (file) => {
          const fd = new FormData();
          fd.append("image", file);
          try {
            const res = await axiosInstance({
              method: "POST",
              url: IMG_BB_URL,
              data: fd,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            return res.data.data.url;
          } catch (error) {
            toast.error(error.message);
            return;
          }
        },
      },
    };
  }, [isUploadImage]);
  return (
    <>
      <style>{`
        .ql-error .ql-container {
          border: red solid 1px !important;
        }
        .ql-read-only .ql-container {
          background: #e9ecef !important;
        }
      `}</style>
      <ReactQuill
        ref={ref}
        modules={modules}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`break-all ${className} ${
          errorMsg?.length > 0 && "ql-error"
        } ${rest.readOnly && "ql-read-only"}`}
        {...rest}
      ></ReactQuill>
      {errorMsg?.length > 0 && (
        <span className="text-tw-danger text-sm">{errorMsg}</span>
      )}
    </>
  );
};

TextEditorQuillCom.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  errorMsg: PropTypes.string,
  focus: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  isUploadImage: PropTypes.bool,
};

export default withErrorBoundary(TextEditorQuillCom, {
  FallbackComponent: ErrorCom,
});
