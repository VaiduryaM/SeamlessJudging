import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, Space, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [sendOtp, setSendOtp] = useState(false);
  const [email, setEmail] = useState("");
  const { Text, Link } = Typography;
  const navigate = useNavigate();
  const onClickLogIn = () => {
    navigate("/login");
  };
  const handleSendOtp = async (values) => {
    // setSendOtp(true);
    setEmail(values.email);
    await fetch(
      process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/reset-password",
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(values),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status == 200) {
        setSendOtp(true);
      } else {
        alert("No user exists with below email.");
      }
    });
  };
  const handleResetPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    values.email = email;
    await fetch(
      process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/update-password",
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(values),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status == 200) {
        navigate("/login");
      }
    });
  };
  const handleWrongEmail = () => {
    setSendOtp(false);
  };
  return (
    <div style={{ backgroundColor: "#001529", height: "100vh" }}>
      <Row justify="space-around">
        <Col
          md={{ span: 12 }}
          sm={{ span: 12 }}
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
          className="mt-3"
        >
          <div className="mt-6" style={{ color: "white", fontSize: "20px" }}>
            <h2 className="text-xl text-white fw-300">
              Capstone Project Management
            </h2>
            <p className="text-small fw-200">
              One stop portal for instructors, clients, judges and students to
              manage different aspects of project management and development.
            </p>
          </div>
        </Col>
        <Col
          md={{
            span: 6,
            offset: 0,
          }}
          sm={12}
        >
          <div
            style={{
              textAlign: "center",
              margin: "50px 0px 2px 2px",
              color: "white",
              fontSize: "20px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            Reset password
          </div>
          {sendOtp ? (
            <Card title="Set New Password" className="Border-Style ">
              <Form onFinish={handleResetPassword}>
                <p>
                  A temporary password has been sent to your registered email.
                </p>
                <Form.Item
                  label={
                    <label style={{ color: "#001529" }}>
                      Temporary Password :
                    </label>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your temporary password",
                    },
                  ]}
                >
                  <Input.Password className="Border-Style" allowClear />
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ color: "#001529" }}> New Password : </label>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password",
                    },
                  ]}
                >
                  <Input.Password className="Border-Style" allowClear />
                </Form.Item>
                <Form.Item
                  label={
                    <label style={{ color: "#001529" }}>
                      {" "}
                      Confirm Password :{" "}
                    </label>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm password",
                    },
                  ]}
                >
                  <Input.Password className="Border-Style" allowClear />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{
                      background: "#F18F01",
                      width: "127px",
                    }}
                  >
                    Reset
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Text>Entered wrong email?</Text>
                    <Link
                      style={{ color: "#F18F01" }}
                      onClick={handleWrongEmail}
                    >
                      Go Back
                    </Link>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          ) : (
            <Card title="Confirm Email" className="Border-Style ">
              <Space direction="vertical">
                <Text>✦ We'll send you a temporary password.</Text>
                <Text>✦ Please confirm your email below.</Text>
              </Space>
              <Form onFinish={handleSendOtp}>
                <Form.Item
                  label={<label style={{ color: "#001529" }}> Email : </label>}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email",
                    },
                  ]}
                >
                  <Input className="Border-Style" allowClear />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{
                      background: "#F18F01",
                      width: "127px",
                    }}
                  >
                    Generate
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Text>Remember your password?</Text>
                    <Link style={{ color: "#F18F01" }} onClick={onClickLogIn}>
                      Log In
                    </Link>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
export default ForgotPassword;
