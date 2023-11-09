import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useLocation } from "react-router-dom";

import { Card, Col, Row, Button, Spin, Tag, Image, Space, Dropdown, Menu } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RocketOutlined,
  FunnelPlotOutlined,
  DownloadOutlined,
  GitlabOutlined,
  ProfileTwoTone,
  ProjectTwoTone,
  UserOutlined,
  HomeOutlined,
  MacCommandFilled,
  InfoCircleTwoTone,
  FireOutlined,
  DingtalkOutlined,
} from "@ant-design/icons";

import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "./Services/Projects/ProjectServices";
// import { UserDetails } from "../Instructor/UserDetails";
import UserDetails from "../Instructor/UserDetails";
import { getRoutes } from "./Services/Projects/routes";
import { getUserActions } from "./Utils/userFunctions";
import { LoadingOutlined, UploadOutlined, CopyOutlined } from "@ant-design/icons";
import { GetTitle } from "./Utils/GetTitle";
import UserDetailComponent from "../Instructor/UserDetailComponent";
import ProjectDetailComponent from "./ProjectDetailComponent";
const root = ReactDOM.createRoot(document.getElementById("root"));
const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState([]);
  const [primaryAttachments, setPrimaryAttachments] = useState();
  // const [studentPop, setStudentPop] = useState(
  //   openStudentInfoPopup()
  // );
  const [attachments, setAttachments] = useState();
  const navigate = useNavigate();
  let state = useLocation();
  let projectId = state.state.projectId;

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
      console.log("No project data found");
    }
  };

  const alternateCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      NotificationHandler(
        "success",
        "Success!",
        "Selected email(s) Copied",
        ""
      );
    } catch (err) {
      NotificationHandler("failure", "Failed!", "No email(s) selected!");
    }
    document.body.removeChild(textArea);
    window.scrollTo(0, 0);
  };

  const copyEmail = (action) => {
    let copiedEmails = [];
    project.team.forEach((member) => {
      if (member.role == "STUDENT"){
        if(action === 'all' || (action === 'enrolled' && member.status=="ENROLLED") || (action === 'waitlist' && member.status=="WAITLIST") || (action === 'finalized' && member.status=="FINALIZED")){
          copiedEmails.push(member.user.email);
        }
      }
    });
    
    if (copiedEmails.length) {
      if( window.isSecureContext){
      navigator.clipboard
        .writeText(String(copiedEmails))
        .then(
          NotificationHandler("success", "Success!", "Selected email(s) Copied")
        );
        }else {
          alternateCopy(copiedEmails);
        }
    } else {
      NotificationHandler("failure", "Failed", "No email(s) Copied!");
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
          {project && (
            <div>
              <Card
                title={
                  <GetTitle title={"Project Details"} onClick={navigate} />
                }
                className="Border-Style"
                extra={
                  <Space>
                    <Dropdown overlay={
                      <Menu>
                        <Menu.Item key="1" onClick={() => copyEmail('enrolled')}>Enrolled Email(s)</Menu.Item>
                        <Menu.Item key="2" onClick={() => copyEmail('waitlist')}>Waitlist Email(s)</Menu.Item>
                        <Menu.Item key="3" onClick={() => copyEmail('finalized')}>Finalized Email(s)</Menu.Item>
                        <Menu.Item key="4" onClick={() => copyEmail('all')}>All Email(s)</Menu.Item>
                      </Menu>
                    } >
                      <Button
                        shape="circle"
                        icon={<CopyOutlined />}
                      ></Button>
                    </Dropdown>
                  </Space>
                }
              >
                <Row>
                  <Col span={16}>
                    <ProjectDetailComponent project={project} fromStudentview={false}/>
                    {/* <p>
                      <span className="fw-600">Name: </span>
                      {project.name}
                    </p>
                    <p>
                      <span className="fw-600">Team Size: </span>
                      {project.team_size}
                    </p>
                    <p>
                      <span className="fw-600">Type: </span>
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
                    <p>
                      <span className="fw-600">Client Representative: </span>
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
                    <p>
                      <span className="fw-600">Enrolled Students: </span>
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
                            color="green"
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
                            style={{ fontSize: "14px", cursor:"pointer" }}
                            onClick={() =>
                              openStudentInfoPopup(member.userId)
                            }
                          >
                            {member.firstName + " " + member.lastName}
                          </Tag>
                        </>
                      ))}
                      
                    </p>
                    <p>
                      <span className="fw-600">Waitlist Students: </span>
                      {project.waitlisted.map((member) => (
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
                            color="yellow"
                            className="Border-Style"
                            style={{ fontSize: "14px" }}
                          >
                            {member.firstName + " " + member.lastName}
                          </Tag>
                        </>
                      ))}
                    </p>
                    <p>
                      <span className="fw-600">Description:</span>
                    </p>
                    <p>{project.description}</p> */}

                    <div className="fw-600">Links :</div>
                    <div className="mt-2">
                      {primaryAttachments &&
                        primaryAttachments.map((attachment) => (
                          <p>
                            {attachment.name} :{" "}
                            <a href={attachment.content} target="_blank">
                              {attachment.content}
                            </a>
                          </p>
                        ))}
                      {attachments &&
                        attachments.map((attachment) => (
                          <p>
                            {attachment.name} :{" "}
                            <a href={attachment.content} target="_blank">
                              {attachment.content}
                            </a>
                          </p>
                        ))}
                      <Button
                        type="primary"
                        onClick={() =>
                          navigate("/project/lineage", {
                            state: {
                              user: "ins",
                              projectId: projectId,
                            },
                          })
                        }
                      >
                        View History
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
