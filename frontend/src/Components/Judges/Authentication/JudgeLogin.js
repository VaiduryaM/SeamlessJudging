/* eslint-disable */

import React, { useState } from "react";
import { Button, Modal, Checkbox, Form, Input, Space } from "antd";
import { SettingTwoTone, StarTwoTone } from "@ant-design/icons";
import { LoginByRole } from "../../Common/Services/LoginByRole";
import { useNavigate } from "react-router-dom";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";

const JudgeLogin = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    props.setShowJudgeLogin(true);
  };

  const handleCancel = () => {
    props.setShowJudgeLogin(false);
  };
  const onFinish = async (values) => {
    setLoading(true);
    const result = await LoginByRole("JUDGE", values);
    if (result.status === 200) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      props.setAuthDetails({ isAuthenticated: true, role: "JUDGE" });
      navigate("/judge", { replace: true });
    } else {
      NotificationHandler(
        "failure",
        "Failed!",
        result.message
      );
    }
    setLoading(false);
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
            <StarTwoTone style={{ fontSize: "22px" }} twoToneColor="red" />
            &nbsp; Authentication
          </p>
        }
        visible={props.showJudgeLogin}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 12,
          }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="Access Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input your access code!",
              },
            ]}
          >
            <Input.Password allowClear />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 8,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default JudgeLogin;
