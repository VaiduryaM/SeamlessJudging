import { Button, Image, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = (props) => {
  let path = "/";
  switch (props.role) {
    case "PARTICIPANT":
      path = "/participant/projects";
      break;
    case "ADMIN":
      path = "/admin/projects";
      break;

    case "JUDGE":
      path = "/judge";
      break;
    default:
      path = "/";
      break;
  }
  return (
    <Result
      status="404"
      title="Oh no, the page you are looking for is not available"
      extra={
        <Link to={path}>
          <Button type="primary">Home</Button>
        </Link>
      }
    />
  );
};

export default ErrorPage;
