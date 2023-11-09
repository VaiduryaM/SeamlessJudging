import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Card,
  Button,
  Tabs,
  Tooltip,
  Input,
  Tag,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import {
  GithubOutlined,
  SlackOutlined,
  VideoCameraAddOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";

const ClientProjectsTable = () => {
  const [currProjectData, setCurrProjectData] = useState([]);
  const [pastProjectData, setPastProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    let url = "";
    const role = "Clients";
    url = `/api/v1/project/${role}/UserProject`;

    axios
      .get(process.env.REACT_APP_LOCAL_DB_URL + url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        setCurrProjectData(
          res.data.response_data.currentProjects.map((obj, index) => {
            let clients = [];
            if (obj.Clients) {
              obj.Clients.forEach((client) => {
                clients.push(client.firstName + " " + client.lastName);
              });
            }

            let linksObj = {};
            if (obj.Links) {
              obj.Links.forEach((link) => {
                linksObj[link.name] = link.content;
              });
            }

            return {
              key: index,
              projectId: obj.projectId,
              projectName: obj.name,
              semester: obj.semester,
              courseName: obj.course_name,
              year: obj.year,
              clientName: clients,
              gitHub: linksObj["Repo"],
              slack: linksObj["Slack"],
              zoom: linksObj["Zoom"],
            };
          })
        );

        setPastProjectData(
          res.data.response_data.pastProjects.map((obj, index) => {
            let clients = [];
            if (obj.Clients) {
              obj.Clients.forEach((client) => {
                clients.push(client.firstName + client.lastName);
              });
            }

            let linksObj = {};
            if (obj.Links) {
              obj.Links.forEach((link) => {
                linksObj[link.name] = link.content;
              });
            }

            return {
              key: index,
              projectId: obj.project_id,
              projectName: obj.name,
              semester: obj.semester,
              courseName: obj.course_code_name,
              year: obj.year,
              clientName: clients,
              gitHub: linksObj["Repo"],
              slack: linksObj["Slack"],
              zoom: linksObj["Zoom"],
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        NotificationHandler("failure", "Failed", err.message);
        console.log(err);
      });
  }, []);

  const currProjectsColumns = [
    {
      title: "Name",
      dataIndex: "projectName",
      key: "projectName",
      sorter: (a, b) =>
        a.projectName &&
        b.projectName &&
        a.projectName.localeCompare(b.projectName),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        record.projectName &&
        record.projectName.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      sorter: (a, b) =>
        a.courseName &&
        b.courseName &&
        a.courseName.localeCompare(b.courseName),
      onFilter: (value, record) =>
        record.courseName &&
        record.courseName.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
      filterIcon: () => <SearchOutlined />,
      render: (_, record) => (
        <Tag color={"blue"} className="Border-Style">
          {record.courseName}
        </Tag>
      ),
    },

    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      sorter: (a, b) =>
        a.semester && b.semester && a.semester.localeCompare(b.semester),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        record.semester &&
        record.semester.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) =>
        a.year && b.year && String(a.year).localeCompare(String(b.year)),
      onFilter: (value, record) => record.year && String(record.year) === value,
      filterIcon: () => <SearchOutlined />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
    },
    {
      title: "Representative(s)",
      dataIndex: "clientName",
      key: "clientName",
      onFilter: (value, record) => {
        let tmp = record.projects.map(
          (item) => item && item.toLowerCase().includes(value.toLowerCase())
        );
        return tmp.includes(true) ? true : false;
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
      filterIcon: () => <SearchOutlined />,
      render: (_, { clientName }) => (
        <>
          {clientName.map((client) => {
            let color = "geekblue";
            return (
              <Tag
                color={color}
                key={client}
                className="Border-Style"
                style={{ margin: "2px" }}
              >
                {client}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Links",
      key: "links",
      render: (_, record) => (
        <Space size="middle">
          {record.gitHub && (
            <a href={record.gitHub} target="_blank">
              <Button icon={<GithubOutlined />} shape="circle"></Button>
            </a>
          )}
          {record.slack && (
            <a href={record.slack} target="_blank">
              <Button icon={<SlackOutlined />} shape="circle"></Button>
            </a>
          )}
          {record.zoom && (
            <a href={record.zoom} target="_blank">
              <Button icon={<VideoCameraAddOutlined />} shape="circle"></Button>
            </a>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="Border-Style"
            onClick={() => {
              navigate("/project/insclidetails", {
                state: {
                  projectId: record.projectId,
                },
              });
            }}
          >
            View
          </Button>
          <Button
            className="Border-Style"
            onClick={() =>
              navigate("/client/project/update", {
                state: {
                  projectId: record.projectId,
                  title: "Edit Project",
                  formType: "Edit",
                  role: "Instructor",
                },
              })
            }
          >
            Edit
          </Button>
        </Space>
      ),
      width: "20%",
    },
  ];
  const pastProjectsColumns = [
    {
      title: "Name",
      dataIndex: "projectName",
      key: "projectName",
      sorter: (a, b) =>
        a.projectName &&
        b.projectName &&
        a.projectName.localeCompare(b.projectName),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        record.projectName &&
        record.projectName.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      sorter: (a, b) =>
        a.courseName &&
        b.courseName &&
        a.courseName.localeCompare(b.courseName),
      onFilter: (value, record) =>
        record.courseName &&
        record.courseName.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
      filterIcon: () => <SearchOutlined />,
      render: (_, record) => (
        <Tag color={"blue"} className="Border-Style">
          {record.courseName}
        </Tag>
      ),
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      sorter: (a, b) =>
        a.semester && b.semester && a.semester.localeCompare(b.semester),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        record.semester &&
        record.semester.toLowerCase().includes(value.toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) =>
        a.year && b.year && String(a.year).localeCompare(String(b.userName)),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) => record.year && String(record.year) === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
    },
    {
      title: "Representative(s)",
      dataIndex: "clientName",
      key: "clientName",
      onFilter: (value, record) => {
        let tmp = record.clientName.map(
          (item) => item && item.toLowerCase().includes(value.toLowerCase())
        );
        return tmp.includes(true) ? true : false;
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <Input
            style={{
              border: "1px solid geekblue",
              borderRadius: "5px",
              width: "250px",
            }}
            autoFocus
            placeholder="Type text to search"
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              confirm();
            }}
            onBlur={() => {
              confirm();
            }}
          />
        );
      },
      filterIcon: () => <SearchOutlined />,
      render: (_, { clientName }) => (
        <>
          {clientName.map((client) => {
            let color = "geekblue";
            return (
              <Tag
                color={color}
                key={client}
                className="Border-Style"
                style={{ margin: "2px" }}
              >
                {client}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Links",
      key: "links",
      render: (_, record) => (
        <Space size="middle">
          {record.gitHub && (
            <a href={record.gitHub}>
              <Button icon={<GithubOutlined />} shape="circle"></Button>{" "}
            </a>
          )}
        </Space>
      ),
      width: "20%",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="pointer"
            onClick={() =>
              navigate("/project/insclidetails", {
                state: {
                  projectId: record.projectId,
                },
              })
            }
          >
            View
          </Button>
          <Button
            onClick={() =>
              navigate("/client/project/update", {
                state: {
                  projectId: record.projectId,
                  title: "Extend Project",
                  formType: "Extend",
                  role: "Client",
                },
              })
            }
          >
            Extend
          </Button>
        </Space>
      ),
      width: "20%",
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      type="line"
      items={[
        {
          label: "Current Projects",
          key: "1",
          children: (
            <Card
              title="All Projects"
              className="Border-Style"
              hoverable={true}
              extra={
                <Tooltip title="Add Project" placement="bottom">
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      navigate("/client/project/add", {
                        state: {
                          role: "Client",
                        },
                      })
                    }
                  ></Button>
                </Tooltip>
              }
            >
              {loading ? (
                <div style={{ textAlign: "center" }}>
                  <Spin
                    size="large"
                    indicator={<LoadingOutlined />}
                    tip="Loading..."
                  />
                </div>
              ) : (
                <Table
                  columns={currProjectsColumns}
                  dataSource={currProjectData}
                  scroll={{
                    y: "50vh",
                  }}
                />
              )}
            </Card>
          ),
        },

        {
          label: "Past Projects",
          key: "2",
          children: (
            <Card
              title="Past Projects"
              className="Border-Style"
              hoverable={true}
            >
              <Table
                columns={pastProjectsColumns}
                dataSource={pastProjectData}
                scroll={{
                  y: "50vh",
                }}
              />
            </Card>
          ),
        },
      ]}
    />
  );
};

export default ClientProjectsTable;
