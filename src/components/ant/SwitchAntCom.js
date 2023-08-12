import { Switch } from "antd";
import React from "react";

const SwitchAntCom = ({
  defaultChecked = false,
  onChange = (values) => {},
  textChecked = null,
  textUnChecked = null,
  className = "",
}) => {
  return (
    <Switch
      defaultChecked={defaultChecked}
      onChange={onChange}
      checkedChildren={textChecked}
      unCheckedChildren={textUnChecked}
      className={className}
    />
  );
};

export default SwitchAntCom;
