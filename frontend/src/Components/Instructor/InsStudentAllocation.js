import React, { useState, useContext, useEffect } from "react";
import {
  DownloadOutlined,
  CopyOutlined,
  UserAddOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  LoadingOutlined,
  UndoOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";
// import { history, fetchWrapper } from '_helpers';
// import { useHistory } from "react-router-dom";
import { Space, Table, Card, Button, Tag, Tooltip, Input, Spin, Modal, Col } from "antd";
import InsModalComp from "./InsModalComp";
import ProjectDetailComponent from "../Common/ProjectDetailComponent";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import InsModalWithContent from "./InsModalWithContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getRoutes } from "../Common/Services/Projects/routes";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { CSVDownload } from "react-csv";
import { MainContext } from "../../Context/MainContext";
const openProjectInfoPopup = async(id)=>{
  let url = getRoutes("projectDetails", { projectId: id });
  let res = await getAPIResponse(url, "GET");
  let project = [];
  if (res.status == 200) {
      project = res.data;
      Modal.info({
        icon: <InfoCircleTwoTone />,
        width: "80%",
        title: "Project Details",
        content: <Card><Col span={16}><ProjectDetailComponent project={res.data} /></Col></Card>,
  
        onOk() {},
        okText: "Close",
      });
  }
  // ReactDOM.render(<Modal show="true"><p>ABGFJFJJ</p><UserDetails/></Modal>);
};

const InsStudentAllocation = () => {
  const { currYear, year, sem, setYear, setSem } = useContext(MainContext);
  const navigate = useNavigate();
  let instructorId = localStorage.getItem("userId");
  const [studentData, setStudentData] = useState([]);
  const [download, setDownload] = useState(false);
  const [studentsArr, setStudentsArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/instructor/students`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        res.data.response_data = res.data.response_data && res.data.response_data.filter(eachStudent=>eachStudent.year==year && eachStudent.semester==sem);
        setStudentData(
          res.data.data.map((obj, index) => {
            return {
              key: index,
              studentName:
                !obj.name || obj.name=="" ? <Tag color="gray"></Tag> : obj.name,
              projectName: obj.project_name,
              email: obj.email,
              image:obj.image,
              status: obj.status,
              projectId: obj.project_id,
              userId: obj.userId,
              courseName: obj.course_name,
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        NotificationHandler("failure", err.message, "Please try again");
      });
  }, [sem, year]);

  const deleteApi = async () => {
    let userIds = [];
    for (let i = 0; i < studentsArr.length; i++) {
      userIds.push(studentsArr[i].userId);
    }
      await fetch(
        process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/user/delete-users`,
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({ users: userIds, role: "STUDENT" }),
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
          NotificationHandler("failure", "Failed", "Delete user(s) failed");
        }
      });
    return;
  };
  const unenrollApi = async () => {
    let unenrollBody = [];
    for (let i = 0; i < studentsArr.length; i++) {
      unenrollBody.push({
        projectId: studentsArr[i].projectId,
        students: [studentsArr[i].email],
      });
    }
    await fetch(
      process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/project/unenroll`,
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ unenrollments: unenrollBody }),
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
          "Selected student(s) unenrolled"
        );
        setTimeout(() => {
          navigate(0);
        }, 2000);
      } else {
        NotificationHandler("failure", "Failed", "Unenroll student(s) failed");
      }
    });
    return;
  };

  const finalizeStudentsApi = async (navigate) => {
    for (let i = 0; i < studentsArr.length; i++) {
      if (studentsArr[i].status == "ENROLLED") {
        await fetch(
          process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/project/finalise`,
          {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              allocations: [
                {
                  projectId: studentsArr[i].projectId,
                  students: [studentsArr[i].email],
                  year: new Date().getFullYear(),
                },
              ],
            }),

            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Token": localStorage.getItem("access_token"),
              "Content-Type": "application/json",
            },
          }
        ).then((response) => {
          if (response.status === 200) {
            NotificationHandler(
              "success",
              "Success!",
              "Selected student(s) finalized"
            );
            setTimeout(() => {
              navigate(0);
            }, 2000);
          } else {
            NotificationHandler("failure", "Failed!", "Finalizing task failed");
          }
        });
      } else {
        NotificationHandler("failure", "Failed!", "Finalizing task failed");
      }
    }
    return;
  };
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
      NotificationHandler("failure", "Failed", "No email(s) selected!");
    }
    document.body.removeChild(textArea);
  };

  const copyEmail = () => {
    let copiedEmails = [];
    for (let i = 0; i < studentsArr.length; i++) {
      copiedEmails.push(studentsArr[i].email);
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

const columns = [
  {
    title: "Name",
    dataIndex: "studentName",
    key: "studentName",
    width: "17%",
    render: (_, record) => (<div><img src={record.image} class = {record.image==""? "defaultImg profileImg": "profileImg"} style={{ width:"20%", height:"20%", margin:0}} title = {record.image==""? record.nameLetters: ""}/>
    <a href="">{record.studentName}</a></div>),
    // cellStyle: {cursor: 'pointer'},
    onCell: record => {
      return {
        onClick: event => { navigate("/user/userdetails", {
          state: {
            userId: record.userId,
            from: "studentlistpage",
          },
        }); event.preventDefault();}, // click row
      };
    },
    sorter: (a, b) =>
      a.studentName &&
      b.studentName &&
      String(a.studentName).localeCompare(String(b.studentName)),
    onFilter: (value, record) =>
      record.studentName &&
      String(record.studentName).toLowerCase().includes(value.toLowerCase()),
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
    title: "Email",
    dataIndex: "email",
    key: "emails",
    width: "20%",
    sorter: (a, b) => a.email && b.email && a.email.localeCompare(b.email),
    onFilter: (value, record) =>
      record.email && record.email.toLowerCase().includes(value.toLowerCase()),
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
  // {
  //   title: "Github",
  //   dataIndex: "githubId",
  //   key: "githubId",
  //   width: "14%",
  //   sorter: (a, b) =>
  //     a.githubId && b.githubId && a.githubId.localeCompare(b.githubId),
  //   onFilter: (value, record) =>
  //     record.githubId &&
  //     record.githubId.toLowerCase().includes(value.toLowerCase()),
  //   filterIcon: () => <SearchOutlined />,
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
  //     return (
  //       <Input
  //         style={{
  //           border: "1px solid geekblue",
  //           borderRadius: "5px",
  //           width: "250px",
  //         }}
  //         autoFocus
  //         placeholder="Type text to search"
  //         value={selectedKeys[0]}
  //         onChange={(e) => {
  //           setSelectedKeys(e.target.value ? [e.target.value] : []);
  //         }}
  //         onPressEnter={() => {
  //           confirm();
  //         }}
  //         onBlur={() => {
  //           confirm();
  //         }}
  //       />
  //     );
  //   },
  // },
  {
    title: "Project",
    dataIndex: "projectName",
    key: "projectName",
    width: "18%",
    sorter: (a, b) =>
    {
      const aValue = a.projectName ? a.projectName : ''; // if a.projectName is null or undefined, set it to an empty string
      const bValue = b.projectName ? b.projectName : ''; // if b.projectName is null or undefined, set it to an empty string
      return aValue.localeCompare(bValue); // compare the values alphabetically
    },
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
    filterIcon: () => <SearchOutlined />,
    render: (_, record) => (
      <Tag color={"geekblue"} style={{cursor: "pointer"}} className="Border-Style" onClick={() =>
        openProjectInfoPopup(record.projectId)
      }>
        {/* {record.projectName} */}
        {record.projectName && record.projectName.length > 20
          ? record.projectName.slice(0, 20) + "..."
          : record.projectName}
      </Tag>
    ),
  },
  {
    title: "Course",
    dataIndex: "courseName",
    key: "courseName",
    width: "18%",
    sorter: (a, b) =>{
      const aValue = a.courseName ? a.courseName : ''; // if a.courseName is null or undefined, set it to an empty string
      const bValue = b.courseName ? b.courseName : ''; // if b.courseName is null or undefined, set it to an empty string
      return aValue.localeCompare(bValue);
    },
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
        {record.courseName && record.courseName.length > 20
          ? record.courseName.slice(0, 20) + "..."
          : record.courseName}
      </Tag>
    ),
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "12%",
    sorter: (a, b) => a.status && b.status && a.status.localeCompare(b.status),
    onFilter: (value, record) =>
      record.status &&
      record.status.toLowerCase().includes(value.toLowerCase()),
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
    render: (_, record) => {
      if (record.status === "FINALIZED") {
        return (
          <Tag color={"green"} className="Border-Style">
            Finalized
          </Tag>
        );
      } else if (record.status === "ENROLLED") {
        return (
          <Tag color={"orange"} className="Border-Style">
            Enrolled
          </Tag>
        );
      } else if (record.status === "UNENROLLED") {
        return (
          <Tag color={"red"} className="Border-Style">
            Unenrolled
          </Tag>
        );
      } else {
        return (
          <Tag color={"yellow"} className="Border-Style">
            Waitlist
          </Tag>
        );
      }
    },
  },
  {
    title: "Action",
    key: "action",
    width: "12%",
    render: (_, record) => (
      <Space size="middle">
        <InsModalWithContent
          buttonText={"Allocate"}
          name={record.studentName}
          email={record.email}
          projectId={record.projectId}
        />
      </Space>
    ),
  },
];
  return (
    <>
      <Card
        className="Border-Style"
        hoverable={true}
        title="Manage Students"
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
                  if (studentsArr.length) {
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
                  if (studentsArr.length == 0) {
                    NotificationHandler(
                      "info",
                      "Information!",
                      "Select row(s) to proceed with the action"
                    );
                  } else {
                    copyEmail();
                  }
                }}
              ></Button>
            </Tooltip>

            <InsModalComp
              buttonIcon={<SafetyCertificateOutlined />}
              modalText={"Are you sure you want to finalize?"}
              onOkFunc={() => finalizeStudentsApi(navigate)}
              isDanger={false}
              toolTipText={"Finalize Student(s)"}
              somethingSelected={studentsArr.length == 0}
            />
            <InsModalComp
              buttonIcon={<UndoOutlined />}
              modalText={"Are you sure you want to unenroll?"}
              onOkFunc={() => unenrollApi(navigate)}
              isDanger={false}
              toolTipText={"Unenroll Student(s)"}
              somethingSelected={studentsArr.length == 0}
            />
            <InsModalComp
              buttonIcon={<DeleteOutlined />}
              buttonType={"primary"}
              modalText={"Are you sure you want to delete item(s)?"}
              onOkFunc={deleteApi}
              isDanger={true}
              toolTipText={"Delete Student(s)"}
              somethingSelected={studentsArr.length == 0}
              extraParam={""}
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
            //rowKey={(record) => record.id}
            dataSource={studentData}
            pagination={{
              defaultPageSize: 10,
                  pageSizeOptions: ["10", "20", "30", "40"],
              showSizeChanger: true,
            }}
            rowSelection={{
              type: "checkbox",
              onChange: (_, rows) => setStudentsArr(rows),
            }}
            scroll={{
              y: "55vh",
            }}
          />
        )}
      </Card>
      {download && <CSVDownload data={studentsArr} target="_blank" />}
    </>
  );
};

export default InsStudentAllocation;
