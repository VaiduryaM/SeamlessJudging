/* eslint-disable */
import { Button, Modal, Col, Row, Space, Card, Typography } from "antd";
import { Form, Input, Switch } from "antd";
import React, { useContext, useState } from "react";
import { LoginService } from "./Services/Login";
import { Navigate, useNavigate } from "react-router-dom";
import { NotificationHandler } from "./Notifications/NotificationHandler";
import { MainContext } from "../../Context/MainContext";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [passwordModal, setPasswordModal] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(MainContext);
  const [isJudge, setIsJudge] = useState(false);
  const { Text, Link } = Typography;

  const navigate = useNavigate();

  const handleUpdatePassword = async (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    values.email = localStorage.getItem("email");
    values.password = token;
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
        setPasswordModal(false);
        navigate("/home");
      }
    });
  };

  const onClickSignUp = () => {
    navigate("/signup");
  };
  const onForgotPassword = () => {
    navigate("/forgotPassword");
  };

  const navigateHome = (roles) => {
    setIsLoggedIn(true);
    navigate("/home");
  };

  if (
    isLoggedIn ||
    (!passwordModal &&
      localStorage.getItem("access_token") &&
      localStorage.getItem("access_token") != "undefined")
  ) {
    navigateHome();
  }

  const onLoginFinish = async (values) => {
    let body = {};

    if (!values.email && !isJudge) {
      alert("Please enter a valid email");
      return;
    }

    body.email = values.email;

    if (!values.password && !values.token) {
      alert("Please enter a valid password or token");
      return;
    }

    const passwordType = values.password ? "Password" : "Token";
    body.passwordType = passwordType;

    if (values.password) {
      body.password = values.password;
    }

    if (values.token) {
      body.token = values.token;
      setToken(values.token);
    }

    setLoading(true);

    const result = await LoginService(passwordType, body);
    if (result.status === 200) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      localStorage.setItem("email", values.email);
      localStorage.setItem("roles", JSON.stringify(result.data.roles));
      console.log("result.data ",result.data);
      if (passwordType === "Token" && !result.data.roles.includes("JUDGE")) {
        console.log("inside 105 setPasswordModal");
        setPasswordModal(true);
      } else {
        navigateHome(result.data.roles);
      }

      if (result.data.role === "JUDGE") {
        localStorage.setItem("eventId", result.data.eventId);
      }
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Set password"
        open={passwordModal}
        closable={false}
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
          colon={false}
          onFinish={handleUpdatePassword}
        >
          <Form.Item
            label="Password"
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
            label="Confirm Password"
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
                type="primary"
                htmlType="submit"
                style={{
                  background: "#F18F01",
                  width: "127px",
                }}
                loading={loading}
              >
                Proceed
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
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
              Log in to your account
            </div>
            <Card
              className="Border-Style sign-up-card"
              hoverable={true}
              extra={
                <Space>
                  <Text className="fw-600">Log In with token?</Text>
                  <Switch onChange={(checked) => setIsJudge(checked)} />
                </Space>
              }
            >
              <Form name="basic" autoComplete="off" onFinish={onLoginFinish}>
              {!isJudge?(
                <Form.Item
                  label={<label style={{ color: "#001529" }}> Email : </label>}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  name="email"
                  rules={[
                    {
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input className="Border-Style" allowClear />
                </Form.Item>
                ):(<></>)
              }
                {isJudge ? (
                  <Form.Item
                    label={
                      <label style={{ color: "#001529" }}> Token : </label>
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="token"
                    rules={[
                      {
                        message: "Please input your token!",
                      },
                    ]}
                  >
                    <Input.Password className="Border-Style" allowClear />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label={
                      <label style={{ color: "#001529" }}> Password : </label>
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    name="password"
                    rules={[
                      {
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password className="Border-Style" allowClear />
                  </Form.Item>
                )}
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
                      Log In
                    </Button>
                  </Space>
                </Form.Item>
                <Form.Item>
                  <Space direction="vertical">
                    <Text>
                      Don't have an account?
                      <Link
                        style={{ color: "#F18F01", marginLeft: "5px" }}
                        onClick={onClickSignUp}
                      >
                        Sign Up
                      </Link>
                    </Text>
                    {!isJudge && (
                      <Text>
                        Forgot password?
                        <Link
                          style={{ color: "#F18F01", marginLeft: "5px" }}
                          onClick={onForgotPassword}
                        >
                          Reset
                        </Link>
                      </Text>
                    )}
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
