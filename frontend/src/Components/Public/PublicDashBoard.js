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
  ProjectOutlined,
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
const PublicDashBoard = () => {
  const [filterForm] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    upComingEventsData: [],
    pastEventsData: [],
  });
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const event_id = params.ID;

  const PopulateData = async () => {
    setLoading(true);
    const result = await getPublicEventDetailsById(null);
    if (result.status === 200) {
      setEventData({
        upComingEventsData: result.data.upcoming_events,
        pastEventsData: result.data.past_events,
      });
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };
  const onCardInfoClick = (ID) => {
    navigate("/public/events/" + ID);
  };
  useEffect(() => {
    PopulateData();
  }, [refresh]);

  return (
    <div className="Border-Style">
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
          <Row align="middle" style={{ marginLeft: "42%" }}>
            <Col
              xs={{ span: 18 }}
              lg={{ span: 20 }}
              xl={{ span: 21 }}
              xxl={{ span: 22 }}
            >
              <h2 style={{ color: "white", fontSize: "23px" }}>
                {!loading && eventData ? (
                  <>
                    <RocketOutlined
                      style={{ color: "#1890ff", fontSize: "35px" }}
                      onClick={() => {}}
                    />
                    &nbsp;&nbsp;Events Dashboard
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
            {!loading ? (
              <Card
                title="Events"
                className="Border-Style"
                hoverable="true"
                bodyStyle={{
                  overflowY: "scroll",
                  height: "78vh",
                }}
              >
                <>
                  <p style={{ color: "midnightblue", fontWeight: "bold" }}>
                    Upcoming Events
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
                    dataSource={eventData.upComingEventsData}
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
                              src={require("../Common/images/statue.JPG")}
                            />
                          }
                          onClick={() => {
                            onCardInfoClick(item.event_id);
                          }}
                        >
                          <Meta
                            avatar={<Avatar icon={<ProjectTwoTone />} />}
                            title={item.name}
                            description={item.location}
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <p style={{ color: "midnightblue", fontWeight: "bold" }}>
                    Past Events
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
                    dataSource={eventData.pastEventsData}
                    renderItem={(item) => (
                      <List.Item>
                        <Card
                          key="past"
                          className="Border-Style"
                          hoverable
                          cover={
                            <img
                              className="Border-Style ant-card-cursor"
                              alt="example"
                              src={require("../Common/images/statue.JPG")}
                            />
                          }
                          onClick={() => {
                            onCardInfoClick(item.event_id);
                          }}
                        >
                          <Meta
                            avatar={<Avatar icon={<ProjectTwoTone />} />}
                            title={item.name}
                            description={item.location}
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </>
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

export default PublicDashBoard;
