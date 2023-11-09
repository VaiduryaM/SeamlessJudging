import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Space, Table, Card, Button, Tabs, Tooltip } from "antd";
import axios from "axios";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import InsModalComp from "../InsModalComp";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { getAllEvents } from "../../Common/Services/Events/EventsServices";
import { getDashboardFilePathById } from "../../Admin/Services/AdminServices";
import { CSVDownload, CSVLink } from "react-csv";

const InsEventsTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currdownload, setCurrDownload] = useState(false);
  const [pastdownload, setPastDownload] = useState(false);

  const [eventsData, setEventsData] = useState({
    upComingEvents: [],
    pastEvents: [],
  });

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
  }, []);

  const eventsColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },

    {
      title: "Action(s)",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="Border-Style"
            onClick={() => {
              navigate("/ins/event/view", {
                state: {
                  id: record.event_id,
                },
              });
            }}
          >
            View
          </Button>
        </Space>
      ),
      width: "20%",
    },
  ];

  return (
    eventsData && (
      <Tabs
        tabBarStyle={{ borderRadius: "10px" }}
        defaultActiveKey="1"
        type="line"
        items={[
          {
            label: "Upcoming Events",
            key: "1",
            children: (
              <Card
                className="Border-Style"
                title="Manage Events"
                hoverable={true}
                extra={
                  <Space>
                    <Tooltip title="Download" placement="bottom">
                      <Button
                        shape="circle"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          setCurrDownload(true);
                          setTimeout(() => setCurrDownload(false), 2000);
                        }}
                      ></Button>
                    </Tooltip>
                    <Tooltip title="Add Event" placement="bottom">
                      <Button
                        className="Border-Style"
                        onClick={() => navigate("/ins/events/add")}
                        icon={<PlusOutlined />}
                      ></Button>
                    </Tooltip>
                  </Space>
                }
              >
                <Table
                  columns={eventsColumns}
                  dataSource={eventsData.upComingEvents}
                  scroll={{
                    y: "55vh",
                  }}
                />
                {currdownload && (
                  <CSVDownload
                    data={eventsData.upComingEvents}
                    filename={"upcoming_events.csv"}
                    target="_blank"
                  />
                )}
              </Card>
            ),
          },
          {
            label: "Past Events",
            key: "2",
            children: (
              <Card
                className="Border-Style"
                title="Manage Events"
                hoverable={true}
                extra={
                  <Space>
                    <Tooltip title="Download" placement="bottom">
                      <Button
                        shape="circle"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          setPastDownload(true);
                          setTimeout(() => setPastDownload(false), 2000);
                        }}
                      ></Button>
                    </Tooltip>
                  </Space>
                }
              >
                <Table
                  columns={eventsColumns}
                  dataSource={eventsData.pastEvents}
                  scroll={{
                    y: "55vh",
                  }}
                />
                {pastdownload && (
                  <CSVDownload
                    data={eventsData.pastEvents}
                    filename={"past_events.csv"}
                    target="_blank"
                  />
                )}
              </Card>
            ),
          },
        ]}
      />
    )
  );
};

export default InsEventsTable;
