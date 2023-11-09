/* eslint-disable */

import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Image, Result, Row, Spin } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Spinner = (props) => {
  return (
    <Row gutter={24} style={{ marginTop: "16%" }}>
      <Col offset={11}>
        <Spin indicator={<LoadingOutlined />} tip="Loading" size="large" />
      </Col>
    </Row>
  );
};

export default Spinner;
