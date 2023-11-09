/* eslint-disable */ 
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import ParticipantLogin from "./ParticipantLogin";
import { Menu, Dropdown, Button, Form, Input, Space, Select } from "antd";
import { signUp } from "../Services/PartcipantServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
const { Option } = Select;

const ParticipantSignup = (props) => {
  const onFinish = async (values) => {
    Object.keys(values).forEach((key) => {
      if (values[key] === undefined) values[key] = "";
    });
    const result = await signUp(values);
    if (result.status === 200) {
      props.setShowSignup(false);
      props.setModalHeading("Authentication");
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const onCancel = () => {
    props.setShowSignup(false);
    props.setModalHeading("Authentication");
  };
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="First Name"
        name="first_name"
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input your firstname!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Middle Name"
        name="middle_name"
        rules={[
          {
            required: false,
            message: "Please input your middlename!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="last_name"
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input your lastname!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email Id"
        name="email"
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input your Email Id!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="danger" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ParticipantSignup;
