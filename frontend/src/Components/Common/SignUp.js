/* eslint-disable */
import { Button, Card, Col, Row, Space } from "antd";
import { Form, Input, Select } from "antd";
import React, { useState } from "react";
import { SignUpService } from "./Services/SignUp";
import { useNavigate } from "react-router-dom";
import { NotificationHandler } from "./Notifications/NotificationHandler";
const { Option } = Select;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const onClickLogIn = () => {
    navigate("/login");
  };

  const onSignUpFinish = async (values) => {
    setLoading(true);
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = await SignUpService(values);
    if (result.status === 200) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      localStorage.setItem("roles", JSON.stringify([result.data.role]));
      localStorage.setItem("email", values.email);
      navigate("/profile", {
        state: { role: values.role },
      });
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };

  const validateEmail = (e) => {
    if (!selectedRole) {
      setEmailError("Please select a role");
      setStatus("error");
    } else if (selectedRole === "Student") {
      let email = e.target.value;
      let regex = new RegExp("[a-z0-9]+@buffalo.edu");

      if (!email.match(regex)) {
        setEmailError("Please use your buffalo email id");
        setStatus("error");
      } else {
        setEmailError("");
        setStatus("success");
      }
    } else {
      setEmailError("");
      setStatus("");
    }
  };
  return (
    <>
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
                margin: "50px 0px 2px 3px",
                // marginTop: "50px",
                color: "white",
                fontSize: "20px",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              Create a new account
            </div>
            <Card className="Border-Style sign-up-card" hoverable="true">
              <Space>
                <Form
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 12,
                  }}
                  autoComplete="off"
                  colon={false}
                  onFinish={onSignUpFinish}
                >
                  <Form.Item
                    name="role"
                    label={<label style={{ color: "#001529" }}> Role : </label>}
                    rules={[
                      {
                        required: true,
                        message: "Please select a role",
                      },
                    ]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Select
                      placeholder="Sign up as a"
                      popupClassName="Border-Style"
                      onChange={(_, option) => {
                        setStatus("");
                        setEmailError("");
                        setSelectedRole(option.value);
                      }}
                    >
                      <Option value="Client">Client</Option>
                      <Option value="Student">Student</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={
                      <label style={{ color: "#001529" }}> Email : </label>
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                        type: "email",
                      },
                    ]}
                    hasFeedback
                    validateStatus={status}
                    help={emailError}
                  >
                    <Input
                      onChange={(e) => validateEmail(e)}
                      className="Border-Style"
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <label style={{ color: "#001529" }}> Password : </label>
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password className="Border-Style" allowClear />
                  </Form.Item>

                  <Form.Item
                    label={
                      <label style={{ color: "#001529" }}> Confirm : </label>
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                    ]}
                  >
                    <Input.Password className="Border-Style" allowClear />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        htmlType="submit"
                        style={{
                          background: "#F18F01",
                          width: "127px",
                        }}
                        loading={loading}
                      >
                        Sign Up
                      </Button>
                    </Space>
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      span: 24,
                    }}
                  >
                    <Space style={{ color: "#001529" }}>
                      {" "}
                      Already have an account?{" "}
                      <a style={{ color: "#F18F01" }} onClick={onClickLogIn}>
                        {" "}
                        Log In{" "}
                      </a>{" "}
                    </Space>
                  </Form.Item>
                </Form>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SignUp;
