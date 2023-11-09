/* eslint-disable */ 
import React, { useContext, useState } from "react";
import { Button, Modal, Space, Input, Descriptions } from "antd";
import { InfoCircleTwoTone, MailOutlined } from "@ant-design/icons";
import { requestProjectById } from "../../Services/PartcipantServices";
import { NotificationHandler } from "../../../Common/Notifications/NotificationHandler";
import { authDetailsContext } from "../../../../App";
const { TextArea } = Input;
const ParticpantJoinRequest = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const authProps = useContext(authDetailsContext);
  const requestInfo = props.requestInfo;
  const setRequestInfo = props.setRequestInfo;
  const showModal = () => {
    setRequestInfo({ ...requestInfo, showRequestModal: true });
  };

  const handleCancel = () => {
    setRequestInfo({ ...requestInfo, showRequestModal: false });
    setRequestMsg("");
  };
  const handleSend = async () => {
    const payload = {
      request_type: requestInfo.requestType,
      requestor_remarks: requestMsg,
    };
    const result = await requestProjectById(requestInfo.projectId, payload);
    if (result.status === 200) {
      handleCancel();
      authProps.setAppRefresh(true);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const msgOnChange = (obj) => {
    setRequestMsg(obj.target.value);
  };

  return (
    <>
      <Modal
        title={
          <p
            style={{
              textAlign: "center",
              fontSize: "22px",
              color: "midnightblue",
            }}
          >
            <MailOutlined style={{ fontSize: "22px" }} twoToneColor="pink" />
            &nbsp; Requesting Admin
          </p>
        }
        visible={requestInfo.showRequestModal}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        onOk={handleSend}
        okText="Send"
        width="60%"
      >
        <h3 style={{color:'red'}}>Information:</h3>
        <p>{requestInfo.requestMsg}</p>
        <TextArea
          onChange={msgOnChange}
          value={requestMsg}
          placeholder="Please type your message here.."
        />
      </Modal>
    </>
  );
};

export default ParticpantJoinRequest;
