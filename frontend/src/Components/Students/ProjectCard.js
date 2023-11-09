import { Row, Col, Card, Button, Space, Tag } from "antd";
import React from "react";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { getRoutes } from "../Common/Services/Projects/routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InsModalComp from "../Instructor/InsModalComp";

const ProjectCard = ({
  title,
  type,
  projectType,
  desc,
  currentlyEnrolled,
  currentlyFinalized,
  semester,
  history,
  projectId,
  courseCodeId,
  status,
  teamSize,
}) => {
  const enrolledProjectId = localStorage.getItem("projectId");
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  console.log(currentlyFinalized);
  const projectStatus = currentlyFinalized > 0 ? 'FINALIZED' : status;
  console.log("loc: ", location);
  console.log("pid: ", projectId);
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
      // navigate(location.pathname);
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  return (
    <>
      <Row>
        <Col className="mb-3" span={24}>
          <Card className="Border-Style" hoverable={true}>
            <Row>
              <Col md={8} sm={12}>
                <p className="text-small fw-600">{title}</p>
                <p className="mt-2">{desc} </p>
              </Col>
              <Col md={8} sm={12}>
                <p>
                  <span className="fw-600">Type: </span>
                  {projectType.map((pType)=>{
                    return(
                      <Tag
                      color="gray" //Need to check UI
                      className="Border-Style"
                    >
                      {pType.name}
                    </Tag>)
                  })}
                </p>
                {history ? (
                  <p className="mt-2">
                    <span className="fw-600">Semester </span>: {semester}
                  </p>
                ) : (
                  <p className="mt-2">
                    <span className="fw-600">Enrolled: </span>
                    {currentlyEnrolled} / {teamSize}
                  </p>
                )}
              </Col>
              <Col md={8} sm={12} align="middle">
                <Space direction="">
                  {!history &&
                    (projectId == enrolledProjectId ? (
                      <InsModalComp
                        buttonText={"Unenroll"}
                        buttonType={"primary"}
                        // buttonDisabled={true}
                        modalText={"Are you sure you want to unenroll?"}
                        onOkFunc={unEnrollProject}
                        isDanger={true}
                      />
                    ) : (
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
                        disabled={(enrolledProjectId > 0 || currentlyFinalized > 0) ? true : false}
                      >
                        Enroll
                      </Button>
                    ))}
                  <Button
                    className=""
                    onClick={() => {
                      if (location.state && location.state.user === "ins") {
                        navigate("/project/insclidetails", {
                          state: {
                            projectId: projectId,
                            courseCodeId: courseCodeId,
                          },
                        });
                      } else {
                        navigate("/project/details", {
                          state: {
                            projectId: projectId,
                            courseCodeId: courseCodeId,
                            status:
                              (projectId == enrolledProjectId || currentlyFinalized > 0)
                                ? projectStatus
                                : "NOT FINALIZED",
                          },
                        });
                      }
                    }}
                  >
                    Details
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProjectCard;
