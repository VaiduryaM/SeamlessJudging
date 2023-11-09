import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spin, Timeline } from "antd";
import ProjectCard from "../Students/ProjectCard";
import { getAPIResponse } from "./Services/Projects/ProjectServices";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getRoutes } from "./Services/Projects/routes";
import { LoadingOutlined } from "@ant-design/icons";
import { GetTitle } from "./Utils/GetTitle";

const ProjectHistory = () => {
  const navigate = useNavigate();
  let location = useLocation();
  let projectId = location.state.projectId;

  projectId = projectId ? projectId : localStorage.getItem("projectId");
  const [projectData, setProjectData] = useState();
  const [loading, setLoading] = useState(true);

  const getProjectData = async () => {
    let url = getRoutes("projectHistory", { projectId: projectId });
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setProjectData(res.data.project_history);
      setLoading(false);
    } else {
      setLoading(false);
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  useEffect(() => {
    getProjectData();
  }, []);
  return (
    <Card
      title={<GetTitle title={"Project History"} onClick={navigate} />}
      className="Border-Style"
      hoverable={true}
    >
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" indicator={<LoadingOutlined />} tip="Loading..." />
        </div>
      ) : (
        <div
          style={{
            overflowY: "scroll",
            height: "80vh",
          }}
        >
          <Timeline>
            {projectData &&
              projectData.map((project, index) => {
                let desc =
                  project.description && project.description.length > 44
                    ? project.description.slice(0, 44) + "..."
                    : project.description;
                return (
                  <Timeline.Item>
                    <ProjectCard
                      key={String(project.key)}
                      title={project.name}
                      projectType={project.projectTypes.map((ptype) => ({'name':ptype.projectType}))}
                      desc={project.description ? project.description : "-"}
                      semester={project.courseCode.semester + " " + project.courseCode.year}
                      history={true}
                      projectId={project.projectId}
                    />
                  </Timeline.Item>
                );
              })}
          </Timeline>
        </div>
      )}
    </Card>
  );
};
export default ProjectHistory;
