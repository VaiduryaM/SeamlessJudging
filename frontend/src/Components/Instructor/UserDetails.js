import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Col, Row, Button, Spin, Space, Tag, Image } from "antd";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { getRoutes } from "../Common/Services/Projects/routes";
import { LoadingOutlined } from "@ant-design/icons";
import { GetTitle } from "../Common/Utils/GetTitle";
import InsModalComp from "../Instructor/InsModalComp";
import UserDetailComponent from "../Instructor/UserDetailComponent";


const UserDetails = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [primaryAttachments, setPrimaryAttachments] = useState();
  const [attachments, setAttachments] = useState();
  const navigate = useNavigate();
  let location = useLocation();

  let userId = location.state.userId;
  let from = location.state.from;

  let associatedProjectId = localStorage.getItem("projectId");
  let status = localStorage.getItem("status");


  const getUserData = async () => {
    let url = getRoutes("userDetails", { userId: userId, fromPage: from });
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      res.data.isUserDetailPage = true;
      setUser(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      setUser();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

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
          {user ? (
            <div>
              
              <Card
                title={
                  <GetTitle title={user.title} onClick={navigate} />
                }
                className="Border-Style"
              >
                <UserDetailComponent user={user}/>
                {/*<Row
                    style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "flex-start",
                    padding: "20px",
                    flexDirection: "row",
                    }}
                ><Col md={8} sm={16}>
                <p><span class="fw-600">Roles: </span>
                    {user.roles.map((role) => {
                        let color = "geekblue";
                        return (
                        <Tag
                            color={color}
                            className="Border-Style"
                            style={{ margin: "2px" }}
                        >
                            {role}
                        </Tag>
                        );
                    })}
                </p>
                </Col>
                <Col md={8} sm={16}>
                    <img
                    src={user.image}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                    width="100"
                    height="100"
                    /></Col>
                {user.isStudent || user.hasProjectAssoc ? (
                <Col md={8} sm={16}>{user.isStudent && user.enrollmentDetails.position !== "" ? (<p><span class="fw-600">Status: </span>
                {user.enrollmentDetails.position === "FINALIZED" ? (
                    <Tag color={"green"} className="Border-Style">
                        Finalized
                    </Tag>
                ) : (user.enrollmentDetails.position === "ENROLLED" ? (
                    <Tag color={"orange"} className="Border-Style">
                        Enrolled
                    </Tag>
                ) : (user.enrollmentDetails.position === "UNENROLLED" ? (
                    <Tag color={"red"} className="Border-Style">
                        Unenrolled
                    </Tag>
                ) : (user.enrollmentDetails.position !== ""?(
                    <Tag color={"yellow"} className="Border-Style">
                        Waitlist
                    </Tag>):(<span></span>)
                )))}</p>): (<span></span>)}
                {user.displayproject && user.isStudent ? (
                <p><span class="fw-600">Course: </span>
                    {user.enrollmentDetails.courseName.map((cname) => {return (
                    <Tag color={"blue"} className="Border-Style">
                        {cname && cname > 20
                        ? cname.slice(0, 20) + "..."
                        : cname}
                    </Tag>)})}
                </p>): (<span></span>)}
                {(user.displayproject && ((user.enrollmentDetails.position === "ENROLLED" && user.isStudent) || !user.isStudent))? (
                    <p><span class="fw-600">Project Name: </span>
                    {user.enrollmentDetails.projectName.map((pname) => {return (
                        <Tag color={"geekblue"} className="Border-Style">
                        {pname && pname > 20
                          ? pname.slice(0, 20) + "..."
                          : pname}
                      </Tag>
                    )})}
                    </p>
                ):(
                    <span></span>
                )}
                </Col>):(<span></span>)}
                </Row>
                <Row>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">First Name: </span>{user.first_name}</p>
                    </Col>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">Middle Name: </span>{user.middle_name}</p>
                    </Col>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">Last Name: </span>{user.last_name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">Preferred Name: </span>{user.PrefferedName}</p>
                    </Col>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">Email: </span>{user.email}</p>
                    </Col>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">GitHub ID: </span>{user.Github}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">Phone: </span>{user.Phone}</p>
                    </Col>
                    <Col md={8} sm={12}>
                        <p><span class="fw-600">Social Link: </span>{user.SocialLinks}</p>
                    </Col>
                </Row>*/}
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

export default UserDetails;
