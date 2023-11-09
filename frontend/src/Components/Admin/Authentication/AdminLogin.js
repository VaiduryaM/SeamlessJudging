/* eslint-disable */ 
import React, { useState } from "react";
import { Button, Modal, Checkbox, Form, Input, Space } from "antd";
import { SettingTwoTone } from "@ant-design/icons";
import { LoginByRole } from "../../Common/Services/LoginByRole";
import { useNavigate } from "react-router-dom";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";

const AdminLogin = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    props.setShowAdminLogin(true);
  };

  const handleCancel = () => {
    props.setShowAdminLogin(false);
  };
  const onFinish = async (values) => {
    setLoading(true);
    const result = await LoginByRole("ADMIN", values);
    if (result.status === 200) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      props.setAuthDetails({ isAuthenticated: true, role: "ADMIN" });
      navigate("/admin/projects", { replace: true });
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
            <SettingTwoTone style={{ fontSize: "22px" }} twoToneColor="#108ee9" />
            &nbsp; Authentication
          </p>
        }
        visible={props.showAdminLogin}
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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input allowClear/>
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
          >
            <Input.Password allowClear/>
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

export default AdminLogin;
