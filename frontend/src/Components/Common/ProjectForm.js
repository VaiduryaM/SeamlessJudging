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
  Spin,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import DynamicTags from "./DynamicTags";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoutes } from "./Services/Projects/routes";
import { NotificationHandler } from "./Notifications/NotificationHandler";
import { getAPIResponse } from "./Services/Projects/ProjectServices";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { GetTitle } from "./Utils/GetTitle";
import { getCoursesService } from "../Students/Services/StudentServices";
import { GetCurrSem } from "./GetCurrSem";
import moment from "moment";
const { Option } = Select;
const ProjectForm = () => {
  const [tags, setTags] = useState([]);
  const [project, setProject] = useState({});
  const [projectTypes, setProjectTypes] = useState([]);
  const [initialprojectTypes, setInitialprojectTypes] = useState([]);
  const [projectTypeId, setProjectTypeId] = useState();
  const [courseCode, setCourseCode] = useState();
  const [attachments, setAttachments] = useState();
  const [slack, setSlack] = useState();
  const [zoom, setZoom] = useState();
  const [sharedFolder, setSharedFolder] = useState();
  const [repo, setRepo] = useState();
  const [parentProjectId, setParentProjectId] = useState();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [sem, setSem] = useState(
    GetCurrSem(new Date().getDate(), new Date().getMonth())
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [form] = Form.useForm();
  let location = useLocation();
  let courseCodeId = location.state && location.state.courseCode;
  let title = location.state.title;
  let buttonText = "";
  let formType = location.state.formType;
  if (formType === "Edit") {
    buttonText = "Save";
  } else {
    buttonText = "Extend";
  }
  let projectId = location.state && location.state.projectId;

  const navigate = useNavigate();

  const getProjectData = async () => {
    let url = getRoutes("projectDetails", { projectId: projectId });
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setProject(res.data);
      setTags(res.data.Clients);
      setAttachments(res.data.attachments);
      setProjectTypeId(res.data.project_type_id);
      setParentProjectId(res.data.parentProjectId);
      setCourseCode(res.data.course_code_id);
      let initPTtypes = []
      let pTypes = res.data.project_types;
      for(let i=0; i<pTypes.length; i++){
        initPTtypes = initPTtypes.concat(pTypes[i]["Id"]);
      }
      setInitialprojectTypes(initPTtypes);
      let primaryAttachments = res.data.primary_attachments;
      for (let i = 0; i < primaryAttachments.length; i++) {
        if (primaryAttachments[i].name === "Slack") {
          setSlack(primaryAttachments[i].content);
        } else if (primaryAttachments[i].name === "Zoom") {
          setZoom(primaryAttachments[i].content);
        } else if (primaryAttachments[i].name === "Shared folder") {
          setSharedFolder(primaryAttachments[i].content);
        } else if (primaryAttachments[i].name === "Repo") {
          setRepo(primaryAttachments[i].content);
        }
      }
      form.setFieldsValue({
        year: moment(String(res.data.year), "YYYY"),
      });
      getCourses(year, sem);
      setLoading(false);
    } else {
      console.log("No project data found");
    }
  };

  const getProjectTypes = async () => {
    let url = process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/project-type`;
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setProjectTypes(res.data);
    } else {
      console.log("No project data found");
    }
  };

  const getCourses = async (year, sem) => {
    const result = await getCoursesService(year, sem);
    if (result.status === 200) {
      setCourses(result.data);
    } else {
      setCourses([]);
    }
  };

  useEffect(() => {
    getProjectData();
  }, [projectId]);
  useEffect(() => {
    getProjectTypes();
  }, []);

  const onFinish = async (values) => {
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

    if (attachments) {
      attachments.forEach((attachment) => {
        if (values[attachment.name] != undefined) {
          links[attachment.name] = values[attachment.name];
        } else {
          links[attachment.name] = attachment.content;
        }
      });
    }
    let body = {
      clients: tags,
      parent_project_id: formType === "Edit" ? parentProjectId : projectId,
      links: links,
      name: values.name,
      size: values.size,
      description: values.description,
      semester: values.semester,
      year: year,
      courseCodeId: isNaN(values.course) ? courseCode : values.course,
      projectTypeIds: values.projectTypeIds
    };

    if (formType == "Edit") {
      var url = getRoutes("updateProject");
      body.projectId = projectId;
    } else if (formType == "Extend") {
      var url = getRoutes("addProject");
    }

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
    <Card
      title={<GetTitle title={title} onClick={navigate} />}
      className="Border-Style"
      bodyStyle={{
        overflowY: "scroll",
        height: "80vh",
      }}
    >
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" indicator={<LoadingOutlined />} tip="Loading..." />
        </div>
      ) : (
        <Row>
          <Col span={16}>
            <Form
              name="project-form"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              labelAlign="left"
              onFinish={onFinish}
              form={form}
              initialValues={{
                name: project.name,
                size: project.team_size,
                projectTypeIds: initialprojectTypes,
                description: project.description,
                semester: sem,
                year: year,
                course:courseCode,
                slackLink: slack && slack,
                meetingLink: zoom && zoom,
                sharedFolderLink: sharedFolder && sharedFolder,
                repo: repo && repo,
              }}
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
                  name="size"
                  className="fw-600"
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
                    <Option value="4">5</Option>
                    <Option value="4">6</Option>
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
                  }}
                >
                  <Option value="Fall"> Fall </Option>
                  <Option value="Winter"> Winter </Option>
                  <Option value="Spring"> Spring </Option>
                  <Option value="Summer"> Summer </Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Year"
                name="year"
                className="fw-600"
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
                  // format={"YYYY"}
                  onChange={(x, value) => {
                    getCourses(value, sem);
                    setYear(value);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="projectTypeIds"
                className="fw-600"
                rules={[
                  {
                    required: true,
                    message: "Please select the project",
                  },
                ]}
                form={form}
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
                  name="course"
                  className="fw-600"
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
                  >
                    {courses.map((course) => (
                      <Option value={course.course_code_id}>
                        {course.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  label="Course"
                  name="course"
                  className="fw-600"
                  rules={[
                    {
                      required: false,
                      message: "Please select the course",
                    },
                  ]}
                >
                  <Input className="Border-Style" readOnly></Input>
                </Form.Item>
              )}
              <Form.Item
                className="fw-600"
                label="Representatives"
                name="representatives"
              >
                {/* edit tags */}
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
                <TextArea rows={6} className="Border-Style" />
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
              {attachments.map((attachment) => (
                <Form.Item
                  className="fw-600"
                  label={attachment.name}
                  name={attachment.name}
                >
                  <Input
                    className="Border-Style"
                    defaultValue={attachment.content}
                  />
                </Form.Item>
              ))}
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
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {buttonText}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default ProjectForm;
