import React, { useEffect, useState } from "react";
import { Card, Row, Button, Modal, Col, Form, Input, Space, Tag } from "antd";
import { enrollProject } from "./Services/StudentServices";
import { WaitlistService } from "./Services/StudentServices";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { getRoutes } from "../Common/Services/Projects/routes";
import { GetTitle } from "../Common/Utils/GetTitle";
import { ExclamationCircleFilled } from "@ant-design/icons";

const ProjectEnrollment = () => {
  const [waitlistModal, setWaitlistModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [waitlistMessage, setWaitlistMessage] = useState(false);
  const [project, setProject] = useState();
  const { confirm } = Modal;
  const navigate = useNavigate();
  const params = useParams();
  let location = useLocation();

  let projectId = location.state.projectId;
  let courseCodeId = location.state.courseCodeId;
  // const showConfirm = () => {
  //   confirm({
  //     title: "Do you Want to delete these items?",
  //     icon: <ExclamationCircleFilled />,
  //     content: "Some descriptions",
  //     onOk() {
  //       console.log("OK");
  //     },
  //     onCancel() {
  //       console.log("Cancel");
  //     },
  //   });
  // };

  const getProjectData = async () => {
    let url = getRoutes("projectDetails", { projectId: projectId });
    let res = await getAPIResponse(url);
    if (res.status === 200) {
      res.data.email = localStorage.getItem("email");
      setProject(res.data);
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  useEffect(() => {
    getProjectData();
  }, []);

  const enroll = async (values) => {
    const tempArr = [];
    Object.values(values).forEach((element) => {
      if (element !== undefined && element !== "") {
        tempArr.push(element);
      }
    });
    setStudents(tempArr);
    const enrollmentDetails = {};
    enrollmentDetails.projectId = projectId;
    enrollmentDetails.courseCodeId = courseCodeId;
    enrollmentDetails.students = tempArr;

    const result = await enrollProject(enrollmentDetails);

    if (result.status === 200) {
      localStorage.setItem("projectId", result.data.project_id);
      NotificationHandler("success", "Success!", result.message);
      // navigate(`/student/myProject`, {
      //   state: {
      //     projectId: result.data.projectId,
      //   },
      // });
      navigate("/home");
    } else if (result.data.code === "TEAM_SIZE_EXCEEDED") {
      setWaitlistMessage(result.message);
      setWaitlistModal(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const handleAddToWaitlist = async () => {
    setLoading(true);
    const tempArr = [];
    Object.values(students).forEach((element) => {
      if (element !== undefined && element !== "") {
        tempArr.push(element);
      }
    });
    setStudents(tempArr);
    const enrollmentDetails = {};
    enrollmentDetails.projectId = projectId;
    console.log(enrollmentDetails);
    // enrollmentDetails.courseCodeId = courseCodeId;
    enrollmentDetails.students = tempArr;
    // enrollmentDetails.year = 2022;
    const result = await WaitlistService(enrollmentDetails);
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
    setWaitlistModal(false);
  };

  const handleCancel = () => {
    setWaitlistModal(false);
  };

  return (
    <Card
      title={<GetTitle title={"Project Enroll"} onClick={navigate} />}
      className="Border-Style"
      hoverable={true}
    >
      {project && (
        <div>
          <Row style={{ marginBottom: "15px" }}>
            <Col md={8} sm={12} className="text-small">
              {" "}
              <span className="fw-600">Project: </span>
              {project.name}
            </Col>

            <Col md={5} sm={12} className="text-small">
              {" "}
              <span className="fw-600">Course</span>: {project.course_code_name}
            </Col>
          </Row>
          <Col span={12} className="text-small">
            <span className="fw-600">Client(s): </span>
            {project.Clients.map((client) => (
              <Space>
                <Tag className="Border-Style" color="geekblue">
                  {client}
                </Tag>
              </Space>
            ))}
          </Col>
          <Col md={16} sm={12}>
            <div className="mt-4">
              <Form
                onFinish={enroll}
                initialValues={{ member1: project.email }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                labelAlign="left"
              >
                <Form.Item label="Member 1" name="member1">
                  <Input readOnly disabled className="Border-Style" />
                </Form.Item>

                {[...Array(project.team_size - 1)].map((elem, index) => (
                  <Form.Item
                    label={`Member ${index + 2}`}
                    name={`member${index + 2}`}
                  >
                    <Input allowClear className="Border-Style" />
                  </Form.Item>
                ))}
                <p>
                  You can sign up to maximum of{" "}
                  <span style={{ color: "red" }}>{project.team_size}</span>{" "}
                  including yourself
                </p>
                <Form.Item>
                  <Space>
                    {/* <InsModalComp
                      buttonText={"Enroll"}
                      buttonType={"primary"}
                      modalText={"Are you sure you want to enroll?"}
                      onOkFunc={unEnrollProject}
                      isDanger={true}
                    /> */}
                    {/* <Button
                      onClick={showConfirm}
                      type="primary"
                      htmlType="submit"
                      style={{
                        background: "#F18F01",
                        width: "127px",
                      }}
                    >
                      Enroll
                    </Button> */}
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        background: "#F18F01",
                        width: "127px",
                      }}
                    >
                      Enroll
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </div>
      )}

      <Modal
        open={waitlistModal}
        onOk={handleAddToWaitlist}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleAddToWaitlist}
          >
            Proceed with waitlist
          </Button>,
        ]}
      >
        <p>{waitlistMessage}</p>
      </Modal>
    </Card>
  );
};

export default ProjectEnrollment;
