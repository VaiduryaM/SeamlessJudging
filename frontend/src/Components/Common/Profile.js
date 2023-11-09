import React, { useState, useEffect } from "react";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons/";
import { Card, Button, Form, Input, Row, Col, Image, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  let navigate = useNavigate();
  const location = useLocation();
  let role = location.state.role;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState();
  const [imageSrc, setImageSrc] = useState("");

  const onFileChange = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
    };
  };
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/profile", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        setFormData(res.data.response_data);
        setImageSrc(res.data.response_data.image);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const imageField = document.querySelector('input[type="file"]');

  const handleSubmit = async (values) => {
    let sendFormData = new FormData();
    let formKeys = Object.keys(values);

    formKeys.forEach((item) => {
      sendFormData.append(item, values[item]);
    });
    sendFormData.append("image", imageField && imageField.files[0]);
    let statusCode, msg, result;
    await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/profile", {
      method: "POST",
      mode: "cors",
      body: sendFormData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Token": localStorage.getItem("access_token"),
        // "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((data) => {
        if (
          data.hasOwnProperty("response_str") &&
          data.hasOwnProperty("response_data")
        ) {
          statusCode = 200;
          msg = data.response_str;
          result = data.response_data;
          navigate("/home");
          setTimeout(() => {
            navigate(0);
          }, 1000);
        } else {
          statusCode = 400;
          msg = data.error.message;
          result = data;
        }
      })
      .catch((e) => {
        console.log("Error - " + e);
      });
    return { status: statusCode, data: result, message: msg };
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" indicator={<LoadingOutlined />} tip="Loading..." />
        </div>
      ) : (
        <div>
          {formData && (
            <Row justify="center" align="middle">
              <Card
                className="Border-Style"
                hoverable={true}
                title="Profile Details"
              >
                <Form
                  onFinish={handleSubmit}
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 12 }}
                  initialValues={{
                    email: formData.body.email,
                  }}
                >
                  <Row
                    style={{
                      diplay: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={imageSrc}
                      style={{ borderRadius: "50%" }}
                      width="200"
                      height="200"
                    />
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        onChange={onFileChange}
                        id="file-upload"
                      />
                      <UploadOutlined />
                      Upload
                    </label>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your first name",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="first_name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Middle Name"
                        name="middle_name"
                        rules={[
                          {
                            required: false,
                            message: "Please input your middle name",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="middle_name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your last name",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="last_name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ padding: "10px" }}>
                    <Col span={8}>
                      <Form.Item
                        label="Preffered Name"
                        name="PrefferedName"
                        rules={[
                          {
                            required: false,
                            message: "Please input your preferred name",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="PrefferedName"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input your email",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          readOnly
                          name="email"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="GitHub ID"
                        name="Github"
                        rules={[
                          {
                            required: role === "Student" ? true : false,
                            message: "Please input your github ID",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="Github"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ padding: "10px" }}>
                    <Col span={8}>
                      <Form.Item
                        label="Phone"
                        name="Phone"
                        rules={[
                          {
                            required: false,
                            message: "Please input your phone number",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="Phone"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Social Link"
                        name="SocialLinks"
                        rules={[
                          {
                            required: false,
                            message: "Please input your social link",
                          },
                        ]}
                      >
                        <Input
                          className="Border-Style"
                          allowClear
                          name="SocialLinks"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Button
                        type="primary"
                        value={"large"}
                        style={{
                          float: "right",
                          marginRight: "20px",
                        }}
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        value={"large"}
                        style={{ marginLeft: "20px" }}
                        onClick={() => navigate("/home")}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Row>
          )}
        </div>
      )}
    </>
  );
};
export default Profile;
