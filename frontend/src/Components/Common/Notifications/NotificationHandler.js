/* eslint-disable */
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import React from "react";

export const NotificationHandler = (type, msg, desc) => {
  switch (type) {
    case "success":
      notification.open({
        message: msg,
        description: desc,
        icon: (
          <CheckCircleOutlined
            style={{
              color: "#87d068",
            }}
          />
        ),
        placement: "bottomRight",
        className: "Border-Style",
      });
      break;
    case "failure":
      notification.open({
        message: msg,
        description: desc,
        icon: (
          <CloseCircleOutlined
            style={{
              color: "#ff4d4f",
            }}
          />
        ),
        placement: "bottomRight",
        className: "Border-Style",
      });
      break;
    case "info":
      notification.open({
        message: msg,
        description: desc,
        icon: (
          <CloseCircleOutlined
            style={{
              color: "#108ee9",
            }}
          />
        ),
        placement: "bottomRight",
        className: "Border-Style",
      });
      break;
  }
};
