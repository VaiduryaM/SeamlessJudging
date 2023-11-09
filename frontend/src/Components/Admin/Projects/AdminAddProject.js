/* eslint-disable */ 
import {
  SecurityScanOutlined,
  UploadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Upload, Col, Row, Space, Drawer } from "antd";
import { Form, Input, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
const { Option } = Select;

const AdminAddProject = (props) => {
  const [addProjectForm] = Form.useForm();
  const onClose = () => {
    props.setShowAddProject(false);
  };
  const onFinish = (values) => {
    //console.log(values);
  };
  const resetFields = () => {
    addProjectForm.resetFields();
  };
  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }

  return (
    <Drawer
      title="Add Project"
      placement="right"
      width="35%"
      onClose={onClose}
      visible={props.setShowAddProject}
    >
      <Form
        layout="vertical"
        form={addProjectForm}
        hideRequiredMark
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Name
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
              name="location"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Location
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter location",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
                placeholder="Please enter location"
              />
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
                  message: "please enter url description",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="please enter url description"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="judges"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Judges
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please select Judges",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                defaultValue={["Alex", "John"]}
              >
                {children}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sponsors"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Sponsors
                </div>
              }
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                defaultValue={["a10", "c12"]}
              >
                {children}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="projects"
              label={
                <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                  Projects
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please select Projects",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                defaultValue={["Alex", "John"]}
              >
                {children}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Upload>
              <Button icon={<UploadOutlined />}>Upload attachments</Button>
            </Upload>
          </Col>
        </Row>
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

export default AdminAddProject;
