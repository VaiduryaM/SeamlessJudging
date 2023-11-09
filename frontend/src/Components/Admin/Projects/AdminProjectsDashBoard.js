/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Space,
  Button,
  Modal,
  Drawer,
  PageHeader,
  Tag,
  Input,
  List,
  Divider,
  Popover,
  Form,
  Select,
} from "antd";
import { Col, Row } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RocketOutlined,
  FunnelPlotOutlined,
  DownloadOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import AdminAddProject from "./AdminAddProject";
import { getAllProjects } from "../../Common/Services/Projects/ProjectsService";
import ParticipantAddProject from "../../Participants/Projects/MyProjects/ParticipantAddProject";
import {
  getDashboardFilePathById,
  getRefDataByType,
} from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;
const AdminProjectsDashBoard = () => {
  const navigate = useNavigate();
  const [refData, setRefData] = useState({
    projectTypesRefData: [],
    courseCodeRefData: [],
  });
  const [filterForm] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);

  const [projectsData, setProjectsData] = useState([
    { onGoingProjects: [], allProjectsData: [] },
  ]);
  const [loading, setLoading] = useState(true);

  const handleOpenFilters = (newVisible) => {
    setOpenFilters(newVisible);
  };

  const onFinishFilters = async (values) => {
    setLoading(true);
    let queryString = null;
    if (
      typeof values.name != "undefined" &&
      typeof values.course_codes != "undefined"
    ) {
      queryString = `?name=${values.name}&course_codes=[${values.course_codes}]`;
    } else if (typeof values.name != "undefined") {
      queryString = `?name=${values.name}`;
    } else if (typeof values.course_codes != "undefined") {
      queryString = `?course_codes=[${values.course_codes}]`;
    }
    const result = await getAllProjects(queryString);
    if (result.status === 200) {
      NotificationHandler(
        "success",
        "Success!",
        "Filters applied successfully!"
      );
      setProjectsData({
        allProjectsData: result.data.all_projects,
        onGoingProjects: result.data.ongoing_projects,
      });
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };

  const onCancelFilter = async () => {
    filterForm.resetFields();
    const result = await getAllProjects(null);
    if (result.status === 200) {
      NotificationHandler(
        "success",
        "Success!",
        "Filters cleared successfully!"
      );
      setProjectsData({
        allProjectsData: result.data.all_projects,
        onGoingProjects: result.data.ongoing_projects,
      });
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const onCardInfoClick = (ID) => {
    navigate("/admin/projects/" + ID);
  };
  const handleAddProject = () => {
    setShowAddProject(true);
  };
  const PopulateProjects = async () => {
    setLoading(true);
    const result = await getAllProjects(null);
    if (result.status === 200) {
      setProjectsData({
        onGoingProjects: result.data.ongoing_projects,
        allProjectsData: result.data.all_projects,
      });
    }
  };
  const getRefData = async () => {
    const projectTypeData = await getRefDataByType("project-type");
    const courseCodeData = await getRefDataByType("course-code");
    setRefData({
      projectTypesRefData: projectTypeData.data,
      courseCodeRefData: courseCodeData.data,
    });
  };
  const searchFilterComponent = (
    <Form
      form={filterForm}
      name="serachform"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinishFilters}
    >
      <Form.Item label="Name" name="name" key="project_name">
        <Input allowClear />
      </Form.Item>
      <Form.Item label="Course Code" name="course_codes" key="course_code">
        <Select
          mode="multiple"
          style={{
            width: "100%",
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Please select"
          allowClear
          //onChange={onChangeFilterCourseCode}
        >
          {refData.courseCodeRefData.length
            ? refData.courseCodeRefData.map((obj) => {
                return (
                  <Option value={obj.course_code_id} key={obj.course_code_id}>
                    {obj.code}
                  </Option>
                );
              })
            : null}
        </Select>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            //loading={loading}
            size="small"
          >
            Apply
          </Button>
          <Button
            type="danger"
            onClick={() => {
              onCancelFilter();
            }}
            size="small"
          >
            Clear
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
  const loadDownloadLinks = async () => {
    const projectFile = await getDashboardFilePathById("project");
    if (projectFile.status === 200) {
      const url = process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/content/download?path=${projectFile.data.download_path}`;
      window.open(url);
    } else {
      NotificationHandler("failure", "Failed!", projectFile.message);
    }
  };
  useEffect(() => {
    PopulateProjects();
    getRefData();
    setLoading(false);
  }, [refresh]);

  return (
    <div className="site-card-wrapper">
      {showAddProject && (
        <ParticipantAddProject
          showAddProject={showAddProject}
          setShowAddProject={setShowAddProject}
          refData={refData}
          setRefresh={setRefresh}
        />
      )}

      <PageHeader
        title="Projects"
        className="site-page-header"
        subTitle="dashboard"
        extra={[
          <Popover
            placement="bottom"
            overlayClassName="wrapper-notify"
            content={<>{searchFilterComponent}</>}
            trigger="hover"
            visible={openFilters}
            onVisibleChange={handleOpenFilters}
          >
            <Button
              key="filters"
              icon={<FunnelPlotOutlined />}
              size="middle"
              type="primary"
              //style={{ background: "#52c41a", color: "white" }}
            >
              filters
            </Button>
          </Popover>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={handleAddProject}
          ></Button>,

          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            size="middle"
            onClick={loadDownloadLinks}
          ></Button>,
        ]}
        avatar={{ icon: <ProjectOutlined /> }}
      >
        <p style={{ color: "midnightblue", fontWeight: "bold" }}>
          Ongoing Projects
        </p>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 5,
            xxl: 6,
          }}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
          }}
          loading={loading}
          dataSource={projectsData.onGoingProjects}
          renderItem={(item) => (
            <List.Item>
              <Card
                key="123"
                hoverable
                cover={
                  <img
                    alt="example"
                    src={require("../../Common/images/2.JPG")}
                  />
                }
                onClick={() => {
                  onCardInfoClick(item.project_id);
                }}
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={item.name}
                  description={item.course_code}
                />
              </Card>
            </List.Item>
          )}
        />
        <Divider />
        <p style={{ color: "midnightblue", fontWeight: "bold" }}>
          Past Projects
        </p>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 5,
            xxl: 6,
          }}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
          }}
          dataSource={projectsData.allProjectsData}
          renderItem={(item) => (
            <List.Item>
              <Card
                key="123"
                hoverable
                cover={
                  <img
                    alt="example"
                    src={require("../../Common/images/2.JPG")}
                  />
                }
                onClick={() => {
                  onCardInfoClick(item.project_id);
                }}
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={item.name}
                  description={item.course_code}
                />
              </Card>
            </List.Item>
          )}
        />
      </PageHeader>
      <br />
    </div>
  );
};

export default AdminProjectsDashBoard;
