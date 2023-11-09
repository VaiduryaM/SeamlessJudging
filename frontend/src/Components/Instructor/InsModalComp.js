import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
const { confirm } = Modal;
const showDeleteConfirm = (onOkFunc, modalText, extraParam) => {
  confirm({
    title: modalText,
    icon: <ExclamationCircleOutlined />,
    content: "Please confirm",
    okText: "Yes",
    cancelText: "No",
    className: "Border-Style",
    onOk() {
      {
        onOkFunc(extraParam);
      }
    },
    onCancel() {},
  });
};
const InsModalComp = ({
  buttonShape,
  buttonType,
  buttonIcon,
  buttonText,
  buttonDisabled,
  isDanger,
  modalText,
  onOkFunc,
  somethingSelected,
  toolTipText,
  size,
  extraParam,
}) => {
  return (
    <div>
      <Tooltip title={toolTipText} placement="bottom">
        <Button
          className="Border-Style"
          onClick={(e) => {
            e.stopPropagation();
            if (somethingSelected) {
              NotificationHandler(
                "info",
                "Information!",
                "Select row(s) to proceed with the action"
              );
            } else {
              showDeleteConfirm(onOkFunc, modalText, extraParam);
            }
          }}
          type={buttonType}
          danger={isDanger}
          shape={buttonShape}
          icon={buttonIcon}
          size={size}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </Tooltip>
    </div>
  );
};

export default InsModalComp;
