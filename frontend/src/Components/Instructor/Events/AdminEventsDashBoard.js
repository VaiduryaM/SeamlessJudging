/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Space,
  Button,
  Form,
  Drawer,
  PageHeader,
  Tag,
  Input,
  List,
  Divider,
  Popover,
} from "antd";
import { Col, Row } from "antd";
import {
  DownloadOutlined,
  FunnelPlotOutlined,
  PlusOutlined,
  ProjectOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import AdminAddEvent from "./AdminAddEvent";
import AdminEditEvent from "./AdminEditEvent";
import { Link, useNavigate, useParams } from "react-router-dom";
import ViewEventById from "./ViewEventById";
import { getAllEvents } from "../../Common/Services/Events/EventsServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { getDashboardFilePathById } from "../Services/AdminServices";
const { Search } = Input;
const { Meta } = Card;
const AdminEventsDashBoard = () => {
  const [filterForm] = Form.useForm();
  const [cardsStore, setCardStore] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [eventsData, setEventsData] = useState([
    { upComingEvents: [], pastEvents: [] },
  ]);
  const handleOpenFilters = (newVisible) => {
    setOpenFilters(newVisible);
  };
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onCardInfoClick = (ID) => {
    navigate("/admin/events/" + ID);
  };
  const handleAddEvent = () => {
    setShowAddEvent(true);
  };
  const PopulateEvents = async () => {
    setLoading(true);
    const result = await getAllEvents(null);
    setEventsData({
      upComingEvents: result.data.upcoming_events,
      pastEvents: result.data.past_events,
    });
  };
  useEffect(() => {
    PopulateEvents();
    setLoading(false);
  }, [refresh]);
  const onCancelFilter = async () => {
    filterForm.resetFields();
    const result = await getAllEvents(null);
    if (result.status === 200) {
      NotificationHandler(
        "success",
        "Success!",
        "Filters cleared successfully!"
      );
      setEventsData({
        upComingEvents: result.data.upcoming_events,
        pastEvents: result.data.past_events,
      });
    } else {
      NotificationHandler("failure", "Failed!", "unable to clear filters!");
    }
  };
  const onFinishFilters = async (values) => {
    setLoading(true);
    let queryString = null;
    if (typeof values.name != "undefined") {
      queryString = `?name=${values.name}`;
    }
    const result = await getAllEvents(queryString);
    if (result.status === 200) {
      NotificationHandler(
        "success",
        "Success!",
        "Filters applied successfully!"
      );
      setEventsData({
        upComingEvents: result.data.upcoming_events,
        pastEvents: result.data.past_events,
      });
    } else {
      NotificationHandler("failure", "Failed!", "Unable to apply filters!");
    }
    setLoading(false);
  };
  const loadDownloadLinks = async () => {
    const eventFile = await getDashboardFilePathById("event");
    if (eventFile.status === 200) {
      const url =
        process.env.REACT_APP_LOCAL_DB_URL +
        `/api/v1/content/download?path=${eventFile.data.download_path}`;
      window.open(url);
    } else {
      NotificationHandler("failure", "Failed!", eventFile.message);
    }
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
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          <Button type="primary" htmlType="submit" size="small">
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
      {showAddEvent && (
        <AdminAddEvent
          showAddEvent={showAddEvent}
          setShowAddEvent={setShowAddEvent}
          setRefresh={setRefresh}
        />
      )}
      {/* {showEditEvent && <AdminEditEvent showEditEvent={showEditEvent} setShowEditEvent={setShowEditEvent}/>} */}
      <PageHeader
        ghost={false}
        title={<Link to="/admin/events">Events</Link>}
        className="site-page-header"
        subTitle="dashboard"
        extra={[
          // <Search
          //   placeholder="input search text"
          //   onSearch={null}
          //   enterButton
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
        <>
          <p>Upcoming Events</p>
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
            dataSource={eventsData.upComingEvents}
            renderItem={(item) => (
              <List.Item>
                <Card
                  key="123"
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src={require("../../Common/images/3.JPEG")}
                    />
                  }
                  onClick={() => {
                    onCardInfoClick(item.event_id);
                  }}
                >
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.name}
                    description={item.location}
                  />
                </Card>
              </List.Item>
            )}
          />
          <Divider />
          <p>Past Events</p>
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
            dataSource={eventsData.pastEvents}
            renderItem={(item) => (
              <List.Item>
                <Card
                  key="123"
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src={require("../../Common/images/3.JPEG")}
                    />
                  }
                  onClick={() => {
                    onCardInfoClick(item.event_id);
                  }}
                >
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.name}
                    description={item.location}
                  />
                </Card>
              </List.Item>
            )}
          />
        </>
      </PageHeader>
      <br />
    </div>
  );
};

export default AdminEventsDashBoard;
