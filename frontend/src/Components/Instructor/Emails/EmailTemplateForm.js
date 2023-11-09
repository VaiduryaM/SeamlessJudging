import { Card, Form, Input, Select, Button, Col, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoutes } from "../../Common/Services/Projects/routes";
import { getAPIResponse } from "../../Common/Services/Projects/ProjectServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { GetTitle } from "../../Common/Utils/GetTitle";

const { Option } = Select;
const EmailTemplateForm = () => {
  const [selectedKeyword, setSelectedKeyword] = useState();
  let navigate = useNavigate();
  let template = useLocation();
  var beautify_html = require("js-beautify").html;
  let formType = template.state.type;
  let templateId = "";
  let templateTitle = "";
  let templateSubject = "";
  let templateBody = "";

  if (formType == "update") {
    templateId = template.state.id;
    templateTitle = template.state.title;
    templateSubject = template.state.subject;
    templateBody = beautify_html(template.state.body);
  }

  const onFinish = async (values) => {
    let url = "";
    if (formType == "update") {
      url = getRoutes("updateEmailTemplate");
      values.emailTemplateId = templateId;
    } else {
      url = getRoutes("addEmailTemplate");
    }
    let body = values;
    let res = await getAPIResponse(url, "POST", body);
    if (res.status == 200) {
      NotificationHandler("success", "Success!", res.message);
      navigate("/ins/emailTemplates");
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };
  const alternateCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log(err);
    }
    document.body.removeChild(textArea);
  };

  const copy = () => {
    if (selectedKeyword !== "" && window.isSecureContext) {
      navigator.clipboard.writeText(String(selectedKeyword));
    } else {
      alternateCopy(selectedKeyword);
    }
  };

  return (
    <>
      <Card
      title={<GetTitle title={"Email Template"} onClick={navigate} />}
      className="Border-Style"
      hoverable="true"
      >
        <Col>
          <Form
            name="email-template-form"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 12 }}
            labelAlign="left"
            autoComplete="off"
            initialValues={{
              title: templateTitle,
              subject: templateSubject,
              body: templateBody,
            }}
            onFinish={onFinish}
          >
            <Row>
              <Col span={8}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Keyword</label>}
                  name="keyword"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    {
                      message: "Please select the keyword",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select keyword"
                    onChange={(e) => setSelectedKeyword(e)}
                    popupClassName="Border-Style"
                  >
                    <Option value="{~User Name~}">User Name</Option>
                    <Option value="{~User Details~}">User Details</Option>
                    <Option value="{~Token~}">Token</Option>
                    <Option value="{~User Roles~}">User Roles</Option>
                    <Option value="{~Student Projects~}">
                      Student Projects
                    </Option>
                    <Option value="{~Client Projects~}">Client Projects</Option>
                    <Option value="{~Events~}">Events</Option>
                    <Option value="{~Judge Events~}">Judge Events</Option>
                    <Option value="{~Judge Projects~}">Judge Projects</Option>
                    <Option value="{~Instructor Details~}">
                      Instructor Details
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button onClick={copy}> Copy to clipboard </Button>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Template</label>}
                  name="title"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    {
                      message: "Please enter template name",
                    },
                  ]}
                >
                  <Input className="Border-Style" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Subject</label>}
                  name="subject"
                  wrapperCol={{ span: 20 }}
                >
                  <Input className="Border-Style" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Body</label>}
                  style={{ color: "red" }}
                  name="body"
                  wrapperCol={{ span: 20 }}
                >
                  <TextArea className="Border-Style" rows={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label=" "
                  colon={false}
                  name="save"
                  wrapperCol={{ span: 20 }}
                >
                  <Button htmlType="submit" type="primary">
                    {" "}
                    Save Template{" "}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Card>
    </>
  );
};

export default EmailTemplateForm;
