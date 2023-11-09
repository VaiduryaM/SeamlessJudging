import React, { useEffect, useState } from "react";
import { Space, Table, Card, Button, Modal } from "antd";
import { getRoutes } from "../../Common/Services/Projects/routes";
import { getAPIResponse } from "../../Common/Services/Projects/ProjectServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";

const EmailLog = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [emailLogs, setEmailLogs] = useState();
  const [recipient, setRecipient] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  const getEmailLogs = async () => {
    let url = getRoutes("getEmailLogs");
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setEmailLogs(res.data.response);
    } else {
      console.log(res);
      NotificationHandler("failure", "Failed", res.message);
    }
  };

  useEffect(() => {
    getEmailLogs();
  }, []);

  const columns = [
    {
      title: "Recipient",
      dataIndex: "name",
      key: "recipient",
    },
    {
      title: "Date",
      dataIndex: "dateSent",
      key: "date",
    },
    {
      title: "Subject",
      dataIndex: "emailSubject",
      key: "subject",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setRecipient(record.name);
              setDate(record.dateSent);
              setSubject(record.emailSubject);
              setBody(record.emailBody);
              setShowEmail(true);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={showEmail}
        onCancel={() => setShowEmail(false)}
        footer={null}
      >
        <p>
          {" "}
          <span style={{ fontWeight: "600" }}> Recipient: </span> {recipient}
        </p>
        <p>
          {" "}
          <span style={{ fontWeight: "600" }}> Date: </span> {date}
        </p>
        <p>
          {" "}
          <span style={{ fontWeight: "600" }}> Subject: </span> {subject}
        </p>
        <p align="justify">
          {" "}
          <div dangerouslySetInnerHTML={{ __html: body }} />{" "}
        </p>
      </Modal>
      <Card title="Email Logs" className="Border-Style" hoverable={true}>
        <Table
          columns={columns}
          dataSource={emailLogs}
          scroll={{
            y: "55vh",
          }}
        />
      </Card>
    </>
  );
};

export default EmailLog;
