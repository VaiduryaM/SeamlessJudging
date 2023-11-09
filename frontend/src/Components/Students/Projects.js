import React, { useContext, useEffect, useState } from "react";
import { Tabs, Layout, Spin, Col, Select, Space } from "antd";
import ProjectCard from "./ProjectCard";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getRoutes } from "../Common/Services/Projects/routes";
import { useParams } from "react-router-dom";
import { getUserActions } from "../Common/Utils/userFunctions";
import { MainContext } from "../../Context/MainContext";
import { LoadingOutlined } from "@ant-design/icons";

const  Option =Select.Option
const Projects = () => {
  const params = useParams();

  const { studentActions } = getUserActions(params.courseId);
  const { setActions } = useContext(MainContext);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState();

  let courseId = params.courseId;
  const [projectData, setProjectData] = useState({
    currentProjects: [],
    pastProjects: [],
  });
  const [currentProjects, setcurrentProjects] = useState([]);
  const [pastProjects, setpastProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const getProjectTypes = async () => {
    let url = process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/project-type`;
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      setProjectTypes(res.data);
    } else {
      console.log("No project data found");
    }
  };
  const handleTabSwitch = (key) => {
      if (key == 2){
        setProjectData({
          currentProjects: currentProjects,
          pastProjects: pastProjects,
        });
      }
  };

  const getProjectData = async () => {
    let url = getRoutes("allProjects", { courseCodeId: courseId });
    let result = await getAPIResponse(url, "GET");
    if (result.status == 200) {
      setProjectData({
        currentProjects: result.data.currentProjects,
        pastProjects: result.data.pastProjects,
      });
      setcurrentProjects(result.data.currentProjects);
      setpastProjects(result.data.pastProjects);
      setStatus(result.data.status);
      setLoading(false);
      localStorage.setItem("projectId", result.data.enrolledProjectId);
      localStorage.setItem("status", result.data.status);
    } else {
      setLoading(false);
      NotificationHandler("failure", "Failed", result.message);
    }
  };

  useEffect(() => {
    setActions((prev) => [
      ...prev.filter((item) => item.key !== "studentActions"),
      ...studentActions,
    ]);
    getProjectData();
    getProjectTypes();
  }, [params.courseId]);

  let viewToDisplay = (type) => {
    let projects = [];
    if (type === "current") {
      projects = projectData.currentProjects;
    } else {
      projects = projectData.pastProjects;
    }

    if (projects.length === 0) {
      return (
        <div className="text-center mt-4">
          <h4>No projects available</h4>
        </div>
      );
    }
    return projects.map((project, index) => {
      if (project.hasOwnProperty("name")) {
        let desc =
          project.description && project.description.length > 44
            ? project.description.slice(0, 44) + "..."
            : project.description;

        return (
          <Col span={24}>
            <ProjectCard
              key={String(index)}
              type={type}
              title={project.name}
              projectType={project.project_types}
              projectId={project.project_id}
              courseCodeId={courseId}
              //currentlyEnrolled={project.teams.length}
              currentlyEnrolled={project.team ? project.team.filter(function(item){return item.role == "STUDENT";}).length : 0}
              currentlyFinalized={project.finalizedNames ? project.finalizedNames.length : 0}
              teamSize={project.team_size}
              desc={desc ? desc : "-"}
              status={status}
              semester={project.semester}
            />
          </Col>
        );
      }
    });
  };

  return (
    <div>
      <div>
      <div>Filter By Project type  </div>
      <div>
      <Select
                  style={{ width: '50%' }}
                  // mode="multiple"
                  mode="multiple"
                  onChange={(values) => {
                    if (values.length>0){
                      setProjectData({
                        // x.project_type_ids.includes(values) 
                        currentProjects: currentProjects.filter(x => x.project_types.some(pType => values.includes(pType.Id))),
                        pastProjects: projectData.pastProjects,
                      });
                    }else{
                      setProjectData({
                        // x.project_type_ids.includes(values) 
                        currentProjects: currentProjects,
                        pastProjects: projectData.pastProjects,
                      });
                    }
                  }}
                  tokenSeparators={[',']}
                  allowClear
                  // optionFilterProp="children"
                  placeholder="Select Project Type"
                  popupClassName="Border-Style"
                  showSearch
                  filterOption={(inputValue, option) =>
                    option.props.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                  }
                  options={projectTypes.map((project) => ({
                    value: project.project_type_id,
                    label: project.project_type,
                  }))}
                >
      </Select>
      </div>
    </div>
    <div>
      <Tabs
        defaultActiveKey="1"
        onChange={handleTabSwitch}
        type="line"
        items={[
          {
            label: "Current Projects",
            key: "1",
            children: loading ? (
              <div style={{ textAlign: "center" }}>
                <Spin
                  size="large"
                  indicator={<LoadingOutlined />}
                  tip="Loading..."
                />
              </div>
            ) : (
              <div
                style={{
                  overflowY: "scroll",
                  height: "80vh",
                }}
              >
                {viewToDisplay("current")}
              </div>
            ),
          },
          {
            label: "Past Projects",
            key: "2",
            children: (
              <div
                style={{
                  overflowY: "scroll",
                  height: "100vh",
                }}
              >
                {viewToDisplay("past")}
              </div>
            ),
          },
        ]}
      />
      </div>
    {/* <div>
      <h1>Select Fruits</h1>
      <Select
                  mode="multiple"
                  placeholder="Select Project Type"
                  popupClassName="Border-Style"
                >
                  {projectTypes.map((project) => (
                    <Option value={project.project_type_id}>
                      {project.project_type}
                    </Option>
                  ))}
      </Select>
    </div> */}
  </div>
  );
};

export default Projects;
