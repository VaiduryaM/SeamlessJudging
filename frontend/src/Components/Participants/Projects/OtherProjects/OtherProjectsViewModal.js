/* eslint-disable */ 
import React, { useEffect, useState } from "react";
import { Button, Modal, Checkbox, Form, Space, Tag, Descriptions } from "antd";
import {
  InfoCircleTwoTone,
  SettingTwoTone,
  StarTwoTone,
} from "@ant-design/icons";
import { getProjectDetailsById } from "../../../Common/Services/Projects/ProjectsService";
import { NotificationHandler } from "../../../Common/Notifications/NotificationHandler";

const OtherProjectsViewModal = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const showModal = () => {
    props.setShowOtherProjectsViewModal(true);
  };

  const handleCancel = () => {
    props.setShowOtherProjectsViewModal(false);
  };
  const populateProjectsDetails = async () => {
    const result = await getProjectDetailsById(props.requestInfo.projectId);
    if (result.status === 200) {
      setProjectDetails(result.data);
    } else {
      NotificationHandler(
        "failure",
        "Failed!",
        result.message
      );
    }
  };
  const downloadAttachment = async (content) => {
    const response = await fetch(
      process.env.REACT_APP_LOCAL_DB_URL +
        "/api/v1/content/download?path=" +
        `${content}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Token": localStorage.getItem("access_token"),
        },
      }
    );
    await response.blob();
  };
  useEffect(() => {
    populateProjectsDetails();
    setLoading(false);
  }, []);
  const joinButton = (
    <Button
      type="danger"
      onClick={() => {
        props.joinOnChangeButton(props.requestInfo.projectId);
        handleCancel();
      }}
    >
      Join
    </Button>
  );
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
            <InfoCircleTwoTone
              style={{ fontSize: "22px" }}
              twoToneColor="blue"
            />
            &nbsp; Project Information
          </p>
        }
        visible={props.showOtherProjectsViewModal}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={joinButton}
        width="80%"
      >
        <Descriptions size="small" bordered column={1}>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Name:</div>}
          >
            {projectDetails.name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Team Members:</div>}
          >
            <Space>
              {projectDetails && projectDetails.hasOwnProperty("team")
                ? projectDetails.team.map((obj) => {
                    return (
                      <Tag color="green">
                        {obj.first_name + " " + obj.last_name}
                      </Tag>
                    );
                  })
                : null}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Attachments:</div>}
          >
            <Space>
              {projectDetails && projectDetails.hasOwnProperty("attachments")
                ? projectDetails.attachments.map((obj) => {
                    return (
                      <Tag
                        color="orange"
                        onClick={() => {
                          downloadAttachment(obj.content);
                        }}
                      >
                        {obj.name === "" ? "attachment" : obj.name}
                      </Tag>
                    );
                  })
                : null}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Description:</div>}
          >
            {projectDetails.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default OtherProjectsViewModal;
