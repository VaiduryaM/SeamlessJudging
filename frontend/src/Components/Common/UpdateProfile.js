import React, { useState, useEffect } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons/";
import {
  Card,
  Button,
  Form,
  Input,
  Row,
  Col,
  Image,
  Upload,
  Collapse,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";

const UpdateProfile = () => {
  let navigate = useNavigate();
  let role = localStorage.getItem("roles");
  const { Panel } = Collapse;
  const [formData, setFormData] = useState();
  const [imageSrc, setImageSrc] = useState("");
  const [nameLetters, setNameLetters] = useState("");

  const onFileChange = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc("");
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
          let data = res.data.response_data;
         setFormData(data.body);
         if(data.body.first_name.length>0 && data.body.last_name.length>0){
          setNameLetters(data.body.first_name[0]+data.body.last_name[0]);}
         data.image && setImageSrc(data.image);
       })
      .catch((err) => console.log(err));
  }, []);
  const imageField = document.querySelector('input[type="file"]');
  const handleUpdateProfile = async (values) => {
    let newFormData = new FormData();
    let formKeys = Object.keys(values);

    formKeys.forEach((item) => {
      newFormData.append(item, values[item]);
    });
    if (imageSrc.length>0){
      newFormData.append("image", imageField && imageField.files[0]);
    }

    await fetch(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/profile", {
      method: "POST",
      mode: "cors",
      body: newFormData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Token": localStorage.getItem("access_token"),
      },
    }).then((res) => {
      if (res.status == 200) {
        NotificationHandler(
          "success",
          "Success!",
          "Profile updated successfully"
        );
        navigate("/home");
        setTimeout(() => {
          navigate(0);
        }, 1000);
      }
    });
  };

  const handleUpdatePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    values.email = formData.email;
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
        NotificationHandler(
          "success",
          "Success!",
          "Password changed successfully"
        );
        navigate("/home");
        setTimeout(() => {
          navigate(0);
        }, 1000);
      }
    });
  };

  return (
    <div
      style={{
        height: "80vh",
        overflowY: "scroll",
      }}
    >
      <Collapse defaultActiveKey={["1"]} accordion>
        <Panel header="Update Profile" key="1">
          {formData && (
            <Form
              onFinish={handleUpdateProfile}
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 12 }}
              initialValues={{
                first_name: formData.first_name,
                middle_name: formData.middle_name,
                last_name: formData.last_name,
                PreferredName: formData.PrefferedName,
                email: formData.email,
                Github: formData.Github,
                Phone: formData.Phone,
                SocialLinks: formData.SocialLinks,
              }}
            >
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  flexDirection: "column",
                }}
              >
                <img
                  src={imageSrc}
                  class = {imageSrc==""? "defaultImg profileImg": "profileImg"}
                  title = {imageSrc==""? nameLetters: ""}
                />
                <div style={{display: "inherit",paddingLeft: "5%"}}>
                <label className="custom-file-upload">
                  <input type="file" onChange={onFileChange} id="file-upload" />
                  <UploadOutlined />
                  Upload  
                </label>
                  <Button
                  icon={<DeleteOutlined />}
                  shape="circle"
                  type="danger"
                  style={{ marginTop: "5px", marginLeft:"10px" }}
                  onClick={() => setImageSrc("")}
                ></Button>
              </div>
              </Row>
              <Row>
                <Col md={8} sm={12}>
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
                <Col md={8} sm={12}>
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
                <Col md={8} sm={12}>
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
              <Row>
                <Col md={8} sm={12}>
                  <Form.Item
                    label="Preferred Name"
                    name="PreferredName"
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
                <Col md={8} sm={12}>
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
                      readOnly
                      allowClear
                      name="email"
                    />
                  </Form.Item>
                </Col>
                <Col md={8} sm={12}>
                  <Form.Item
                    label="GitHub ID"
                    name="Github"
                    rules={[
                      {
                        required: role.includes("Student") ? true : false,
                        message: "Please input your github ID",
                      },
                    ]}
                  >
                    <Input className="Border-Style" allowClear name="Github" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={8} sm={12}>
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
                    <Input className="Border-Style" allowClear name="Phone" />
                  </Form.Item>
                </Col>
                <Col md={8} sm={12}>
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
                <Col md={12} sm={12}>
                  <Button
                    type="primary"
                    value={"large"}
                    style={{
                      float: "right",
                      marginRight: "20px",
                    }}
                    htmlType="submit"
                  >
                    Update
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
          )}
        </Panel>
        <Panel header="Change Password" key="2">
          <Form
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6 }}
            onFinish={handleUpdatePassword}
          >
            <Form.Item
              label="Old Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your old password",
                },
              ]}
            >
              <Input.Password className="Border-Style" allowClear />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your new password",
                },
              ]}
            >
              <Input.Password className="Border-Style" allowClear />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
              ]}
            >
              <Input.Password className="Border-Style" allowClear />
            </Form.Item>
            <Row>
              <Col span={12}>
                <Button
                  type="primary"
                  // value={"large"}
                  style={{
                    float: "right",
                    marginRight: "20px",
                  }}
                  htmlType="submit"
                >
                  Change
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
        </Panel>
      </Collapse>
    </div>
  );
};

export default UpdateProfile;
