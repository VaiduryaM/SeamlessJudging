import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Upload,
  Modal,
  Space,
  Row,
  Col,
  Checkbox,
} from "antd";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getRoutes } from "../Common/Services/Projects/routes";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { getCoursesService } from "../Students/Services/StudentServices";
import { GetTitle } from "../Common/Utils/GetTitle";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { MainContext } from "../../Context/MainContext";

const { Option } = Select;

const InsAddUsers = () => {
  const navigate = useNavigate();
  const { year, sem } = useContext(MainContext);
  const [form] = Form.useForm();

  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(false);
  const [bulkUsers, setBulkUsers] = useState({
    loading: true,
    data: [],
    message: "",
  });

  const [userData, setUserData] = useState({
    newUsers: [],
    addUsers: [],
    remUsers: [],
  });

  const getCourses = async () => {
    const result = await getCoursesService(year, sem);
    if (result.status === 200) {
      setCourses(result.data);
    } else {
      setCourses([]);
      NotificationHandler(
        "failure",
        "Failed!",
        "No courses in selected semester"
      );
    }
  };

  const onFinish = async (values) => {
    let url = getRoutes("addUser");
    let result = await getAPIResponse(url, "POST", values);
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      form.resetFields();
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const handleBulkUpload = async (values) => {
    const formData = new FormData();
    formData.append("courseCodeId", values.courseCodeId);
    formData.append("role", values.role);
    formData.append("csvfile", values.csvfile.file);
    await fetch(
      process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/upload-csv",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "access-token": localStorage.getItem("access_token"),
        },
        body: formData,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setBulkUsers((prev) => ({
          ...prev,
          data: data.data,
          loading: false,
          message: data.message,
        }));
        setUserData({
          newUsers: data.data.newUsers,
          addUsers: data.data.usersToAdd,
          remUsers: data.data.usersToRemove,
        });
        setModal(true);
      })
      .catch((err) => {
        console.error("CSV Upload failed", err);
      });
  };

  const handleNewUsers = (checkedValues) => {
    console.log(checkedValues);
    setUserData((prev) => ({
      ...prev,
      newUsers: checkedValues,
    }));
  };
  const handleAddUsers = (checkedValues) => {
    console.log(checkedValues);
    setUserData((prev) => ({
      ...prev,
      addUsers: checkedValues,
    }));
  };

  const handleRemoveUsers = (checkedValues) => {
    console.log(checkedValues);
    setUserData((prev) => ({
      ...prev,
      remUsers: checkedValues,
    }));
  };

  const handleSubmit = async () => {
    console.log(userData);
    await fetch(
      process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/process-csv",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
          newUsers: userData.newUsers,
          addUsers: userData.addUsers,
          remUsers: userData.remUsers,
          roleId: bulkUsers.data.roleId,
          courseCodeId: bulkUsers.data.courseCodeId,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const props = {
    name: "file",
    maxCount: 1,
    beforeUpload: (file) => {
      return false;
    },
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <Modal
        title="Upload Preview"
        open={modal}
        footer={[
          <Button key="back" onClick={() => setModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      >
        {/* <Space align="start" direction="vertical"> */}
        {bulkUsers.loading ? (
          "Loading..."
        ) : (
          <>
            <Row>
              <Col span={12}>
                <h3>Add</h3>
                <Checkbox.Group
                  defaultValue={bulkUsers.data.newUsers}
                  onChange={handleNewUsers}
                  style={{ display: "block" }}
                >
                  <Space direction="vertical">
                    {bulkUsers.data.newUsers.map((user) => (
                      <div>
                        <Checkbox key={user} value={user}>
                          <Space>
                            {user} <Tag color="magenta">New</Tag>
                          </Space>
                        </Checkbox>
                      </div>
                    ))}
                  </Space>
                </Checkbox.Group>
                <Checkbox.Group
                  defaultValue={bulkUsers.data.usersToAdd}
                  onChange={handleAddUsers}
                >
                  <Space direction="vertical">
                    {bulkUsers.data.usersToAdd.map((user) => (
                      <Checkbox key={user} value={user}>
                        {user}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Col>
              <Col span={12}>
                <h3>Remove</h3>
                <Checkbox.Group
                  defaultValue={bulkUsers.data.usersToRemove}
                  onChange={handleRemoveUsers}
                >
                  {bulkUsers.data.usersToRemove.map((user) => (
                    <Checkbox key={user} value={user}>
                      {user}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Col>
            </Row>
          </>
        )}
        {/* </Space> */}
      </Modal>
      <Card
        title={<GetTitle title={"Add New User"} onClick={navigate} />}
        className="Border-Style"
      >
        <Form
          name="addUser"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          labelAlign="left"
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter user's email",
              },
            ]}
          >
            <Input className="Border-Style" />
          </Form.Item>
          <Form.Item
            label="Role(s)"
            name="roles"
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select role(s)"
              popupClassName="Border-Style"
            >
              <Option value="INSTRUCTOR">Instructor</Option>
              <Option value="STUDENT">Student</Option>
              <Option value="CLIENT">Client</Option>
              <Option value="JUDGE">Judge</Option>
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate>
            {({ getFieldValue }) => {
              const selectedRoles = getFieldValue('roles') || [];
              const isInstructorSelected = selectedRoles.includes('INSTRUCTOR');
              const isStudentSelected = selectedRoles.includes('STUDENT');
              const isClientSelected = selectedRoles.includes('CLIENT');
              const isJudgeSelected = selectedRoles.includes('JUDGE');

              if (
                selectedRoles.length === 0 ||
                (isJudgeSelected && selectedRoles.length === 1)
              ) {
                return (
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="Border-Style"
                      type="primary"
                    >
                      Add User
                    </Button>
                  </Form.Item>
                );
              } else {
                return (
                  <>
                    <Form.Item
                      label="Select Course"
                      name="courseCodeId"
                      rules={[
                        {
                          required: true,
                          message: "Please select a course for the selected roles",
                        },
                      ]}
                    >
                      <Select
                        disabled={
                          !isInstructorSelected &&
                          !isStudentSelected &&
                          !isClientSelected
                        }
                        popupClassName="Border-Style"
                        placeholder="Select Course"
                      >
                        {courses.length > 0 &&
                          courses.map((course) => (
                            <Option value={course.course_code_id} key={course.key}>
                              {course.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        className="Border-Style"
                        type="primary"
                      >
                        Add User
                      </Button>
                    </Form.Item>
                  </>
                );
              }
            }}
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="Bulk Uploads"
        className="Border-Style"
        style={{ marginTop: "5px" }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          labelAlign="left"
          onFinish={handleBulkUpload}
        >
          <Form.Item label="Select Course" name="courseCodeId">
            <Select popup className="Border-Style" placeholder="Select Course">
              {courses.length &&
                courses.map((course) => (
                  <Option value={course.course_code_id} key={course.key}>
                    {course.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Select Role" name="role">
            <Select popup className="Border-Style" placeholder="Select Role">
              <Option value="Student"> Student </Option>
              <Option value="Client"> Client </Option>
              <Option value="Instructor"> Instructor </Option>
            </Select>
          </Form.Item>
          <Form.Item label="Upload file" name="csvfile">
            <Upload {...props}>
              <Button icon={<UploadOutlined />} block>
                Upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Parse
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default InsAddUsers;
