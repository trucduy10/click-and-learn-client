import { useEffect } from "react";
import { notification } from "antd";

const AlertAntCom = ({ type = "success", message = "Successfully" }) => {
  useEffect(() => {
    const openNotification = () => {
      notification[type]({
        message: message,
        placement: "topRight",
      });
    };

    openNotification();
  }, [type, message]);

  return null;
};

export default AlertAntCom;
