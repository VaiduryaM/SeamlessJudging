/* eslint-disable */
import { Button, Image, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const JudgeNoProjectsPage = (props) => {
  let path = "/";
  return (
    <Result
      status="404"
      title={<h6>You have rated all the assigned projects!</h6>}
    />
  );
};

export default JudgeNoProjectsPage;
