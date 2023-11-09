/* eslint-disable */

import {
  BellOutlined,
  CaretRightOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  RocketOutlined,
  StarOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  Input,
  List,
  Modal,
  PageHeader,
  Rate,
  Space,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../../Common/ErrorPage";
import JudgeNoProjectsPage from "../../Common/JudgeErrorPage";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import Spinner from "../../Common/Spinner";
import {
  getJudgingProjectList,
  postRatingByProjectID,
} from "../Services/JudgeServices";
const { TabPane } = Tabs;
const { Panel } = Collapse;

const JudgeProjectsDashBoard = (props) => {
  const [projectData, setProjectsData] = useState([]);
  const [myRatings, setMyRatings] = useState({});
  const [feedback, setFeedback] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const getJudgeProjectsList = async () => {
    const result = await getJudgingProjectList();
    if (result.status === 200) {
      setProjectsData(result.data);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const submitRating = async (projectID, eventId) => {
    let data = { scoring: [], feedback: "" };
    data.eventId = eventId;
    data.projectId = projectID;
    setLoading(true);
    if (myRatings.hasOwnProperty(projectID)) {
      data.scoring = Object.keys(myRatings[projectID]).map((key) => {
        return {
          score_category_id: key,
          score: myRatings[projectID][key],
        };
      });
      data.feedback = feedback.hasOwnProperty(projectID)
        ? feedback[projectID]
        : null;
      const result = await postRatingByProjectID(data, projectID);
      if (result.status === 200) {
        setRefresh(true);
        NotificationHandler("success", "Success", result.message);
      } else {
        setRefresh(true);
        NotificationHandler("failure", "Failed", result.message);
      }
    } else {
      NotificationHandler("failure", "Failed", result.message);
    }
    setLoading(false);
  };
  const onClickPostRating = async (projectID, eventId) => {
    Modal.confirm({
      title: "Do you want to submit rating?",
      cancelText: "Close",
      onOk: () => {
        submitRating(projectID, eventId);
      },
      centered: true,
      okText: "Submit",
      cancelText: "Cancel",
    });
  };
  const onChangeStars = (projectID, scoreCategoryID, value) => {
    myRatings[projectID] = { ...myRatings[projectID] };
    myRatings[projectID][scoreCategoryID] = value;
    setMyRatings(myRatings);
  };
  const onChangeFeedback = (projectID, e) => {
    setFeedback({ ...feedback, [projectID]: e.target.value });
  };
  useEffect(() => {
    getJudgeProjectsList();
    return () => {
      setRefresh(false);
    };
  }, [refresh]);
  return !loading ? (
    <>
      <Card
        title="Projects Rating"
        className="Border-Style"
        hoverable="true"
        bodyStyle={{
          overflowY: "scroll",
          height: "80vh",
        }}
      >
        {projectData.length ? (
          projectData.map((obj) => {
            return (
              <>
                <Collapse
                  bordered={false}
                  className="Border-Style"
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel
                    key={obj.name}
                    header={
                      <div>
                        <h5 style={{ color: "midnightblue" }}>
                          {"Table -" + obj.table_number} {" - "} {obj.name}{" "}
                          {obj.rated ? (
                            <Tag color="green" className="Border-Style">
                              rated <StarTwoTone twoToneColor="red" />
                            </Tag>
                          ) : null}
                        </h5>
                      </div>
                    }
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={obj.scoring_categories}
                      renderItem={(item) => (
                        <List.Item
                          key={item.project_id}
                          actions={[
                            <Rate
                              count={item.scale ? item.scale : 3} // change here to item.scale after api update
                              allowHalf
                              allowClear
                              className="Border-Style"
                              defaultValue={item.value}
                              style={{
                                background: "#90caf9",
                                color: "#ef6c00",
                              }}
                              onChange={(value) => {
                                onChangeStars(
                                  obj.project_id,
                                  item.score_category_id,
                                  value
                                );
                              }}
                            />,
                          ]}
                        >
                          <List.Item.Meta title={item.name} />
                        </List.Item>
                      )}
                    />
                    <Input.TextArea
                      className="Border-Style"
                      placeholder="Please provide your review comments.."
                      onChange={(e) => {
                        onChangeFeedback(obj.project_id, e);
                      }}
                      defaultValue={obj.feedback}
                    />
                    <br />
                    <br />
                    {!obj.rated ? (
                      <Button
                        type="primary"
                        onClick={() => onClickPostRating(obj.project_id, obj.eventId)}
                        loading={loading}
                      >
                        Rate
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => onClickPostRating(obj.project_id, obj.eventId)}
                        loading={loading}
                      >
                        Update rating
                      </Button>
                    )}
                  </Panel>
                </Collapse>
                <Divider />
              </>
            );
          })
        ) : (
          <JudgeNoProjectsPage />
        )}
      </Card>
    </>
  ) : (
    <Spinner />
  );
};

export default JudgeProjectsDashBoard;
