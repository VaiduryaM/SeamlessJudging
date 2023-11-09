/* eslint-disable */ 
import { Button, Drawer, Space } from "antd";
import React, { useState } from "react";

const AdminEditEvent = (props) => {
  const onClose = () => {
    props.setShowEditEvent(false);
  };
  return (
    <Drawer
    title="Edit View goes here..."
    placement="right"
    width="30%"
    onClose={onClose}
    visible={props.showEditEvent}
    extra={
      <Space>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" onClick={onClose}>
          OK
        </Button>
      </Space>
    }
  >
    <p>Details should go here.........</p>
  </Drawer>
  );
};

export default AdminEditEvent;
