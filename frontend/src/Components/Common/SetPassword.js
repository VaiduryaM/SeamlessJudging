import React from "react";
import { Card, Button, Form, Input, Row, Col, Upload, Avatar } from "antd";

const SetPassword = () => {
  return (
    <div>
      <Card title="Set Password" style={{ width: "50vw", height: "50vh" }}>
        <Form>
          <Row>
            <Form.Item
              label={<label style={{ color: "black" }}>Current Token</label>}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="token"
              rules={[
                {
                  required: true,
                  message: "Please input your token",
                },
              ]}
            >
              <Input allowClear name="token" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={<label style={{ color: "black" }}>Password</label>}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="pwd"
              rules={[
                {
                  required: true,
                  message: "Please set your password",
                },
              ]}
            >
              <Input allowClear name="pwd" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={<label style={{ color: "black" }}>Confirm Password</label>}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="cpwd"
              rules={[
                {
                  required: true,
                  message: "Please re-enter your password to confirm",
                },
              ]}
            >
              <Input allowClear name="cpwd" />
            </Form.Item>
          </Row>
          <Button
            type="primary"
            value={"large"}
            style={
              {
                //   float: "right",
                //   marginRight: "20px",
              }
            }
          >
            Set Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};
export default SetPassword;
