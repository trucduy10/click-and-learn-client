import React from "react";
import { Dropdown, Space } from "antd";
import { ButtonCom } from "../button";
import { IconArrowDownCom } from "../icon";

const DropdownAntCom = ({ items = [], title = "More Actions" }) => {
  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottom"
        >
          <ButtonCom backgroundColor="success" className="px-3 text-sm">
            <div className="flex gap-x-1 items-center">
              <div className="flex-1">{title}</div>
              <IconArrowDownCom></IconArrowDownCom>
            </div>
          </ButtonCom>
        </Dropdown>
      </Space>
    </Space>
  );
};

export default DropdownAntCom;
