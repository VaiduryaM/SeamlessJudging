import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Tooltip,
  Select,
  DatePicker,
  Spin,
} from "antd";
import { getCoursesService } from "../Students/Services/StudentServices";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { GetCurrSem } from "../Common/GetCurrSem";
import { useNavigate } from "react-router-dom";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import InsModalComp from "./InsModalComp";
import moment from "moment";
import { MainContext } from "../../Context/MainContext";

const InsCourses = ({ loadView }) => {
  const { Option } = Select;
  const [loading, setLoading] = useState(true);
  const [currCourseId, setCurrCourseId] = useState();
  const [courses, setCourses] = useState([]);
  const [newCourseModal, setNewCourseModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { currYear, year, sem, setYear, setSem } = useContext(MainContext);

  const getCourses = async () => {
    const result = await getCoursesService(year, sem);
    if (result.status === 200) {
      setCourses(result.data);
      setLoading(false);
    } else {
      setCourses([]);
      setLoading(false);
      NotificationHandler(
        "failure",
        "Failed!",
        "No courses in selected semester"
      );
    }
  };

  const handleAddEditCourse = async (values) => {
    let url = "";
    let res;
    values.year = year;
    let body = values;
    if (modalType === "Add Course") {
      url = process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/course-code/";
      res = await getAPIResponse(url, "POST", body);
    } else {
      url =
        process.env.REACT_APP_LOCAL_DB_URL +
        `/api/v1/course-code/${currCourseId}`;
      res = await getAPIResponse(url, "PUT", body);
    }
    if (res.status == 200) {
      NotificationHandler("success", "Success!", res.message);
      getCourses();
      form.resetFields();
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
    setNewCourseModal(false);
  };
  const handleDeleteCourse = async (courseId) => {
    let url = process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/course-code/";
    let res = await getAPIResponse(url, "DELETE", {
      ids: [courseId],
    });
    if (res.status == 200) {
      NotificationHandler("success", "Success!", res.message);
      getCourses();
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  const showEditForm = (course) => {
    form.setFieldsValue({
      code: course[0].code,
      name: course[0].name,
      semester: sem,
      year: moment(String(year), "YYYY"),
    });
    setNewCourseModal(true);
  };

  useEffect(() => {
    getCourses();
  }, [sem, year]);

  return (
    <>
      <Modal
        bodyStyle={{ borderRadius: "1.5rem" }}
        open={newCourseModal}
        onOk={handleAddEditCourse}
        onCancel={() => setNewCourseModal(false)}
        footer={null}
      >
        <Form
          form={form}
          name="course-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          labelAlign="left"
          onFinish={handleAddEditCourse}
        >
          <Form.Item
            label="Course Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please enter course code",
              },
            ]}
          >
            <Input className="Border-Style" />
          </Form.Item>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter course name",
              },
            ]}
          >
            <Input className="Border-Style" />
          </Form.Item>
          <Form.Item
            label="Semester"
            name="semester"
            // initialValue={sem}
            rules={[
              {
                required: true,
                message: "Please select the semester.",
              },
            ]}
          >
            <Select popupClassName="Border-Style">
              <Option value="Fall"> Fall </Option>
              <Option value="Winter"> Winter </Option>
              <Option value="Spring"> Spring </Option>
              <Option value="Summer"> Summer </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[
              {
                required: true,
                message: "Please enter year",
              },
            ]}
          >
            <DatePicker
              picker="year"
              style={{ width: "15rem" }}
              className="Border-Style"
            />
          </Form.Item>
          {modalType === "Add Course" ? (
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Add Course
              </Button>
            </Form.Item>
          ) : (
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Card
        title="Manage Courses"
        hoverable={true}
        className="Border-Style"
        bodyStyle={{
          overflowY: "scroll",
          height: "80vh",
        }}
        extra={
          <Space>

            <Tooltip title="Add Course" placement="bottom">
              <Button
                icon={<PlusOutlined />}
                shape="circle"
                type="primary"
                onClick={() => {
                  form.setFieldsValue({
                    year: moment(String(year), "YYYY"),
                    semester: sem,
                  });
                  setModalType("Add Course");
                  setNewCourseModal(true);
                }}
                disabled={year < currYear}
              ></Button>
            </Tooltip>
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin
              size="large"
              indicator={<LoadingOutlined />}
              tip="Loading..."
            />
          </div>
        ) : (
          <>
            {courses.length ? (
              <Row gutter={4}>
                {courses.map((course, index) => (
                  <Col span={8} key={"course" + index}>
                    <Card
                      className="Border-Style ant-card-cursor"
                      type="inner"
                      style={{ marginBottom: "6px" }}
                      title={course.code}
                      extra={
                        <Space>
                          <Tooltip title="Edit" placement="bottom">
                            <Button
                              key="edit"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrCourseId(course.course_code_id);
                                setModalType("Edit Course");
                                let tmp = courses.filter(
                                  (item) =>
                                    item.course_code_id ===
                                    course.course_code_id
                                );
                                showEditForm(tmp);
                              }}
                            />
                          </Tooltip>

                          <InsModalComp
                            buttonIcon={<DeleteOutlined />}
                            modalText={
                              "Are you sure you want to delete course?"
                            }
                            onOkFunc={handleDeleteCourse}
                            isDanger={true}
                            toolTipText={"Delete"}
                            size={"small"}
                            extraParam={course.course_code_id}
                          />
                        </Space>
                      }
                      hoverable={true}
                      onClick={() => {
                        navigate("/ins/manageProjects", {
                          state: {
                            courseCode: course.course_code_id,
                            courseName: course.name,
                          },
                        });
                      }}
                    >
                      {course.name}
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>Please select appropriate year and semester</p>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default InsCourses;
