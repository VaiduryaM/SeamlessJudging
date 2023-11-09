import { Button, Col, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { getRoutes } from "../Common/Services/Projects/routes";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const InsModalWithContent = ({
  buttonText,
  name,
  email,
  courseId,
  projectId,
}) => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [enrollProject, setEnrollProject] = useState(0);

  const navigate = useNavigate();
  const getAllProjects = async () => {
    let url = getRoutes("insAllProjects");

    let response = await getAPIResponse(url, "GET");
    if (response.status === 200) setProjects(response.data.currentProjects);
  };

  const enrollStudent = async (enrollProjectId) => {
    if (!enrollProjectId) {
      NotificationHandler("failure", "Failed", "Please select a project");
      return;
    }

    let enrollUrl = getRoutes("allocation", { enrollProjectId });
    let dummyCourseCodeId = 1;
    let enrollBody = {
      projectId: enrollProject,
      students: [email],
      unenrollments: [
        {
          projectId: projectId,
          students: [email],
          year: 2022,
        },
      ],
      courseCodeId: dummyCourseCodeId,
      year: 2022,
    };

    let response = await getAPIResponse(enrollUrl, "POST", enrollBody);

    if (response.status === 200) {
      setOpen(false);
      NotificationHandler("success", "Success", "Enrollment successfull");
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } else if (response.data.code === "TEAM_SIZE_EXCEEDED") {
      NotificationHandler("failure", "Failure", "Team size exceeded");
    } else {
      NotificationHandler(
        "failure",
        "Failure",
        "Something went wrong, please try again"
      );
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonText}</Button>
      <Modal
        title="Please select the project to enroll"
        centered
        open={open}
        onOk={() => {
          enrollStudent(enrollProject);
        }}
        onCancel={() => setOpen(false)}
        width={600}
      >
        <Row>
          <Col>
            <p>
              <span className="fw-600">Name: </span>
              {name}
            </p>
          </Col>
          <Col offset={8}>
            <p>
              <span className="fw-600">Email: </span> {email}
            </p>
          </Col>
        </Row>

        {projects.length ? (
          <Select
            popupClassName="Border-Style"
            showSearch
            placeholder="Select or Search a Project"
            optionFilterProp="children"
            mode="single"
            style={{
              width: "100%",
            }}
            onChange={(value) => setEnrollProject(value)}
          >
            {projects.map((project) => (
              <Option value={project.project_id} key={project.project_id}>
                {project.name}
              </Option>
            ))}
          </Select>
        ) : (
          <p>No projects found</p>
        )}
      </Modal>
    </>
  );
};
export default InsModalWithContent;
