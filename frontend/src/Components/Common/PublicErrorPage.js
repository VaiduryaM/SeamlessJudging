import { Button, Image, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const PublicErrorPage = (props) => {
  return (
    <Result
      status="404"
      title="Oh no, the page you are looking for is not available"
      extra={
        <Link to="/public/events">
          <Button type="primary">Home</Button>
        </Link>
      }
    />
  );
};

export default PublicErrorPage;
