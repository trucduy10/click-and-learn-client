import React from "react";
import { IconUserCom } from "../../icon";

const CardItemModalCom = ({
  title = "",
  icon = <IconUserCom />,
  classNameIcon = "",
  children,
}) => {
  return (
    <div className="media p-0 items-center">
      <div className={`media-left ${classNameIcon}`}>
        {/* Icon Revenue */}
        {/* <i className="icofont icofont-crown" /> */}
        {icon}
      </div>
      <div className="media-body">
        <h6>{title}</h6>
        <p className="!text-tw-light-green">{children}</p>
      </div>
    </div>
  );
};

export default CardItemModalCom;
