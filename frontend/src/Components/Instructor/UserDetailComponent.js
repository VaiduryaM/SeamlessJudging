import React from "react";
import { Card, Col, Row, Button, Tag} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons/";
import { deleteUserProfilePic, changeUserProfilePic } from "../Students/Services/StudentServices";
const UserDetailComponent = (data) => {
    let user = data.user;
    return (
        <span>
        <Row
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
                    id="userImg"
                    src={user.image}
                    class = {user.image==""? "defaultImg profileDetail": "profileDetail"}
                    title = {user.image=="" && user.first_name.length>0 && user.last_name.length>0? user.first_name[0]+user.last_name[0]: ""}
                    />
                    <div style={{display: "flex"}}>
                <label className="custom-file-upload">
                <input type="file" user_id={user.user_id} onChange={changeUserProfilePic} id="file-upload" />
                  <UploadOutlined />
                  Upload  
                </label>
                  <Button
                  icon={<DeleteOutlined />}
                  shape="circle"
                  type="danger"
                  style={{ marginTop: "5px", marginLeft:"10px" }}
                  onClick={() => deleteUserProfilePic(user.user_id)}
                ></Button>
              </div>
                    </Col>
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
                {(user.displayproject && (((user.enrollmentDetails.position === "ENROLLED" || user.enrollmentDetails.position === "WAITLIST") && user.isStudent) || !user.isStudent))? (
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
                </Row>
            </span>
    );
};
export default UserDetailComponent;