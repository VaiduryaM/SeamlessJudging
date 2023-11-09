import React, { useEffect, useState } from "react";
import { Space, Table, Button, Card, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { getRoutes } from "../../Common/Services/Projects/routes";
import { getAPIResponse } from "../../Common/Services/Projects/ProjectServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import InsModalComp from "../InsModalComp";
import { DeleteOutlined, FileAddOutlined } from "@ant-design/icons";

const EmailTemplates = () => {
  const navigate = useNavigate();
  const [emailTemplates, setEmailTemplates] = useState();
  const [templateIds, setTemplateIds] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  // let deleteIds;
  const deleteTemplate = async () => {
    let url = getRoutes("deleteEmailTemplate");
    let body = {
      emailTemplateIds: deleteIds,
    };
    let res = await getAPIResponse(url, "DELETE", body);
    if (res.status == 200) {
      NotificationHandler("success", "Success!", res.message);
      getEmailTemplates();
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  const getEmailTemplates = async () => {
    let url = getRoutes("getEmailTemplates");
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      // setEmailTemplates(res.data.response);
      setEmailTemplates(
        res.data.response.map((obj, index) => {
          return {
            key: index,
            templateId: obj.emailTemplateId,
            title: obj.title,
            emailBody: obj.emailBody,
            emailSubject: obj.emailSubject,
          };
        })
      );
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  useEffect(() => {
    getEmailTemplates();
  }, []);

  const columns = [
    {
      title: "Template Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Subject",
      dataIndex: "emailSubject",
      key: "emailSubject",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() =>
              navigate("/ins/emailTemplate", {
                state: {
                  type: "update",
                  id: record.templateId,
                  title: record.title,
                  subject: record.emailSubject,
                  body: record.emailBody,
                },
              })
            }
          >
            {" "}
            View{" "}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="Border-Style"
      title="Email Templates"
      hoverable={true}
      extra={
        <Space>
          <Tooltip title="Add Template" placement="bottom">
            <Button
              onClick={() =>
                navigate("/ins/emailTemplate", {
                  state: {
                    type: "add",
                  },
                })
              }
              style={{ marginRight: "10px" }}
              icon={<FileAddOutlined />}
            ></Button>
          </Tooltip>
          <InsModalComp
            buttonIcon={<DeleteOutlined />}
            buttonType={"primary"}
            modalText={"Are you sure you want to delete item(s)?"}
            onOkFunc={deleteTemplate}
            toolTipText={"Delete Template(s)"}
            isDanger={true}
            somethingSelected={deleteIds.length == 0}
          />
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={emailTemplates}
        rowSelection={{
          type: "checkbox",
          onChange: (_, rows) => {
            setDeleteIds(rows.map((obj) => obj.templateId));
          },
        }}
        scroll={{
          y: "55vh",
        }}
      />
    </Card>
  );
};

export default EmailTemplates;
