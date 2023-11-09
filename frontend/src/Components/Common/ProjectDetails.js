import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Col, Row, Button, Spin, Space, Tag, Image } from "antd";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "./Services/Projects/ProjectServices";
import { getRoutes } from "./Services/Projects/routes";
import { LoadingOutlined } from "@ant-design/icons";
import { GetTitle } from "./Utils/GetTitle";
import InsModalComp from "../Instructor/InsModalComp";
import ProjectDetailComponent from "./ProjectDetailComponent";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState([]);
  const [primaryAttachments, setPrimaryAttachments] = useState();
  const [attachments, setAttachments] = useState();
  const navigate = useNavigate();
  let location = useLocation();

  let isMyProject = location.pathname.includes("myProject");
  let projectId = location.state.projectId;
  let courseCodeId = location.state.courseCodeId;
  let isFinalised = location.state.status === "FINALIZED" ? true : false;

  let enrolledProjectId = localStorage.getItem("projectId");
  let status = localStorage.getItem("status");

  projectId = projectId ? projectId : enrolledProjectId;

  const getProjectData = async () => {
    let url = getRoutes("projectDetails", { projectId: projectId });
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setProject(res.data);
      setPrimaryAttachments(res.data.primary_attachments);
      setAttachments(res.data.attachments);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      setProject();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const unEnrollProject = async () => {
    let url = getRoutes("unenrollProject");
    let body = {
      unenrollments: [
        {
          projectId: localStorage.getItem("projectId"),
          students: [localStorage.getItem("email")],
        },
      ],
    };
    let res = await getAPIResponse(url, "POST", body);
    if (res.status == 200) {
      localStorage.setItem("projectId", undefined);
      NotificationHandler("success", "Success!", res.message);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else {
      NotificationHandler("failure", "Failed", res.message);
    }
  };

  useEffect(() => {
    getProjectData();
  }, [projectId]);

  return (
    <div>
      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", marginTop: "250px" }}
          indicator={<LoadingOutlined />}
          tip="Loading..."
        />
      ) : (
        <>
          {project ? (
            <div>
              <Card
                title={
                  <GetTitle title={"Project Details"} onClick={navigate} />
                }
                className="Border-Style"
              >
                <Row>
                  <Col span={16}>
                    {project.isMyProject && (
                      <p className="fw-600">
                        Status:{" "}
                        <Tag
                          color={status === "WAITLIST" ? "orange" : "green"}
                          className="Border-Style"
                        >
                          {project.status}
                        </Tag>
                      </p>
                    )}
                    <ProjectDetailComponent project={project} fromStudentview={true}/>
                    {/* <p className="fw-600">Name: {project.name}</p>
                    <p className="fw-600">
                      Type:{" "}
                      {project.pTypeNames.map((pTypeName) => (
                        <Tag
                          color="geekblue"
                          className="Border-Style"
                          style={{ fontSize: "14px" }}
                        >
                          {pTypeName}
                        </Tag>
                      ))}
                    </p>
                    <p className="fw-600">
                      Client(s):{" "}
                      {project.Clients.map((client) => (
                        <Tag
                          color="geekblue"
                          className="Border-Style"
                          style={{ fontSize: "14px" }}
                        >
                          {client}
                        </Tag>
                      ))}
                    </p>
                    <p className="fw-600">
                      Enrolled Students:{" "}
                      {project.finalizedNames.map((member) => (
                        <>
                          <Image
                            src={member.image}
                            style={{
                              borderRadius: "50%",
                              border: "1px solid white",
                            }}
                            width={50}
                          />
                          <Tag
                            color="geekblue"
                            className="Border-Style"
                            style={{ fontSize: "14px" }}
                          >
                            {member.firstName + " " + member.lastName}
                          </Tag>
                        </>
                      ))}
                      {project.teams.map((member) => (
                        <>
                          <Image
                            src={member.image}
                            style={{
                              borderRadius: "50%",
                              border: "1px solid white",
                            }}
                            width={50}
                          />
                          <Tag
                            color="geekblue"
                            className="Border-Style"
                            style={{ fontSize: "14px" }}
                          >
                            {member.firstName + " " + member.lastName}
                          </Tag>
                        </>
                      ))}
                    </p>
                    <p className="fw-600">Description:</p>
                    <p>{project.description}</p> */}
                    <div>
                      <Button
                        type="primary"
                        onClick={() =>
                          navigate("/project/lineage", {
                            state: {
                              user: "std",
                              projectId: projectId,
                            },
                          })
                        }
                      >
                        View History
                      </Button>
                    </div>
                    <Space>
                      {enrolledProjectId == projectId ? (
                        <>
                          {isFinalised ? (
                            <>
                              <div className="mt-2">
                                {primaryAttachments &&
                                  primaryAttachments.map((attachment) => (
                                    <p className="fw-600">
                                      {attachment.name} :{" "}
                                      <a
                                        href={attachment.content}
                                        target="_blank"
                                      >
                                        {attachment.content}
                                      </a>
                                    </p>
                                  ))}
                                {attachments &&
                                  attachments.map((attachment) => (
                                    <p className="fw-600">
                                      {attachment.name} :{" "}
                                      <a
                                        href={attachment.content}
                                        target="_blank"
                                      >
                                        {attachment.content}
                                      </a>
                                    </p>
                                  ))}
                              </div>
                            </>
                          ) : (
                            <InsModalComp
                              buttonText={"Unenroll"}
                              buttonType={"primary"}
                              buttonDisabled={status === "FINALIZED" ? true : false}
                              modalText={"Are you sure you want to unenroll?"}
                              onOkFunc={unEnrollProject}
                              isDanger={true}
                            />
                          )}
                        </>
                      ) : (
                        <div style={{ marginTop: "8px" }}>
                          <Button
                            type="primary"
                            onClick={() =>
                              navigate(`/project/enroll`, {
                                state: {
                                  projectId: projectId,
                                  courseCodeId: courseCodeId,
                                },
                              })
                            }
                            disabled={Number(enrolledProjectId) || isFinalised}
                          >
                            Enroll
                          </Button>
                        </div>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Card>
            </div>
          ) : (
            <h4 className="text-center mt-5">
              You are not enrolled in any project
            </h4>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
