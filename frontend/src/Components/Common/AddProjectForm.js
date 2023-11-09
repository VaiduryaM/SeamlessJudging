import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Col,
  Row,
  Space,
  DatePicker,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DynamicTags from "./DynamicTags";
import { getRoutes } from "./Services/Projects/routes";
import { NotificationHandler } from "./Notifications/NotificationHandler";
import { getAPIResponse } from "./Services/Projects/ProjectServices";
import { GetTitle } from "./Utils/GetTitle";
import { getCoursesService } from "../Students/Services/StudentServices";
import { GetCurrSem } from "./GetCurrSem";
import moment from "moment";
const { Option } = Select;

const AddProjectForm = () => {
  const [tags, setTags] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sem, setSem] = useState(
    GetCurrSem(new Date().getDate(), new Date().getMonth())
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [form] = Form.useForm();
  const navigate = useNavigate();
  let location = useLocation();
  let courseCodeId = location.state && location.state.courseCode;
  let courseName = location.state && location.state.courseName;
  const getProjectTypes = async () => {
    let url = process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/project-type`;
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setProjectTypes(res.data);
    } else {
      console.log("No project data found");
    }
  };

  useEffect(() => {
    getProjectTypes();
    getCourses(year, sem);
  }, []);

  const getCourses = async (year, sem) => {
    const result = await getCoursesService(year, sem);
    if (result.status === 200) {
      setCourses(result.data);
    } else {
      setCourses([]);
    }
  };

  const onFinish = async (values) => {
    var url = getRoutes("addProject");
    values.clients = tags;
    values.parentProjectId = null;
    let links = {};
    if (values.slackLink) {
      links["Slack"] = values.slackLink;
    }
    if (values.meetingLink) {
      links["Zoom"] = values.meetingLink;
    }
    if (values.sharedFolderLink) {
      links["Shared folder"] = values.sharedFolderLink;
    }
    if (values.repo) {
      links["Repo"] = values.repo;
    }

    if (values.addLinks) {
      values.addLinks.forEach((link) => {
        links[link.linkName] = link.linkValue;
      });
    }

    values.links = links;
    values.role = location.pathname.includes("client")
      ? "Clients"
      : "Instructor";
    values.year = year;
    values.courseCodeId = isNaN(values.courseCodeId)
      ? courseCodeId
      : values.courseCodeId;
    let body = values;
    let res = await getAPIResponse(url, "POST", body);
    if (res.status == 200) {
      NotificationHandler("success", "Success!", res.message);
      if (location.pathname.includes("client")) {
        navigate("/client/manageClientProjects");
      } else if (location.pathname.includes("ins")) {
        navigate("/ins/manageProjects", {
          state: { courseCode: courseCodeId },
        });
      }
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  return (
    <div>
      <Card
        title={<GetTitle title={"Add Project"} onClick={navigate} />}
        className="Border-Style"
        hoverable="true"
        bodyStyle={{
          overflowY: "scroll",
          height: "80vh",
        }}
      >
        <Row>
          <Col span={16}>
            <Form
              name="project-form"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              labelAlign="left"
              autoComplete="off"
              initialValues={{
                semester: sem,
                year: moment(year, "YYYY"),
                courseCodeId: courseName,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Title"
                name="name"
                className="fw-600"
                rules={[
                  {
                    required: true,
                    message: "Please enter project's title",
                  },
                ]}
              >
                <Input className="Border-Style" name="name" />
              </Form.Item>
              {location.pathname.includes("ins") ? (
                <Form.Item
                  wrapperCol={{ span: 4 }}
                  label="Team Size"
                  className="fw-600"
                  name="size"
                  rules={[
                    {
                      required: true,
                      message: "Please enter team's size",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Size"
                    popupClassName="Border-Style"
                  >
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                  </Select>
                </Form.Item>
              ) : null}
              <Form.Item
                label="Semester"
                name="semester"
                className="fw-600"
                wrapperCol={{ span: 4 }}
                rules={[
                  {
                    required: true,
                    message: "Please select the semester",
                  },
                ]}
              >
                <Select
                  placeholder="Select semester"
                  popupClassName="Border-Style"
                  onChange={(_, option) => {
                    getCourses(year, option.value);
                    setSem(option.value);
                    // form.setFieldsValue({ courseCodeId: "" });
                  }}
                  disabled={location.pathname.includes("client")}
                >
                  <Option value="Fall"> Fall </Option>
                  <Option value="Winter"> Winter </Option>
                  <Option value="Spring"> Spring </Option>
                  <Option value="Summer"> Summer </Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Year"
                className="fw-600"
                name="year"
                wrapperCol={{ span: 4 }}
                rules={[
                  {
                    required: true,
                    message: "Please select the year",
                  },
                ]}
              >
                <DatePicker
                  picker="year"
                  className="Border-Style"
                  onChange={(_, value) => {
                    getCourses(value, sem);
                    setYear(value);
                    form.setFieldsValue({ courseCodeId: "" });
                  }}
                  disabled={location.pathname.includes("client")}
                />
              </Form.Item>

              <Form.Item
                label="Type"
                className="fw-600"
                name="projectTypeIds"
                rules={[
                  {
                    required: true,
                    message: "Please enter type of the project",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Project Type"
                  popupClassName="Border-Style"
                >
                  {projectTypes.map((project) => (
                    <Option value={project.project_type_id}>
                      {project.project_type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {location.pathname.includes("ins") ? (
                <Form.Item
                  label="Course"
                  className="fw-600"
                  name="courseCodeId"
                  rules={[
                    {
                      required: false,
                      message: "Please select the course",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select course"
                    popupClassName="Border-Style"
                    allowClear={true}
                  >
                    {courses.map((course) => (
                      <Option value={course.course_code_id}>
                        {course.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
              <Form.Item
                className="fw-600 "
                label="Representatives"
                name="representatives"
              >
                <DynamicTags
                  tagText={"Add representative(s)"}
                  tagFunc={setTags}
                  tagCont={tags}
                />
              </Form.Item>
              <Form.Item
                className="fw-600"
                label="Description"
                name="description"
              >
                <TextArea className="Border-Style" rows={6} />
              </Form.Item>
              <Form.Item className="fw-600" label="Slack Link" name="slackLink">
                <Input className="Border-Style" />
              </Form.Item>
              <Form.Item
                className="fw-600"
                label="Meeting Link"
                name="meetingLink"
              >
                <Input className="Border-Style" />
              </Form.Item>

              <Form.Item
                className="fw-600"
                label="Shared Folder"
                name="sharedFolderLink"
              >
                <Input className="Border-Style" />
              </Form.Item>

              <Form.Item className="fw-600" label="Repo" name="repo">
                <Input className="Border-Style" />
              </Form.Item>
              <Form.List name="addLinks">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          className="fw-600"
                          {...restField}
                          name={[name, "linkName"]}
                          wrapperCol={{ span: 24 }}
                          style={{ width: "120px" }}
                          rules={[
                            {
                              required: true,
                              message: "Missing link name",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Link Title"
                            className="Border-Style"
                          />
                        </Form.Item>
                        <Form.Item
                          className="fw-600"
                          {...restField}
                          name={[name, "linkValue"]}
                          wrapperCol={{ span: 24 }}
                          style={{ width: "360px" }}
                          rules={[
                            {
                              required: true,
                              message: "Missing link value",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Link Value"
                            className="Border-Style"
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item className="fw-600">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{ marginLeft: "125px" }}
                      >
                        Add additional link
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item className="fw-600">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="Border-Style"
                >
                  Add Project
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AddProjectForm;
