/* eslint-disable */
import React, { useState } from "react";
import { Button, Modal, Checkbox, Form, Input, Space } from "antd";
import { TrophyTwoTone } from "@ant-design/icons";
import ParticipantSignup from "./ParticipantSignup";
import { Link, useNavigate } from "react-router-dom";
import { LoginByRole } from "../../Common/Services/LoginByRole";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";

const ParticipantLogin = (props) => {
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [modalHeading, setModalHeading] = useState("Authentication");
  const navigate = useNavigate();

  const handleCancel = () => {
    props.setShowParticipantLogin(false);
  };
  const onFinish = async (values) => {
    setLoading(true);
    const result = await LoginByRole("PARTICIPANT", values);
    if (result.status === 200) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      props.setAuthDetails({ isAuthenticated: true, role: "PARTICIPANT" });
      navigate("/participant/projects", { replace: true });
    } else {
      NotificationHandler(
        "failure",
        "Failed!",
        result.message
      );
    }
    setLoading(false);
  };
  const onClickSignup = () => {
    setModalHeading("Signup");
    setShowSignup(true);
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
            <TrophyTwoTone style={{ fontSize: "22px" }} twoToneColor="gold" />
            &nbsp;{modalHeading}
          </p>
        }
        visible={props.showParticipantLogin}
        onCancel={handleCancel}
        footer={null}
      >
        {!showSignup ? (
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
              <Input allowClear />
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
                <Button type="primary" onClick={onClickSignup}>
                  Signup
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <ParticipantSignup
            setShowSignup={setShowSignup}
            setModalHeading={setModalHeading}
          />
        )}
      </Modal>
    </>
  );
};

export default ParticipantLogin;
