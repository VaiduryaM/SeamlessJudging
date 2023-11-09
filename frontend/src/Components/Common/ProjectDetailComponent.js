import React, { useState, useEffect } from "react";
import {
  InfoCircleTwoTone,
} from "@ant-design/icons";
import { Card, Col, Row, Button, Spin, Space, Tag, Image, Modal } from "antd";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "./Services/Projects/ProjectServices";
import UserDetailComponent from "../Instructor/UserDetailComponent";
import { getRoutes } from "./Services/Projects/routes";
import { LoadingOutlined } from "@ant-design/icons";
import { GetTitle } from "../Common/Utils/GetTitle";
import InsModalComp from "../Instructor/InsModalComp";
import ProjectDetails  from "./InsCliProjectDetails";
// export default async function getUserDetailComponent(user){
  const openStudentInfoPopup = async(id)=>{
    let url = getRoutes("userDetails", { userId: id});
    let res = await getAPIResponse(url, "GET");
    let user = [];
    if (res.status == 200) {
        user = res.data;
        // console.log(" html = ", getUserDetailComponent(user));
        Modal.info({
          icon: <InfoCircleTwoTone />,
          width: "80%",
          title: "Student Details",
          content: <Card><UserDetailComponent user={res.data} /></Card>,
    
          onOk() {},
          okText: "Close",
        });
    }
    // ReactDOM.render(<Modal show="true"><p>ABGFJFJJ</p><UserDetails/></Modal>);
  };

const ProjectDetailComponent = (data) => {
    let project = data.project;
    let fromStudentview = data.fromStudentview;
    return (
        // <Card>
        <span>
                  {/* <Col span={16}> */}
                  <p>
                      <span className="fw-600">Name: </span>
                      {project.name}
                    </p>
                    <p>
                      <span className="fw-600">Team Size: </span>
                      {project.team_size}
                    </p>
                    <p>
                      <span className="fw-600">Type: </span>
                      {project.project_types.map((pTypeName) => (
                        <Tag
                          color="geekblue"
                          className="Border-Style"
                          style={{ fontSize: "14px" }}
                        >
                          {pTypeName.name}
                        </Tag>
                      ))}
                      {/* <Tag
                        color="geekblue"
                        className="Border-Style"
                        style={{ fontSize: "14px" }}
                      >
                        {project.project_type_name}
                      </Tag> */}
                    </p>
                    <p>
                      <span className="fw-600">Client Representative: </span>
                      {project.team.map((member) => (
                        member.role=="CLIENT" && 
                        <Tag
                          color="geekblue"
                          className="Border-Style"
                          style={{ fontSize: "14px" }}
                        >
                          {member.user.email}
                        </Tag>
                      ))}
                    </p>
                    <p>
                      <span className="fw-600">Enrolled Students: </span>
                      {project.team.map((member) => (
                        member.role == "STUDENT" && member.status=="ENROLLED" && 
                        <>
                          <Image
                            src={member.user.image}
                            style={{
                              borderRadius: "50%",
                              border: "1px solid white",
                            }}
                            width={50}
                          />
                          {!fromStudentview ? 
                          <Tag
                            color="geekblue"
                            className="Border-Style"
                            style={{ fontSize: "14px", cursor:"pointer" }}
                            onClick={() =>
                              openStudentInfoPopup(member.user.user_id)
                            }
                          >
                            {member.user.PrefferedName}
                          </Tag> : (<Tag
                            color="geekblue"
                            className="Border-Style"
                            style={{ fontSize: "14px"}}
                          >
                            {member.user.PrefferedName}
                          </Tag>)}
                        </>
                      ))}
                    </p>
                    <p>
                      <span className="fw-600">Waitlist Students: </span>
                      {project.team.map((member) => (
                        member.role == "STUDENT" && member.status=="WAITLIST" && 
                        <>
                          <Image
                            src={member.user.image}
                            style={{
                              borderRadius: "50%",
                              border: "1px solid white",
                            }}
                            width={50}
                          />
                          {!fromStudentview ? 
                          <Tag
                            color="yellow"
                            className="Border-Style"
                            style={{ fontSize: "14px", cursor:"pointer" }}
                            onClick={() =>
                              openStudentInfoPopup(member.user.user_id)
                            }
                          >
                            {member.user.PrefferedName}
                          </Tag> :(<Tag
                            color="yellow"
                            className="Border-Style"
                            style={{ fontSize: "14px"}}
                          >
                            {member.user.PrefferedName}
                          </Tag>)}
                        </>
                      ))}
                    </p>
                    <p>
                      <span className="fw-600">Description:</span>
                    </p>
                    <p>{project.description}</p>
                {/* </Col> */}
            </span>
            // </Card>
    );
};
export default ProjectDetailComponent;
