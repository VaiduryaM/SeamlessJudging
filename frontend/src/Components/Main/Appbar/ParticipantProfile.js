/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Form,
  Input,
  Space,
  Select,
  Drawer,
  Modal,
  Checkbox,
} from "antd";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import {
  getUserProfile,
  updateProfile,
} from "../../Participants/Services/PartcipantServices";
import { authDetailsContext } from "../../../App";
const { Option } = Select;

const ParticipantProfile = (props) => {
  const [intialVal, setInitialVal] = useState({});
  const [checkBox, setCheckBox] = useState(false);
  const authProps = useContext(authDetailsContext);
  const [profileForm] = Form.useForm();
  const onClose = () => {
    props.setShowProfile(false);
  };
  const onProfileClose = () => {
    props.setShowProfile(false);
  };
  const onChangeCheckbox = () => {
    setCheckBox(!checkBox);
  };

  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    const result = await getUserProfile();
    if (result.status === 200) {
      profileForm.resetFields();
      setInitialVal(result.data);
    } else {
      NotificationHandler("failure", "Failed!", "result.message");
    }
  };

  const onFinish = async (values) => {
    const result = await updateProfile(values);
    if (result.status === 200) {
      profileForm.resetFields();
      setInitialVal(result.data);
      onProfileClose();
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  return (
    <div>
      <Drawer
        title="Profile"
        placement="right"
        width="35%"
        heigth="50%"
        onClose={onClose}
        visible={props.setShowProfile}
      >
        <Form
          form={profileForm}
          initialValues={intialVal}
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
            rules={[
              {
                required: false,
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
            rules={[
              {
                required: false,
                message: "Please input your lastname!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email Id"
            name="email"
            rules={[
              {
                required: false,
                message: "Please input your Email Id!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          {authProps.authDetails.role !== "JUDGE" && (
            <Form.Item
              label="Change Password?"
              name=" "
              rules={[
                {
                  required: false,
                  message: "Please input your Email Id!",
                },
              ]}
            >
              <input
                onClick={onChangeCheckbox}
                checked={checkBox}
                type="checkbox"
              />
            </Form.Item>
          )}

          {checkBox && authProps.authDetails.role !== "JUDGE" && (
            <>
              <Form.Item
                label="Current Password"
                name="old_password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="new_password"
                checkBox
                rules={[
                  {
                    required: true,
                    message: "Please updated your password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirm"
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please Confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 8,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button type="danger" onClick={onProfileClose}>
                Close
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ParticipantProfile;
