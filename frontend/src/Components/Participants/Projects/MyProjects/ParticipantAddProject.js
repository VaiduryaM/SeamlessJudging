/* eslint-disable */
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Col, Row, Space, Drawer, InputNumber } from "antd";
import { Form, Input, Select } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NotificationHandler } from "../../../Common/Notifications/NotificationHandler";
import { addNewProject } from "../../../Common/Services/Projects/ProjectsService";
const { Option } = Select;

const uploadFiles = (event) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event && event.fileList;
};

const ParticipantAddProject = (props) => {
  const [addProjectForm] = Form.useForm();
  const refData = props.refData;
  const onClose = () => {
    props.setShowAddProject(false);
  };

  const resetFields = () => {
    addProjectForm.resetFields();
  };
  const onFinish = async (values) => {
    const result = await addNewProject(values);
    if (result.status === 200) {
      resetFields();
      props.setShowAddProject(false);
      props.setRefresh(true);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  return (
    <Drawer
      title="Add Project"
      placement="right"
      width="40%"
      onClose={onClose}
      visible={props.setShowAddProject}
    >
      <Form layout="vertical" form={addProjectForm} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Project Name
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter user name",
                },
              ]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="project_type_id"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Project Type
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please select project type",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select the type of project"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                allowClear
              >
                {refData.projectTypesRefData.length
                  ? refData.projectTypesRefData.map((obj) => {
                      return (
                        <Option
                          value={obj.project_type_id}
                          key={obj.project_type_id}
                        >
                          {obj.project_type}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="course_code_id"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Course code
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please select Course code",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select course code"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                allowClear
              >
                {refData.courseCodeRefData.length
                  ? refData.courseCodeRefData.map((obj) => {
                      return (
                        <Option
                          value={obj.course_code_id}
                          key={obj.course_code_id}
                        >
                          {obj.code}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="client_name"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Client Name
                </div>
              }
            >
              <Input placeholder="Please enter client name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="client_company"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Client Company
                </div>
              }
            >
              <Input placeholder="Please enter client company" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="client_email"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Client Email
                </div>
              }
            >
              <Input placeholder="Please enter client email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="project_link"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Project Link
                </div>
              }
            >
              <Input placeholder="Please enter project link" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="team_size"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Team Size
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please select team size",
                },
              ]}
            >
              <InputNumber min={1} placeholder="size" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Description
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "please enter description",
                },
              ]}
            >
              <Input.TextArea
                rows={10}
                placeholder="please enter description"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="attachments"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Upload
                </div>
              }
              valuePropName="fileList"
              getValueFromEvent={uploadFiles}
            >
              <Upload
                beforeUpload={() => {
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>
                  Click to upload your files
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <br />
        <Row gutter={8}>
          <Space>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="danger" onClick={resetFields}>
                Reset
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    </Drawer>
  );
};

export default ParticipantAddProject;
