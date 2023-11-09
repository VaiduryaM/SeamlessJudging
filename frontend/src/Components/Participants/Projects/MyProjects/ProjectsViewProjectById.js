/* eslint-disable */
import {
  Button,
  Input,
  Tabs,
  Table,
  Space,
  Form,
  Row,
  Col,
  Collapse,
  DatePicker,
  Select,
  PageHeader,
  Descriptions,
  Tag,
  List,
  Divider,
  Tooltip,
  Modal,
  Upload,
  Spin,
  Empty,
  InputNumber,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  CaretRightOutlined,
  CloudOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  EditOutlined,
  FileOutlined,
  RocketOutlined,
  SaveOutlined,
  TrophyOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import {
  getAllProjects,
  getProjectDetailsById,
  updateProjectDetail,
  uploadProjectFiles,
} from "../../../Common/Services/Projects/ProjectsService";
import { RefDataColumnDefinitions } from "../../../Admin/ReferenceData/ColumnDefinitions/RefDataColumnDefinitions";
import { getRefDataByType } from "../../../Admin/Services/AdminServices";
import Dragger from "antd/lib/upload/Dragger";
import { NotificationHandler } from "../../../Common/Notifications/NotificationHandler";
import Spinner from "../../../Common/Spinner";
import { authDetailsContext } from "../../../../App";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const uploadFiles = (event) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event && event.fileList;
};
const ProjectsViewProjectById = (props) => {
  const [hide, setHide] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const authProps = useContext(authDetailsContext);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [random, setRandom] = useState(66);
  const closeUploadModal = () => {
    setOpenUploadModal(false);
  };
  const [projectForm] = Form.useForm();
  const [projectData, setProjectData] = useState({});

  const params = useParams();
  const handleEditIcon = () => {
    setHide(false);
  };
  const handleSaveIcon = async () => {
    setLoading(true);
    const result = await updateProjectDetail(
      projectForm.getFieldsValue(),
      params.ID
    );
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setHide(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
      setRefresh(true);
    }
    setLoading(false);
  };
  const [refData, setRefData] = useState({
    projectRefData: [],
    winnerCategoryRefData: [],
    projectTypeRefData: [],
    courseCodeRefData: [],
  });

  const getReferenceData = async () => {
    const pTRefData = await getRefDataByType("project-type");
    const cCRefData = await getRefDataByType("course-code");
    const wCRefData = await getRefDataByType("winner-categories");
    setRefData({
      projectTypeRefData: pTRefData.data,
      courseCodeRefData: cCRefData.data,
      winnerCategoryRefData: wCRefData.data,
    });
  };

  const getProjectDataById = async (id) => {
    const result = await getProjectDetailsById(id);
    if (result.status === 200) {
      projectForm.resetFields();
      setProjectData(result.data);
      setRefresh(false);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
      setRefresh(false);
    }
  };

  useEffect(() => {
    getProjectDataById(params.ID);
    return () => {
      setRefresh(false);
      setLoading(false);
    };
  }, [refresh]);
  useEffect(() => {
    getProjectDataById(params.ID);
    getReferenceData();
  }, []);
  const handleUploadWork = () => {
    setOpenUploadModal(true);
  };
  const getWinnerCategoryName = (id) => {
    let winner = "";
    refData.winnerCategoryRefData.forEach((obj) => {
      if (obj.winner_category_id === id) {
        winner = obj.name;
        return winner;
      }
    });
    return winner;
  };

  const onFinishUpload = async (values) => {
    setLoading(true);
    const result = await uploadProjectFiles(values, params.ID);
    if (result.status === 200) {
      projectForm.resetFields();
      NotificationHandler("success", "Success!", result.message);
      setRefresh(true);
      setOpenUploadModal(false);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };
  const onClickDownloadFile = (obj) => {
    const url =
      process.env.REACT_APP_LOCAL_DB_URL +
      "/api/v1/content/download?path=" +
      `${obj.content}`;
    window.open(url);
  };
  return !loading ? (
    <>
      <PageHeader
        ghost={false}
        title={<a>Project</a>}
        subTitle="detailed view"
        className="site-page-header"
        style={{ marginTop: "12px" }}
        extra={[
          <Button
            key="upload_file"
            type="primary"
            icon={<CloudUploadOutlined />}
            size="small"
            shape="round"
            onClick={handleUploadWork}
          >
            Upload Files
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            size="small"
            onClick={handleSaveIcon}
          ></Button>,
          <Button
            key="edit"
            type="danger"
            icon={<EditOutlined />}
            size="small"
            onClick={handleEditIcon}
          ></Button>,
        ]}
        avatar={{ icon: <ProjectOutlined /> }}
      >
        <Form
          key={random}
          layout="vertical"
          form={projectForm}
          hideRequiredMark
          initialValues={projectData}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Name:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter name",
                  },
                ]}
              >
                <Input style={{ color: "midnightblue" }} disabled={hide} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="project_type_id"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Project Type:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select project type",
                  },
                ]}
              >
                <Select
                  showSearch
                  disabled={hide}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {refData.projectTypeRefData.length
                    ? refData.projectTypeRefData.map((obj) => {
                        return (
                          <Option
                            style={{ color: "midnightblue" }}
                            value={obj.project_type_id}
                            key={obj.project_type_id}
                          >
                            {obj.project_type}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="course_code_id"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Course code:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select Course code",
                  },
                ]}
              >
                <Select
                  showSearch
                  disabled={hide}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {refData.courseCodeRefData.length
                    ? refData.courseCodeRefData.map((obj) => {
                        return (
                          <Option
                            style={{ color: "midnightblue" }}
                            value={obj.course_code_id}
                            key={obj.course_code_id}
                          >
                            {obj.code}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="client_name"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Client Name:
                  </div>
                }
              >
                <Input disabled={hide} style={{ color: "midnightblue" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="client_company"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Client Company:
                  </div>
                }
              >
                <Input disabled={hide} style={{ color: "midnightblue" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="client_email"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Client Email:
                  </div>
                }
              >
                <Input disabled={hide} style={{ color: "midnightblue" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="project_link"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Project Link:
                  </div>
                }
              >
                <Input disabled={hide} style={{ color: "midnightblue" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="team_size"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Team Size:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <InputNumber
                  disabled={hide}
                  style={{ color: "midnightblue" }}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Team Members:
                  </div>
                }
              >
                <Space>
                  {projectData &&
                  projectData.hasOwnProperty("team") &&
                  projectData.team.length > 0 ? (
                    projectData.team.map((obj) => {
                      return (
                        <h4>{obj.first_name + " " + obj.last_name + ","}</h4>
                      );
                    })
                  ) : (
                    <h4>NA</h4>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Description:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "please enter your description",
                  },
                ]}
              >
                <Input.TextArea
                  disabled={hide}
                  rows={10}
                  style={{ color: "midnightblue" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Starter project files:
                  </div>
                }
              >
                {projectData && projectData.hasOwnProperty("attachments")
                  ? projectData.attachments.map((obj) => {
                      return (
                        <Tag
                          color="orange"
                          icon={<FileOutlined />}
                          onClick={() => onClickDownloadFile(obj)}
                          style={{ cursor: "pointer" }}
                        >
                          {obj.name}
                        </Tag>
                      );
                    })
                  : null}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Project work:
                  </div>
                }
              >
                {projectData && projectData.hasOwnProperty("content")
                  ? projectData.content.map((obj) => {
                      return (
                        <Tag
                          color="orange"
                          icon={<FileOutlined />}
                          onClick={() => onClickDownloadFile(obj)}
                          style={{ cursor: "pointer" }}
                        >
                          {obj.name}
                        </Tag>
                      );
                    })
                  : null}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={
              <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                Events:
              </div>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={projectData.events}
              renderItem={(item) => (
                <div key={Math.random()}>
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        item.hasOwnProperty("name") ? (
                          <p style={{ color: "midnightblue" }}>{item.name}</p>
                        ) : (
                          ""
                        )
                      }
                    >
                      <Descriptions
                        size="large"
                        bordered
                        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                      >
                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>Name:</div>
                          }
                        >
                          {item.hasOwnProperty("name") ? item.name : ""}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>Location:</div>
                          }
                        >
                          {item.hasOwnProperty("location") ? item.location : ""}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>
                              Table Number:
                            </div>
                          }
                        >
                          {item.hasOwnProperty("table_number") ? (
                            <Tag color="#f50">{item.table_number}</Tag>
                          ) : (
                            "NA"
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>
                              Start and End dates:
                            </div>
                          }
                        >
                          {item.hasOwnProperty("date")
                            ? new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(Date.parse(item.date[0])) +
                              " to " +
                              new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(Date.parse(item.date[1]))
                            : ""}
                        </Descriptions.Item>

                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>Judges:</div>
                          }
                        >
                          {item.hasOwnProperty("judges")
                            ? item.judges.map((obj) => {
                                return (
                                  <Tag color="green">
                                    {obj.first_name + ", " + obj.last_name}
                                  </Tag>
                                );
                              })
                            : null}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>Sponsors:</div>
                          }
                        >
                          {item.hasOwnProperty("sponsors")
                            ? item.sponsors.map((obj) => {
                                return <Tag color="#108ee9">{obj.name}</Tag>;
                              })
                            : null}
                        </Descriptions.Item>
                        {item.hasOwnProperty("winners") &&
                        item.winners.length ? (
                          <>
                            <Descriptions.Item
                              label={
                                <div style={{ fontWeight: "bold" }}>
                                  Winners:
                                </div>
                              }
                            >
                              {item.hasOwnProperty("winners")
                                ? item.winners.map((obj) => {
                                    return (
                                      <>
                                        <Tooltip
                                          title={
                                            "Project name - " + obj.project_name
                                          }
                                        >
                                          <Tag
                                            color="#87d068"
                                            icon={<TrophyOutlined />}
                                          >
                                            {getWinnerCategoryName(
                                              obj.winner_category_id
                                            )}
                                          </Tag>
                                        </Tooltip>
                                      </>
                                    );
                                  })
                                : []}
                            </Descriptions.Item>
                          </>
                        ) : (
                          <Descriptions.Item
                            label={
                              <div style={{ fontWeight: "bold" }}>Winners</div>
                            }
                          >
                            <h5>N/A</h5>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item
                          label={
                            <div style={{ fontWeight: "bold" }}>
                              Description:
                            </div>
                          }
                        >
                          {item.hasOwnProperty("description")
                            ? item.description
                            : ""}
                        </Descriptions.Item>
                      </Descriptions>
                    </Panel>
                    <Divider />
                  </Collapse>
                </div>
              )}
            />
          </Form.Item>
        </Form>
      </PageHeader>
      <Modal
        title={
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              color: "midnightblue",
            }}
          >
            <FileOutlined style={{ fontSize: "18px" }} twoToneColor="red" />
            &nbsp; Upload your project content
          </p>
        }
        width="50%"
        visible={openUploadModal}
        onCancel={closeUploadModal}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 12,
          }}
          autoComplete="off"
          onFinish={onFinishUpload}
        >
          <Form.Item
            label="File type"
            name="content_type"
            rules={[
              {
                required: true,
                message: "Please select your file type!",
              },
            ]}
          >
            <Select showSearch>
              <Option value="POSTER">Poster</Option>
              <Option value="VIDEO">Video</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Upload"
            name="content"
            valuePropName="fileList"
            getValueFromEvent={uploadFiles}
            rules={[
              {
                required: true,
                message: "Please select a file!",
              },
            ]}
          >
            <Upload
              beforeUpload={() => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>
                Click to upload your files
              </Button>
            </Upload>
          </Form.Item>

          <br />
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 8,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Upload
              </Button>
              <Button type="danger">Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  ) : (
    <Spinner />
  );
};

export default ProjectsViewProjectById;
