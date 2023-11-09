import React, { useContext, useState, useEffect } from "react";
import {
  DownloadOutlined,
  CopyOutlined,
  UserAddOutlined,
  DeleteOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Space,
  Table,
  Card,
  Button,
  Tag,
  Tooltip,
  Input,
  Modal,
  Form,
  Select,
  Spin,
} from "antd";

import InsModalComp from "./InsModalComp";

import { useNavigate } from "react-router-dom";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { CSVDownload } from "react-csv";
import axios from "axios";
import { getRoutes } from "../Common/Services/Projects/routes";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
const InsUserTable = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [download, setDownload] = useState(false);
  const [userData, setUserData] = useState([]);
  const [editRoles, showEditRoles] = useState(false);
  const [editUser, setEditUser] = useState();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [usersArr, setUsersArr] = useState([]);
  const alternateCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      NotificationHandler("success", "Success!", "Selected email(s) Copied");
    } catch (err) {
      NotificationHandler("failure", "Failed!", "No email(s) selected!");
    }
    document.body.removeChild(textArea);
  };

  const copyEmail = () => {
    let copiedEmails = [];
    for (let i = 0; i < usersArr.length; i++) {
      copiedEmails.push(usersArr[i].email);
    }
    if (copiedEmails.length && window.isSecureContext) {
      navigator.clipboard
        .writeText(String(copiedEmails))
        .then(
          NotificationHandler("success", "Success!", "Selected email(s) Copied")
        );
    } else {
      alternateCopy(copiedEmails);
    }
  };
  const onFinish = async (values) => {
    showEditRoles(false);
    let roles = values.roles;
    console.log(roles);

    if (roles.includes("Instructor") && roles.includes("Student")) {
      NotificationHandler(
        "failure",
        "Failed",
        "User cannot be Insructor and Student"
      );
      return;
    }
    let url = getRoutes("editRole");
    let body = {
      roles: roles,
      userId: editUser,
    };
    let result = await getAPIResponse(url, "POST", body);
    if (result.status == 200) {
      NotificationHandler("success", "Success!", result.message);
      getUsers();
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <a href="" >{text}</a>,
      // cellStyle: {cursor: 'pointer'},
      onCell: record => {
        return {
          onClick: event => { navigate("/user/userdetails", {
            state: {
              userId: record.userId,
              // from: "studentlistpage",
            },
          }); event.preventDefault();}, // click row
        };
      },
      sorter: (a, b) =>
        a.userName &&
        b.userName &&
        String(a.userName).localeCompare(String(b.userName)),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        record.userName &&
        String(record.userName).toLowerCase().includes(value.toLowerCase()),
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
      title: "Email",
      dataIndex: "email",
      key: "emails",
      sorter: (a, b) => a.email && b.email && a.email.localeCompare(b.email),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) =>
        record.email &&
        record.email.toLowerCase().includes(value.toLowerCase()),
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
      title: "Role(s)",
      dataIndex: "roles",
      key: "roles",
      width: "25%",
      onFilter: (value, record) => {
        let tmp = record.roles.map(
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
      render: (_, { roles, index }) => {
        // console.log(x);
        return (
          <>
            {roles.map((role) => {
              let color = "geekblue";
              return (
                <Tag
                  color={color}
                  key={index}
                  className="Border-Style"
                  style={{ margin: "2px" }}
                >
                  {role}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button
            className="Border-Style"
            onClick={() => {
              navigate("/user/userdetails", {
                state: {
                  userId: record.userId,
                },
              });
            }}
          >
            View
          </Button> */}
          <Button
            className="Border-Style"
            onClick={() => {
              let userId = String(record.userId);
              setEditUser(userId);
              form.setFieldsValue({
                roles: record.roles,
              });
              showEditRoles(true);
            }}
          >
            Edit Role
          </Button>
        </Space>
      ),
      width: "20%",
    },
  ];

  const getUsers = () => {
    axios
      .get(process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/instructor/users`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        setUserData(
          res.data.data.map((obj, index) => {
            return {
              key: index,
              userName: obj.PrefferedName=="" ? <Tag color="gray"></Tag> : obj.PrefferedName,
              roles: obj.roles,
              email: obj.email,
              userId: obj.userId,
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        NotificationHandler("failure", err.message, "Please try again");
      });
  };

  useEffect(() => {
    getUsers();
  }, []);
  const deleteApi = async () => {
    for (let i = 0; i < usersArr.length; i++) {
      await fetch(
        process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/user/delete-users`,
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            users: [{ userId: usersArr[i].userId }],
          }),
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Token": localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        if (response.ok) {
          NotificationHandler(
            "success",
            "Success!",
            "Selected user(s) deleted"
          );
          setTimeout(() => {
            navigate(0);
          }, 2000);
        } else {
          NotificationHandler("failure", "Failed!", "Delete user(s) failed");
        }
      });
    }
    return;
  };
  return (
    <>
      <Modal
        title="Edit roles"
        open={editRoles}
        onCancel={() => {
          showEditRoles(false);
        }}
        footer={null}
      >
        <Form
          name="editUserRoles"
          labelCol={{ span: 8 }}
          labelAlign="left"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Roles"
            name="roles"
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
            form={form}
          >
            <Select
              mode="multiple"
              placeholder="Select roles"
              popupClassName="Border-Style"
            >
              <Option value="INSTRUCTOR">Instructor</Option>
              <Option value="STUDENT">Student</Option>
              <Option value="CLIENT">Client</Option>
              <Option value="JUDGE">Judge</Option>
            </Select>
          </Form.Item>
          <Space>
            <Form.Item>
              <Button
                onClick={() => {
                  showEditRoles(false);
                }}
                className="Border-Style"
                type="primary"
              >
                Cancel
              </Button>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="Border-Style" type="primary">
                Save
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
      <Card
        title="Manage Users"
        className="Border-Style"
        hoverable={true}
        extra={
          <Space>
            <Tooltip title="Add User(s)" placement="bottom">
              <Button
                shape="circle"
                icon={<UserAddOutlined />}
                onClick={() => navigate("/ins/addUser")}
              ></Button>
            </Tooltip>
            <Tooltip title="Download Data" placement="bottom">
              <Button
                shape="circle"
                icon={<DownloadOutlined />}
                onClick={() => {
                  if (usersArr.length) {
                    setDownload(true);
                    setTimeout(() => setDownload(false), 2000);
                    NotificationHandler(
                      "success",
                      "Success!",
                      "Downloading data..."
                    );
                  } else {
                    NotificationHandler(
                      "info",
                      "Information!",
                      "Select row(s) to proceed with the action"
                    );
                  }
                }}
              ></Button>
            </Tooltip>
            <Tooltip title="Copy Email(s)" placement="bottom">
              <Button
                shape="circle"
                icon={<CopyOutlined />}
                onClick={() => {
                  if (usersArr.length == 0) {
                    NotificationHandler(
                      "info",
                      "Information",
                      "Select row(s) to copy email(s)"
                    );
                  } else {
                    copyEmail();
                  }
                }}
              ></Button>
            </Tooltip>

            <InsModalComp
              buttonIcon={<DeleteOutlined />}
              buttonType={"primary"}
              modalText={"Are you sure you want to delete item(s)?"}
              onOkFunc={deleteApi}
              isDanger={true}
              toolTipText={"Delete User(s)"}
              somethingSelected={usersArr.length == 0}
            />
          </Space>
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
            columns={columns}
            dataSource={userData}
            rowSelection={{
              type: "checkbox",
              onChange: (_, rows) => setUsersArr(rows),
            }}
            scroll={{
              y: "55vh",
            }}
            // onRow={(record, rowIndex) => {
            //   return {
            //     onClick: event => {navigate("/user/userdetails", {
            //       state: {
            //         userId: record.userId,
            //       },
            //     });}, // click row
            //   };
            // }}
          />
        )}
      </Card>
      {download && <CSVDownload data={usersArr} target="_blank" />}
    </>
  );
};

export default InsUserTable;
