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
  Layout,
  Descriptions,
  Tooltip,
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
import { getAllProjects } from "../Common/Services/Projects/ProjectsService";
import Appbar from "../Main/Appbar/Appbar";
import { useNavigate, useParams } from "react-router-dom";
import { getPublicEventDetailsById } from "../Common/Services/Events/EventsServices";
import Spinner from "../Common/Spinner";
const { Header, Sider, Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const PublicDashBoardEventsById = () => {
  const [filterForm] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const navigate = useNavigate();
  const [eventData, setEventData] = useState();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const event_id = params.ID;

  const PopulateData = async () => {
    setLoading(true);
    const result = await getPublicEventDetailsById(event_id);
    if (result.status === 200) {
      setEventData(result.data);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };

  const onClickLogo = () => {
    navigate("/public/events");
  };

  const onCardInfoClick = (projectData) => {
    const teamData = projectData.team.map((obj) => {
      return (
        <>
          <Tag icon={<UserOutlined />} color="volcano">
            {obj.first_name + " " + obj.last_name + " - " + obj.email}
          </Tag>
        </>
      );
    });
    Modal.info({
      icon: <InfoCircleTwoTone />,
      width: "80%",
      title: projectData.name + " details",
      content: (
        <Descriptions size="large" bordered column={1}>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Project Name:</div>}
          >
            {projectData.name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Description:</div>}
          >
            {projectData.description}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Project Type:</div>}
          >
            {projectData.project_type_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Course Code Name:</div>}
          >
            {projectData.course_code_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div style={{ fontWeight: "bold" }}>Team:</div>}
          >
            {projectData.team.length ? teamData : "NA"}
          </Descriptions.Item>
        </Descriptions>
      ),

      onOk() {},
      okText: "Close",
    });
  };

  useEffect(() => {
    PopulateData();
    setLoading(false);
  }, [refresh]);
  return (
    <div className="site-card-wrapper">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        {/* <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "black",
          }}
        >
          <Row>
            <Col style={{ marginLeft: "41px" }}>
              <Avatar
                icon={
                  <Tooltip placement="bottom" title="Events Dashboard">
                    <HomeOutlined onClick={onClickLogo} />
                  </Tooltip>
                }
              />
            </Col>
            <Col style={{ marginLeft: "37%" }}>
              <h2 style={{ color: "white", fontSize: "23px" }}>
                {!loading && eventData ? (
                  <>
                    <RocketOutlined
                      style={{ color: "#1890ff", fontSize: "35px" }}
                      onClick={onClickLogo}
                    />
                    &nbsp;&nbsp;{eventData.name}
                  </>
                ) : null}
              </h2>
            </Col>
          </Row>
        </Header> */}
        <Layout className="site-layout">
          <Content
            style={{
              margin: "0 16px",
              background: "#f0f2f5",
              marginTop: "1%",
            }}
          >
            {!loading && eventData ? (
              <Card
                title={eventData.name}
                className="Border-Style"
                hoverable
                bodyStyle={{
                  overflowY: "scroll",
                  height: "80vh",
                }}
              >
                <Descriptions
                  size="large"
                  bordered
                  column={1}
                  contentStyle={{ borderRadius: "1.2rem" }}
                >
                  <Descriptions.Item
                    label={
                      <div style={{ fontWeight: "bold" }}>Description:</div>
                    }
                  >
                    {eventData.description}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<div style={{ fontWeight: "bold" }}>Location:</div>}
                  >
                    {
                      <Tag className="Border-Style" color="#108ee9">
                        {eventData.location}
                      </Tag>
                    }
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <div style={{ fontWeight: "bold" }}>
                        Start and End dates:
                      </div>
                    }
                  >
                    {eventData.hasOwnProperty("date")
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(Date.parse(eventData.date[0])) +
                        " to " +
                        new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(Date.parse(eventData.date[1]))
                      : ""}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<div style={{ fontWeight: "bold" }}>Sponsors:</div>}
                  >
                    {eventData.sponsors.map((obj) => {
                      return (
                        <Tag
                          icon={<DingtalkOutlined />}
                          color="#f50"
                          className="Border-Style"
                        >
                          {obj.name}
                        </Tag>
                      );
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<div style={{ fontWeight: "bold" }}>Judges:</div>}
                  >
                    {eventData.judges.map((obj) => {
                      return (
                        <Tag color="green" className="Border-Style">
                          {obj.first_name + " " + obj.last_name}
                        </Tag>
                      );
                    })}
                  </Descriptions.Item>
                </Descriptions>
                <Divider />

                <p style={{ color: "midnightblue", fontWeight: "bold" }}>
                  Projects
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
                  dataSource={eventData.projects}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        key="123"
                        className="Border-Style ant-card-cursor"
                        hoverable
                        cover={
                          <img
                            className="Border-Style"
                            alt="example"
                            src={require("../Common/images/sea.JPG")}
                          />
                        }
                        onClick={() => {
                          onCardInfoClick(item);
                        }}
                      >
                        <Meta
                          avatar={
                            <Avatar src="https://joeschmoe.io/api/v1/random" />
                          }
                          title={item.name}
                          description={item.course_code_name}
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            ) : (
              <Spinner />
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default PublicDashBoardEventsById;
