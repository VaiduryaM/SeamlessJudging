//function to get title with a back arrow icon

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Space } from "antd";
import React from "react";

export const GetTitle = ({ onClick, title }) => {
  return (
    <>
      <Space>
        <ArrowLeftOutlined title="Go back" onClick={() => onClick(-1)} />
        <span>{title}</span>
      </Space>
    </>
  );
};
