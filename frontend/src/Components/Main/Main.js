/* eslint-disable */
import React, { useState } from "react";
import { Layout } from "antd";
import LeftNav from "./LeftNav/LeftNav";
import Appbar from "./Appbar/Appbar";
const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Main = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout className="site-layout">
        <LeftNav collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: "0 16px",
            background: "#f0f2f5",
            textalign: "center",
            marginTop: "12px",
          }}
        >
          {props.component ? props.component : null}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Main;
