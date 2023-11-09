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
  Form,
  Select,
  Popover,
} from "antd";
import { Col, Row } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  FunnelPlotOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ProjectOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import OtherViewModal from "./OtherProjects/OtherProjectsViewModal";
import ParticpantJoinRequest from "./Requests/ParticpantJoinRequest";
import ParticipantAddProject from "./MyProjects/ParticipantAddProject";
import { getAllProjects } from "../../Common/Services/Projects/ProjectsService";
import { joinProjectById } from "../Services/PartcipantServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { getRefDataByType } from "../../Admin/Services/AdminServices";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const { Meta } = Card;
const { Option } = Select;
const ParticpantsProjectsDashBoard = () => {
  const [filterForm] = Form.useForm();
  const navigate = useNavigate();
  const [showAddProject, setShowAddProject] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [showOtherProjectsViewModal, setShowOtherProjectsViewModal] =
    useState(false);
  const [requestInfo, setRequestInfo] = useState({
    showRequestModal: false,
    requestType: "",
    requestMsg: "",
    projectId: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projectsData, setProjectsData] = useState([
    { myProjectsData: [], onGoingProjectsData: [] },
  ]);
  const [refData, setRefData] = useState({
    projectTypesRefData: [],
    courseCodeRefData: [],
  });
  const handleOpenFilters = (newVisible) => {
    setOpenFilters(newVisible);
  };
  const onSearchProjects = async (name) => {
    setLoading(true);
    const result = await getAllProjects(name);
    setProjectsData({
      myProjectsData: result.data.my_projects,
      onGoingProjectsData: result.data.ongoing_projects,
    });
    setLoading(false);
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
        myProjectsData: result.data.my_projects,
        onGoingProjectsData: result.data.ongoing_projects,
      });
    } else {
      NotificationHandler("failure", "Failed!", "Unable to apply filters!");
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
        myProjectsData: result.data.my_projects,
        onGoingProjectsData: result.data.ongoing_projects,
      });
    } else {
      NotificationHandler("failure", "Failed!", "Unable to clear filters!");
    }
  };
  const onCardInfoClick = (ID) => {
    navigate("/participant/projects/" + ID);
  };
  const onOtherProjectsCardClick = (project_id) => {
    setShowOtherProjectsViewModal(true);
    setRequestInfo({
      ...requestInfo,
      projectId: project_id,
    });
  };
  const handleAddEvent = () => {
    setShowAddProject(true);
  };
  const joinOnChangeButton = async (project_id) => {
    const result = await joinProjectById(project_id);
    if (result.status === 400) {
      setRequestInfo({
        ...requestInfo,
        showRequestModal: true,
        requestType: result.data.code,
        requestMsg: result.message,
        projectId: project_id,
      });
    } else {
      setRefresh(true);
      NotificationHandler("success", "Success!", result.message);
    }
  };
  const PopulateProjects = async () => {
    setLoading(true);
    const result = await getAllProjects(null);
    if (result.status === 200) {
      setProjectsData({
        myProjectsData: result.data.my_projects,
        onGoingProjectsData: result.data.ongoing_projects,
      });
    } else {
      NotificationHandler("failure", "Failed!", result.status);
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
  useEffect(() => {
    if (loading || refresh) {
      PopulateProjects();
      getRefData();
      setLoading(false);
    }
    setRefresh(false);
  }, [refresh]);
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
        title="Dashboard"
        className="site-page-header"
        subTitle="projects"
        extra={[
          // <Search
          //   placeholder="input search text"
          //   onSearch={onSearchProjects}
          //   enterButton
          //   allowClear
          //   key="search"
          // />,
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
            onClick={handleAddEvent}
          ></Button>,
        ]}
        avatar={{ icon: <ProjectOutlined /> }}
      >
        <p>My Projects</p>
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
          dataSource={projectsData.myProjectsData}
          renderItem={(item) => (
            <>
              <List.Item>
                <Card
                  key="123"
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src={require("../../Common/images/1.JPG")}
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
            </>
          )}
        />
        <Divider />
        <p>Ongoing Projects</p>
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
          dataSource={projectsData.onGoingProjectsData}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
          }}
          renderItem={(item) => (
            <>
              <List.Item>
                <Card
                  key="123"
                  hoverable
                  cover={
                    <img
                      onClick={() => {
                        onOtherProjectsCardClick(item.project_id);
                      }}
                      alt="example"
                      src={require("../../Common/images/1.JPG")}
                    />
                  }
                  actions={[
                    <Button
                      type="danger"
                      shape="round"
                      onClick={() => {
                        joinOnChangeButton(item.project_id);
                      }}
                    >
                      Join
                    </Button>,
                  ]}
                >
                  <Meta
                    onClick={() => {
                      onOtherProjectsCardClick(item.project_id);
                    }}
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.name}
                    description={item.course_code}
                  />
                </Card>
              </List.Item>
            </>
          )}
        />
      </PageHeader>
      <br />
      {showOtherProjectsViewModal ? (
        <OtherViewModal
          showOtherProjectsViewModal={showOtherProjectsViewModal}
          setShowOtherProjectsViewModal={setShowOtherProjectsViewModal}
          joinOnChangeButton={joinOnChangeButton}
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
        />
      ) : null}
      {requestInfo ? (
        <ParticpantJoinRequest
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
        />
      ) : null}
    </div>
  );
};

export default ParticpantsProjectsDashBoard;
