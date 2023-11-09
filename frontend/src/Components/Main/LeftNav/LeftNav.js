/* eslint-disable */
import React, { useContext, useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  AlertOutlined,
  AndroidOutlined,
  AppstoreOutlined,
  BookOutlined,
  CloudUploadOutlined,
  DesktopOutlined,
  DownCircleOutlined,
  FileSyncOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { authDetailsContext } from "../../../App";
const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <Link to="/admin/projects">My Dashboard</Link>,
    "1",
    <Link to="/admin/projects">
      <AppstoreOutlined />
    </Link>,
    [
      getItem(<Link to="/admin/projects">Projects Dashboard</Link>, "2"),
      getItem(<Link to="/admin/events">Events Dashboard</Link>, "3"),
    ]
  ),
  getItem("Reference Data", "5", <FileSyncOutlined />, [
    getItem(<Link to="/refdata/sponsor">Sponsors</Link>, "6"),
    getItem(
      <Link to="/refdata/scoring_categories">Scoring Categories</Link>,
      "7"
    ),
    getItem(<Link to="/refdata/project_types">Project Types</Link>, "8"),
    getItem(<Link to="/refdata/course_code">Course Codes</Link>, "course_codes"),
    getItem(<Link to="/refdata/judge">Judges</Link>, "9"),
    getItem(
      <Link to="/refdata/winner_categories">Winner Categories</Link>,
      "10"
    ),
    getItem(
      <Link to="/refdata/user">Users</Link>,
      "11"
    ),
  ]),
  getItem(
    "Bulk Upload",
    "4",
    <Link to="/admin/upload">
      <CloudUploadOutlined />
    </Link>
  ),
  
];
const participantItems = [
  getItem(
    "Projects Dashboard",
    "1",
    <Link to="/participant/projects">
      <AppstoreOutlined />
    </Link>
  ),
];
const judgeItems = [
  getItem(
    "My Dashboard",
    "1",
    <Link to="/projects">
      <AppstoreOutlined />
    </Link>
  ),
];
const studentItems = [
  getItem(
    "Courses",
    "1",
    <Link to="/student/courses">
      <AppstoreOutlined />
    </Link>
  ),
  getItem(
    "Profile",
    "2",
    <Link to="student/profile">
    </Link>
  ),
  getItem(
    "Logout",
    "3",
    <Link to="/">
    </Link>
  ),
];
const LeftNav = (props) => {
  const collapsed = props.collapsed;
  const setCollapsed = props.setCollapsed;
  const authProps = useContext(authDetailsContext);

  return authProps.authDetails.role != "JUDGE" ? (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      defaultCollapsed
      onCollapse={(value) => setCollapsed(value)}
      width="15%"
    >
      <div className="logo" />
      <Menu
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={studentItems}
      />
    </Sider>
  ) : null;
};
export default LeftNav;
