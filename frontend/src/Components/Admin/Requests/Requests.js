/* eslint-disable */
import {
  BellOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  RocketOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Input,
  List,
  PageHeader,
  Result,
  Tabs,
  Tooltip,
} from "antd";
import Search from "antd/lib/transfer/search";
import React, { useContext, useEffect, useState } from "react";
import { authDetailsContext } from "../../../App";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import {
  getRequestsByType,
  updateRequestADById,
} from "../Services/AdminServices";
const { TabPane } = Tabs;

const Requests = (props) => {
  const [requestType, setRequestType] = useState("REQUESTED");
  const [loading, setLoading] = useState(true);
  const [successCheck, setSuccessCheck] = useState(false);
  const [requestsData, setRequestsData] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const authProps = useContext(authDetailsContext);
  const [comments, setComments] = useState("");
  const [highLight, setHighLight] = useState({
    pending: true,
    approved: false,
    rejected: false,
  });
  const onChange = (key) => {
    switch (key) {
      case "pending":
        setHighLight({ pending: true, approved: false, rejected: false });
        setRequestType("REQUESTED");
        break;
      case "approved":
        setHighLight({ pending: false, approved: true, rejected: false });
        setRequestType("APPROVED");
        break;
      case "rejected":
        setHighLight({ pending: false, approved: false, rejected: true });
        setRequestType("REJECTED");
        break;
    }
  };
  const nothingRender = (
    <div>
      <Result
        icon={<SmileOutlined />}
        title="Great, all caught up!"
        subTitle="Nothing here right now, check back later."
      />
    </div>
  );
  const populateRequestByType = async (type) => {
    const result = await getRequestsByType(type);
    if (result.status === 200) {
      switch (type) {
        case "REQUESTED":
          setRequestsData({ ...requestsData, pending: result.data });
          break;
        case "APPROVED":
          setRequestsData({ ...requestsData, approved: result.data });
          break;
        case "REJECTED":
          setRequestsData({ ...requestsData, rejected: result.data });
          break;
      }
    }
  };
  const approveRequest = async (id) => {
    const result = await updateRequestADById(id, {
      status: "APPROVE",
      admin_remarks: comments,
    });
    if (result.status === 200) {
      setSuccessCheck(true);
      NotificationHandler("success", "Success!", result.message);
      authProps.setNotificationNumber(null);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const rejectRequest = async (id) => {
    const result = await updateRequestADById(id, {
      status: "REJECT",
      admin_remarks: comments,
    });
    if (result.status === 200) {
      setSuccessCheck(true);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const onChangeComments = (e) => {
    setComments(e.target.value);
  };
  useEffect(() => {
    setLoading(true);
    populateRequestByType(requestType);
    setLoading(false);
  }, [requestType, successCheck]);
  return (
    <>
      <PageHeader
        ghost={false}
        title="Requests"
        className="site-page-header"
        subTitle="view"
        avatar={{ icon: <BellOutlined /> }}
      >
        <Tabs onChange={onChange} tabPosition="top" centered>
          <TabPane
            tab={
              <>
                <Badge status="processing" />
                <Button
                  type={highLight.pending ? "primary" : "dashed"}
                  shape="round"
                >
                  Pending
                </Button>
              </>
            }
            key="pending"
          >
            {requestsData.pending.length ? (
              <List
                itemLayout="horizontal"
                dataSource={requestsData.pending}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                }}
                renderItem={(item) => (
                  <>
                    <List.Item
                      key={item.first_name + Math.random()}
                      actions={
                        authProps.authDetails.role === "ADMIN"
                          ? [
                              <Tooltip title="Approve">
                                <CheckCircleTwoTone
                                  twoToneColor="#87d068"
                                  style={{ fontSize: 25 }}
                                  onClick={() => {
                                    approveRequest(item.request_id);
                                  }}
                                />
                              </Tooltip>,
                              <Tooltip title="Reject">
                                <CloseCircleTwoTone
                                  twoToneColor="#ff4d4f"
                                  style={{ fontSize: 25 }}
                                  onClick={() => {
                                    rejectRequest(item.request_id);
                                  }}
                                />
                              </Tooltip>,
                            ]
                          : null
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar src="https://joeschmoe.io/api/v1/random" />
                        }
                        title={
                          item.requestor.first_name +
                          " " +
                          item.requestor.last_name +
                          " -> " +
                          item.project_name +
                          " - " +
                          item.request_type
                        }
                        description={
                          "Requestor Comments - " + item.requestor_remarks
                        }
                      />
                    </List.Item>
                    {authProps.authDetails.role === "ADMIN" ? (
                      <Input.TextArea
                        name="comments"
                        placeholder="enter you comments here.."
                        onChange={onChangeComments}
                      />
                    ) : (
                      <Input.TextArea
                        style={{ color: "midnightblue" }}
                        defaultValue={item.admin_remarks}
                        disabled
                      />
                    )}
                  </>
                )}
              />
            ) : (
              nothingRender
            )}
          </TabPane>
          <TabPane
            tab={
              <>
                <Badge status="success" />
                <Button
                  type={highLight.approved ? "text" : "dashed"}
                  style={highLight.approved ? { background: "#52c41a" } : null}
                  shape="round"
                >
                  Approved
                </Button>
              </>
            }
            key="approved"
          >
            {requestsData.approved.length ? (
              <List
                itemLayout="horizontal"
                dataSource={requestsData.approved}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                }}
                renderItem={(item) => (
                  <>
                    <List.Item>
                      <List.Item.Meta
                        key={item.first_name + Math.random()}
                        avatar={
                          <Avatar src="https://joeschmoe.io/api/v1/random" />
                        }
                        title={
                          item.requestor.first_name +
                          " " +
                          item.requestor.last_name +
                          " -> " +
                          item.project_name +
                          " - " +
                          item.request_type
                        }
                        description={
                          "Requestor Comments - " + item.requestor_remarks
                        }
                      />
                    </List.Item>
                    <Input.TextArea
                      style={{ color: "midnightblue" }}
                      defaultValue={item.admin_remarks}
                      disabled
                    />
                  </>
                )}
              />
            ) : (
              nothingRender
            )}
          </TabPane>
          <TabPane
            tab={
              <>
                <Badge status="error" />
                <Button
                  type={highLight.rejected ? "danger" : "dashed"}
                  shape="round"
                >
                  Rejected
                </Button>
              </>
            }
            key="rejected"
          >
            {requestsData.rejected.length ? (
              <List
                itemLayout="horizontal"
                dataSource={requestsData.rejected}
                loading={loading}
                pagination={{
                  showSizeChanger: true,
                  defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                }}
                renderItem={(item) => (
                  <>
                    <List.Item>
                      <List.Item.Meta
                        key={item.first_name + Math.random()}
                        avatar={
                          <Avatar src="https://joeschmoe.io/api/v1/random" />
                        }
                        title={
                          item.requestor.first_name +
                          " " +
                          item.requestor.last_name +
                          " -> " +
                          item.project_name +
                          " - " +
                          item.request_type
                        }
                        description={
                          "Requestor Comments - " + item.requestor_remarks
                        }
                      />
                    </List.Item>
                    <Input.TextArea
                      style={{ color: "midnightblue" }}
                      defaultValue={item.admin_remarks}
                      disabled
                    />
                  </>
                )}
              />
            ) : (
              nothingRender
            )}
          </TabPane>
        </Tabs>
      </PageHeader>
    </>
  );
};

export default Requests;
