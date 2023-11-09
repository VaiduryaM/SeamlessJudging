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
  Tooltip,
  Tag,
  Popover,
  InputNumber,
  Modal,
  Typography,
  Card,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RefDataColumnDefinitions } from "../ReferenceData/ColumnDefinitions/RefDataColumnDefinitions";
import {
  autoAssignJudges,
  detachItemsFromEvent,
  getFilePath,
  getFilePathByType,
  getProjectsByTypeEventId,
  getRefDataByType,
  getRefDataByTypeEventId,
  updateJudgeAccessCode,
} from "../../Admin/Services/AdminServices";
import { getAllProjects } from "../../Common/Services/Projects/ProjectsService";
import {
  DeleteOutlined,
  DownloadOutlined,
  DownSquareTwoTone,
  EditOutlined,
  FunnelPlotOutlined,
  LinkOutlined,
  PlusOutlined,
  ProjectOutlined,
  RocketOutlined,
  SaveOutlined,
  SearchOutlined,
  StarOutlined,
  StarTwoTone,
  TabletTwoTone,
  TrophyOutlined,
  TrophyTwoTone,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import {
  assignJudgesToProject,
  assignWinnerByProject,
  getEventDetailsById,
  getProjectEventScores,
  unAssignWinnerByEventProject,
  updateEventDetail,
  updateProjectTableNumber,
} from "../../Common/Services/Events/EventsServices";

import Spinner from "../../Common/Spinner";
import {
  getJudgeColumns,
  getJudgesFilters,
  getProjectColumns,
  getProjectFilters,
  getSponsorsColumns,
  getSponsorsFilters,
  getWinnerCategoryColumns,
  getWinnerCategoryFilter,
} from "./Utilities/CustomFilterSetup";

import { getScoreDetailsColumns } from "./Utilities/eventCustomColumns";
const { Paragraph } = Typography;

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const ViewEventById = () => {
  const params = useParams();
  let state = useLocation();
  let eventId = state.state.id;
  const [data, setData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hide, setHide] = useState(true);
  const [refreshTables, setRefershTables] = useState(false);
  const [assignJudgesVisible, setAssignJudgesVisible] = useState(false);
  const [regenerateCodeDetails, setRegenerateCodeDetails] = useState({
    judgeID: null,
    isButtonClicked: false,
  });
  const regenerateCode = async () => {
    const result = await updateJudgeAccessCode(
      regenerateCodeDetails.judgeID,
      eventId
    );
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setRefershTables(true);
    } else {
      NotificationHandler(
        "failure",
        "Failed!",
        "Failed to regenerate access code!"
      );
    }
  };
  useEffect(() => {
    if (regenerateCodeDetails.isButtonClicked) {
      regenerateCode();
      setRegenerateCodeDetails({
        ...regenerateCodeDetails,
        isButtonClicked: false,
      });
    }
  }, [regenerateCodeDetails]);
  const [localTableFilters, setLocalTableFilter] = useState({
    projects: {
      names: [],
      table_numbers: [],
      //course_code_names: [],
      project_type_names: [],
      course_codes: [],
    },
    sponsors: { names: [], descriptions: [] },
    judges: { first_names: [], last_names: [], emails: [], codes: [] },
    winner_categories: { names: [] },
    scoring_categories: { names: [] },
    project_types: { project_types: [] },
    course_code: { names: [], codes: [] },
    users: {
      first_names: [],
      last_names: [],
      middle_names: [],
      emails: [],
      roles: [],
      statuss: [],
    },
  });
  const initialSelectedRows = {
    projects: [],
    sponsors: [],
    judges: [],
    winner_categories: [],
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowsByType, setSelectedRowsByType] =
    useState(initialSelectedRows);
  const [eventDetailForm] = Form.useForm();
  const [viewScoresDetails, setViewScoresDetails] = useState({
    visible: false,
    data: [],
    columns: getScoreDetailsColumns(),
  });
  const [assignJudgesModalDetails, setAssignJudgesModalDetails] = useState({
    visible: false,
    data: [],
    columns: RefDataColumnDefinitions(
      "judges",
      localTableFilters,
      setRegenerateCodeDetails
    ).filter((k) => !k.hidden),
    project_id: null,
  });
  const [actionDetails, setActionDetails] = useState({
    rating: 0,
    winner: 0,
    table: 0,
  });
  const onClickViewDetailScores = async (project_id) => {
    const result = await getProjectEventScores(project_id, eventId);
    if (result.status === 200) {
      setViewScoresDetails({
        visible: true,
        data: result.data,
        columns: getScoreDetailsColumns(),
      });
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const onClickAssignJudges = (id) => {
    setAssignJudgesModalDetails({
      visible: true,
      data: refdata.jugdesRefData,
      columns: columns.judges,
      project_id: id,
    });
  };
  const onSubmitAssignSelectedJudges = async () => {
    const result = await assignJudgesToProject(
      { judges: selectedRowsByType.judges },
      assignJudgesModalDetails.project_id,
      eventId
    );
    if (result.status === 200) {
      setAssignJudgesModalDetails({
        visible: false,
        data: refdata.jugdesRefData,
        columns: columns.judges,
        project_id: null,
      });
      setRefershTables(true);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const onCloseAssignJudgesModal = () => {
    setAssignJudgesModalDetails({
      visible: false,
      data: [],
      columns: columns.judges,
      peoject_id: null,
    });
  };
  const onCloseViewScoresModal = () => {
    setViewScoresDetails({
      visible: false,
      data: [],
      columns: getScoreDetailsColumns(),
    });
  };
  const [filtersByType, setFiltersByType] = useState();
  const [currentTab, setCurrentTab] = useState("projects");
  const handleAssignJudgesHover = (newVisible) => {
    setAssignJudgesVisible(newVisible);
  };

  const onWinnerUpdatePopChange = (newVisible) => {
    setActionDetails({ ...actionDetails, winner: 0 });
  };
  const onTableUpdatePopChange = (newVisible) => {
    setActionDetails({ ...actionDetails, table: 0 });
  };
  const [attachModalDetails, setAttachModalDetails] = useState({
    visible: false,
    columns: [],
    data: [],
  });
  const onCancelAttachModal = () => {
    setAttachModalDetails({ ...attachModalDetails, visible: false });
    setSelectedRowsByType(initialSelectedRows);
    setSelectedRowKeys([]);
  };
  const onClickAttachSelected = async () => {
    selectedRowsByType["update_type"] = "ATTACH";
    const result = await detachItemsFromEvent(selectedRowsByType, eventId);
    if (result.status === 200) {
      setRefresh(true);
      setRefershTables(true);
      setSelectedRowsByType(initialSelectedRows);
      setAttachModalDetails({ ...attachModalDetails, visible: false });
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setSelectedRowKeys([]);
  };

  const updateWinnerCategoryByProject = async (project_id, values) => {
    const payload = { winner_category_id: values.winner_category_id };
    const result = await assignWinnerByProject(payload, project_id, eventId);
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setRefresh(true);
      setRefershTables(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const onClickTableNumberUpdate = async (project_id, values) => {
    const payload = { table_number: values.table_number };
    const result = await updateProjectTableNumber(payload, project_id, eventId);
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setRefershTables(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const onClickAttachItems = async (type) => {
    switch (type) {
      case "projects":
        const excludesData = await getProjectsByTypeEventId(eventId, "EXCLUDE");
        if (excludesData.status === 200) {
          const proFilter = getProjectFilters(excludesData);
          setAttachModalDetails({
            visible: true,
            columns: getProjectColumns(proFilter),
            data: excludesData.data.ongoing_projects,
          });
        } else NotificationHandler("failure", "Failed!", proFilter.message);
        break;
      case "judges":
        const excludedJudgesData = await getRefDataByTypeEventId(
          "judge",
          eventId,
          "EXCLUDE"
        );
        let judgeFilter = {};
        if (excludedJudgesData.status === 200) {
          judgeFilter = getJudgesFilters(excludedJudgesData);
          setAttachModalDetails({
            visible: true,
            columns: getJudgeColumns(judgeFilter),
            data: excludedJudgesData.data,
          });
        } else NotificationHandler("failure", "Failed!", judgeFilter.message);
        break;
      case "sponsors":
        const excludedSponsorsData = await getRefDataByTypeEventId(
          "sponsor",
          eventId,
          "EXCLUDE"
        );
        if (excludedSponsorsData.status === 200) {
          const sponsorFilter = getSponsorsFilters(excludedSponsorsData);
          setAttachModalDetails({
            visible: true,
            columns: getSponsorsColumns(sponsorFilter),
            data: excludedSponsorsData.data,
          });
        } else NotificationHandler("failure", "Failed!", sponsorFilter.message);
        break;
      case "winner_categories":
        const excludedWcData = await getRefDataByTypeEventId(
          "winner-categories",
          eventId,
          "EXCLUDE"
        );
        if (excludedWcData.status === 200) {
          const winnerCategoryFilter = getWinnerCategoryFilter(excludedWcData);
          setAttachModalDetails({
            visible: true,
            columns: getWinnerCategoryColumns(winnerCategoryFilter),
            data: excludedWcData.data,
          });
        } else
          NotificationHandler(
            "failure",
            "Failed!",
            winnerCategoryFilter.message
          );
        break;
    }
  };

  // assign judges
  const [numberOfJudges, setNumberOfJudges] = useState(0);
  const onChangeAssignJudges = (e) => {
    setNumberOfJudges(e);
  };
  const postAssignJudges = async () => {
    if (numberOfJudges > 0 && numberOfJudges <= data.judges.length) {
      const payload = { judges_size: numberOfJudges };
      const result = await autoAssignJudges(payload, eventId);
      if (result.status === 200) {
        NotificationHandler("success", "Success!", result.message);
        setRefresh(true);
        setRefershTables(true);
      } else {
        NotificationHandler("failure", "Failed!", result.message);
      }
    } else {
      NotificationHandler(
        "info",
        "Warinig!",
        "Please check your available judges"
      );
    }
    handleAssignJudgesHover(false);
  };

  const onClickActionDetails = (record, type) => {
    switch (type) {
      case "winner":
        setActionDetails({ ...actionDetails, winner: record.project_id });
        break;
      case "table":
        setActionDetails({ ...actionDetails, table: record.project_id });
    }
  };
  const handleEditIcon = () => {
    setHide(false);
  };
  const handleSaveIcon = async () => {
    setLoading(true);
    const payload = eventDetailForm.getFieldsValue();
    if (payload.date) {
      payload["date"][0] = new moment(payload["date"][0]).utc();
      payload["date"][1] = new moment(payload["date"][1]).utc();
    }
    const result = await updateEventDetail(payload, eventId);
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setHide(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
      setRefresh(true);
    }
    setLoading(false);
  };
  const [refdata, setRefData] = useState({
    sponsersRefData: [],
    jugdesRefData: [],
    projectRefData: [],
    winnerCategoryRefData: [],
  });
  const onClickUnAssignWinner = async (project_id) => {
    const result = await unAssignWinnerByEventProject(project_id, eventId);
    if (result.status === 200) {
      setRefershTables(true);
      setRefresh(true);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const getReferenceData = async () => {
    const sRefData = await getRefDataByTypeEventId(
      "sponsor",
      eventId,
      "INCLUDE"
    );
    const tempFilter = getSponsorsFilters(sRefData);

    const jRefData = await getRefDataByTypeEventId("judge", eventId, "INCLUDE");

    const judgeFilter = getJudgesFilters(jRefData);

    const wRefData = await getRefDataByTypeEventId(
      "winner-categories",
      eventId,
      "INCLUDE"
    );

    const winnerFilter = getWinnerCategoryFilter(wRefData);

    const pData = await getProjectsByTypeEventId(eventId, "INCLUDE");
    const proFilter = getProjectFilters(pData);

    setColumns({
      ...columns,
      sponsors: RefDataColumnDefinitions("sponsors", {
        ...localTableFilters,
        sponsors: tempFilter,
      }, null, "EventDetail").filter((k) => !k.hidden),
      judges: RefDataColumnDefinitions(
        "judges",
        {
          ...localTableFilters,
          judges: judgeFilter,
        },
        setRegenerateCodeDetails,
      ).filter((k) => !k.hidden),
      winnerCategories: RefDataColumnDefinitions("winner_categories", {
        ...localTableFilters,
        winner_categories: winnerFilter,
      }).filter((k) => !k.hidden),
    });
    setLocalTableFilter({
      ...localTableFilters,
      sponsors: tempFilter,
      judges: judgeFilter,
      winner_categories: winnerFilter,
      projects: proFilter,
    });
    setRefData({
      sponsersRefData: sRefData.data,
      jugdesRefData: jRefData.data,
      winnerCategoryRefData: wRefData.data,
      projectRefData: pData.status === 200 ? pData.data.ongoing_projects : [],
    });
  };

  const EventDetails = async () => {
    const result = await getEventDetailsById(eventId);
    eventDetailForm.resetFields();
    if (result.status === 200) {
      if (result.data["date"]) {
        result.data["date"][0] = new moment(result.data["date"][0]);
        result.data["date"][1] = new moment(result.data["date"][1]);
        setData(result.data);
      }
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };
  const [columns, setColumns] = useState({
    sponsors: RefDataColumnDefinitions("sponsors", localTableFilters).filter(
      (k) => !k.hidden
    ),
    judges: RefDataColumnDefinitions(
      "judges",
      localTableFilters,
      setRegenerateCodeDetails
    ).filter((k) => !k.hidden),
    winnerCategories: RefDataColumnDefinitions(
      "winner_categories",
      localTableFilters
    ).filter((k) => !k.hidden),
  });

  const projectColumns = {
    projects: [
      {
        title: "Course Code",
        dataIndex: "course_code",
        sorter: (a, b) => a.course_code.localeCompare(b.course_code),
        onFilter: (value, record) =>
          record.course_code.toLowerCase().includes(value.toLowerCase()),
        filterIcon: () => <SearchOutlined />,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return (
            <Input
              style={{
                border: "1px solid geekblue",
                borderRadius: "5px",
                width: "250px",
              }}
              autoFocus
              placeholder="Type text to search"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            />
          );
        },
        // sorter: (a, b) => a.name.localeCompare(b.name),
        // filters: localTableFilters
        //   ? localTableFilters["projects"]["course_codes"]
        //   : null,
        // filterMode: "tree",
        // filterSearch: true,
        // onFilter: (value, record) =>
        //   record.hasOwnProperty("course_code")
        //     ? record.course_code === value
        //     : null,
      },
      {
        title: "Project Types",
        dataIndex: "project_types",
        render: (_, record) => (
          <p>
            {record.project_types.length ? (
              record.project_types.map(projectType => (
                <Tag color="default">{projectType.name}</Tag>
              ))
            ) : (
              ""
            )}
          </p>
        ),
        onFilter: (value, record) =>
        record.project_types.map((obj) => obj.name).join(" ").toLowerCase().includes(value.toLowerCase()),
        filterIcon: () => <SearchOutlined />,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return (
            <Input
              style={{
                border: "1px solid geekblue",
                borderRadius: "5px",
                width: "250px",
              }}
              autoFocus
              placeholder="Type text to search"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            />
          );
        },
        // sorter: (a, b) => a.name.localeCompare(b.name),
        // filters: localTableFilters
        //   ? localTableFilters["projects"]["project_type_names"]
        //   : null,
        // filterMode: "tree",
        // filterSearch: true,
        // onFilter: (value, record) =>
        //   record.hasOwnProperty("project_type_name")
        //     ? record.project_type_name === value
        //     : null,
      },
      {
        title: "Name",
        dataIndex: "name",
        render: (_, record) => (
          <p>
            {record.winners.length ? (
              <Tooltip
                title={
                  record.winners.length > 0
                    ? record.winners[0].winner_category_name
                    : null
                }
                placement="bottom"
              >
                <TrophyTwoTone twoToneColor="orange" />
                {" " + record.name}
              </Tooltip>
            ) : (
              record.name
            )}
          </p>
        ),
        sorter: (a, b) => a.name.localeCompare(b.name),
        onFilter: (value, record) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
        filterIcon: () => <SearchOutlined />,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return (
            <Input
              style={{
                border: "1px solid geekblue",
                borderRadius: "5px",
                width: "250px",
              }}
              autoFocus
              placeholder="Type text to search"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            />
          );
        },
        // sorter: (a, b) => a.name.localeCompare(b.name),
        // filters: localTableFilters
        //   ? localTableFilters["projects"]["names"]
        //   : null,
        // filterMode: "tree",
        // filterSearch: true,
        // onFilter: (value, record) =>
        //   record.hasOwnProperty("name") ? record.name === value : null,
      },
      {
        title: "Table Number",
        dataIndex: "table_number",
        render: (_, record) =>
          record.table_number == 0 ? "" : record.table_number,
        sorter: (a, b) => a.table_number.localeCompare(b.table_number),
        onFilter: (value, record) =>
          record.table_number.toLowerCase().includes(value.toLowerCase()),
        filterIcon: () => <SearchOutlined />,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return (
            <Input
              style={{
                border: "1px solid geekblue",
                borderRadius: "5px",
                width: "250px",
              }}
              autoFocus
              placeholder="Type text to search"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            />
          );
        },
        // sorter: (a, b) => a.table_number - b.table_number,
        // filters: localTableFilters
        //   ? localTableFilters["projects"]["table_numbers"]
        //   : null,
        // filterMode: "tree",
        // filterSearch: true,
        // onFilter: (value, record) =>
        //   record.hasOwnProperty("table_number")
        //     ? record.table_number === value
        //     : null,
      },
      {
        title: "Average Scores",
        dataIndex: "avg_score",
        sorter: (a, b) => a.avg_score - b.avg_score,
        render: (_, record) => (
          <p>
            {record.avg_score ? (
              <>
                {record.avg_score + " "}
                <StarTwoTone twoToneColor="orange" />
              </>
            ) : (
              record.avg_score
            )}
          </p>
        ),
      },
      {
        title: "Judges",
        dataIndex: "judges",
        render: (judges) =>
          judges.map((obj) => obj.first_name + " " + obj.last_name).join(", "),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions_projects",
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="view scores" placement="bottom">
              <Button
                shape="circle"
                icon={<StarTwoTone twoToneColor="#f44336" />}
                onClick={() => onClickViewDetailScores(record.project_id)}
              ></Button>
            </Tooltip>
            <Popover
              overlayClassName="wrapper-notify"
              content={
                <Form
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 12,
                  }}
                  autoComplete="off"
                  onFinish={(values) => {
                    updateWinnerCategoryByProject(record.project_id, values);
                  }}
                >
                  {!record.winners.length ? (
                    <>
                      <Form.Item
                        label="Category"
                        name="winner_category_id"
                        key="winID"
                        rules={[
                          {
                            required: true,
                            message: "Please select a category",
                          },
                        ]}
                      >
                        <Select
                          style={{ width: "180px" }}
                          placeholder="select a category"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          allowClear
                        >
                          {refdata.winnerCategoryRefData.length
                            ? refdata.winnerCategoryRefData.map((obj) => {
                                return (
                                  <Option
                                    value={obj.winner_category_id}
                                    key={obj.winner_category_id}
                                  >
                                    {obj.name}
                                  </Option>
                                );
                              })
                            : null}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        wrapperCol={{
                          offset: 8,
                          span: 8,
                        }}
                      >
                        <Space>
                          <Button
                            type="primary"
                            htmlType="submit"
                            //loading={loading}
                            size="small"
                            // onClick={() =>
                            //   updateWinnerCategoryByProject(record.project_id)
                            // }
                          >
                            update
                          </Button>
                        </Space>
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <h4 style={{ padding: "30px" }}>
                        Current Status: {record.winners[0].winner_category_name}{" "}
                        <TrophyOutlined />
                      </h4>
                      <Form.Item
                        wrapperCol={{
                          offset: 8,
                          span: 8,
                        }}
                      >
                        <Button
                          type="danger"
                          size="small"
                          onClick={() =>
                            onClickUnAssignWinner(record.project_id)
                          }
                        >
                          UnAssign
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form>
              }
              visible={
                record.project_id === actionDetails.winner ? true : false
              }
              onVisibleChange={onWinnerUpdatePopChange}
            >
              <Tooltip
                title={
                  !record.winners.length ? "update winner" : "Unassign Winner"
                }
                placement="bottom"
              >
                <Button
                  onClick={() => {
                    onClickActionDetails(record, "winner");
                  }}
                  shape="circle"
                  icon={
                    record.winners.length ? (
                      <TrophyTwoTone twoToneColor="#ffc107" />
                    ) : (
                      <TrophyOutlined />
                    )
                  }
                ></Button>
              </Tooltip>
            </Popover>
            <Popover
              overlayClassName="wrapper-notify"
              content={
                <Form
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 12,
                  }}
                  autoComplete="off"
                  onFinish={(values) => {
                    onClickTableNumberUpdate(record.project_id, values);
                  }}
                >
                  <Form.Item
                    label="Table:"
                    name="table_number"
                    key="table"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter a number",
                    //   },
                    // ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 8,
                    }}
                  >
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        //loading={loading}
                        size="small"
                      >
                        update
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              }
              visible={record.project_id === actionDetails.table ? true : false}
              onVisibleChange={onTableUpdatePopChange}
            >
              <Tooltip title="update table" placement="bottom">
                <Button
                  shape="circle"
                  onClick={() => {
                    onClickActionDetails(record, "table");
                  }}
                  icon={<TabletTwoTone twoToneColor="#3f51b5" />}
                ></Button>
              </Tooltip>
            </Popover>
            <Tooltip title="Assign judges" placement="bottom">
              <Button
                shape="circle"
                icon={<UserAddOutlined twoToneColor="#f44336" />}
                onClick={() => onClickAssignJudges(record.project_id)}
              ></Button>
            </Tooltip>
          </Space>
        ),
        fixed: "right",
        width: 200,
      },
    ],
  };

  useEffect(() => {
    getReferenceData();
    return () => {
      setRefershTables(false);
    };
  }, [refreshTables]);
  useEffect(() => {
    EventDetails();
    return () => {
      setRefresh(false);
    };
  }, [refresh]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      switch (currentTab) {
        case "projects":
          if (assignJudgesModalDetails.visible) {
            selectedRowsByType.judges = [];
            selectedRows.length &&
              selectedRows.map((obj) => {
                selectedRowsByType.judges.push(obj.user_id);
              });
            setSelectedRowsByType(selectedRowsByType);
            break;
          }
          selectedRowsByType.projects = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType.projects.push(obj.project_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          break;
        case "judges":
          selectedRowsByType.judges = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType.judges.push(obj.user_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          break;
        case "sponsors":
          selectedRowsByType.sponsors = [];
          selectedRows.map((obj) => {
            selectedRowsByType.sponsors.push(obj.sponsor_id);
          });
          setSelectedRowsByType(selectedRowsByType);
          break;
        case "winner_categories":
          selectedRowsByType.winner_categories = [];
          selectedRows.map((obj) => {
            selectedRowsByType.winner_categories.push(obj.winner_category_id);
          });
          setSelectedRowsByType(selectedRowsByType);
          break;
      }
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      //console.log(selectedRowsByType);
    },
  };
  const [highLight, setHighLight] = useState({
    projects: true,
    judges: false,
    sponsers: false,
    winner_categories: false,
  });
  const getWinnerCategoryName = (id) => {
    let winner = "";
    refdata.winnerCategoryRefData.forEach((obj) => {
      if (obj.winner_category_id === id) {
        winner = obj.name;
        return winner;
      }
    });
    return winner;
  };

  const deleteSelectedRows = async () => {
    selectedRowsByType["update_type"] = "DETACH";
    const result = await detachItemsFromEvent(selectedRowsByType, eventId);
    if (result.status === 200) {
      setRefershTables(true);
      setRefresh(true);
      setSelectedRowsByType(initialSelectedRows);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setSelectedRowKeys([]);
  };

  const [downloadLink, setDownloadLink] = useState({
    projects: "",
    judges: "",
  });
  const loadDownloadLinks = async () => {
    let projectFile = null;
    let judgesFile = null;
    if (currentTab === "projects") {
      projectFile = await getFilePathByType(eventId, "project");
      if (projectFile.status === 200) {
        const url =
          process.env.REACT_APP_LOCAL_DB_URL +
          `/api/v1/content/download?path=${projectFile.data.download_path}`;
        window.open(url);
      } else {
        NotificationHandler(
          "failure",
          "Failed!",
          "Unable to load projects download file data"
        );
      }
    } else if (currentTab === "judges") {
      judgesFile = await getFilePathByType(eventId, "judge");
      if (judgesFile.status === 200) {
        const url =
          process.env.REACT_APP_LOCAL_DB_URL +
          `/api/v1/content/download?path=${judgesFile.data.download_path}`;
        window.open(url);
      } else {
        NotificationHandler(
          "failure",
          "Failed!",
          "Unable to load judges download file data"
        );
      }
    }
  };

  const onTabChange = (key) => {
    setCurrentTab(key);
    switch (key) {
      case "projects":
        setHighLight({
          projects: true,
          judges: false,
          sponsors: false,
          winner_categories: false,
        });
        break;
      case "judges":
        setHighLight({
          projects: false,
          judges: true,
          sponsors: false,
          winner_categories: false,
        });
        // setFiltersByType(
        //   <Form
        //     name="basic"
        //     labelCol={{
        //       span: 8,
        //     }}
        //     wrapperCol={{
        //       span: 12,
        //     }}
        //     autoComplete="off"
        //     //onFinish={onFinish}
        //   >
        //     <Form.Item label="Name" name="name" key="jname">
        //       <Input allowClear />
        //     </Form.Item>
        //     <Form.Item label="Judges" name="user_id" key="jiname">
        //       <Select
        //         showSearch
        //         optionFilterProp="children"
        //         filterOption={(input, option) =>
        //           option.children.toLowerCase().includes(input.toLowerCase())
        //         }
        //         allowClear
        //       >
        //         {refdata.jugdesRefData.length
        //           ? refdata.jugdesRefData.map((obj) => {
        //               return (
        //                 <Option value={obj.user_id} key={obj.user_id}>
        //                   {obj.first_name}
        //                 </Option>
        //               );
        //             })
        //           : null}
        //       </Select>
        //     </Form.Item>
        //     <Form.Item
        //       wrapperCol={{
        //         offset: 8,
        //         span: 8,
        //       }}
        //     >
        //       <Space>
        //         <Button
        //           type="primary"
        //           htmlType="submit"
        //           //loading={loading}
        //           size="small"
        //         >
        //           Apply
        //         </Button>
        //       </Space>
        //     </Form.Item>
        //   </Form>
        // );
        break;
      case "sponsors":
        setHighLight({
          projects: false,
          judges: false,
          sponsors: true,
          winner_categories: false,
        });
        setFiltersByType(null);
        break;
      case "winner_categories":
        setHighLight({
          projects: false,
          judges: false,
          sponsors: false,
          winner_categories: true,
        });
        setFiltersByType(
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 12,
            }}
            autoComplete="off"
            //onFinish={onFinish}
          >
            <Form.Item label="Name" name="name">
              <Input allowClear />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 8,
              }}
            >
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  //loading={loading}
                  size="small"
                >
                  Apply
                </Button>
              </Space>
            </Form.Item>
          </Form>
        );
        break;
    }
  };

  const expandedRowRenderCustom = (record, index) => {
    const columns = [
      {
        title: "Score Category",
        dataIndex: "score_category_name",
        key: "score_category_name",
      },
      {
        title: "Score",
        dataIndex: "value",
        key: "value",
      },
      {
        title: "Feedback",
        dataIndex: "feedback",
        key: "feedback",
      },
    ];

    return (
      <Table
        bordered
        rowKey="score_category_name"
        columns={columns}
        pagination={{
          defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
          showSizeChanger: true,
        }}
        dataSource={viewScoresDetails.data[index].scores}
      />
    );
  };
  return !loading ? (
    <Card
      className="Border-Style" // hoverable={true}
      bodyStyle={{
        overflowY: "scroll",
        height: "85vh",
      }}
    >
      <PageHeader
        ghost={false}
        title={<Link to="/admin/events">Events</Link>}
        subTitle={
          <>
            <Paragraph
              copyable={{
                text:
                  process.env.REACT_APP_HOST_URL + `/public/events/${eventId}`,
              }}
            >
              <a
                href={
                  process.env.REACT_APP_HOST_URL + `/public/events/${eventId}`
                }
              >
                Public URL
                <LinkOutlined />
              </a>
            </Paragraph>
          </>
        }
        style={{ marginTop: "12px" }}
        extra={[
          // <Search
          //   placeholder="input search text"
          //   onSearch={null}
          //   enterButton
          // />,
          data.hasOwnProperty("judges") && data.judges.length ? (
            <Popover
              placement="bottom"
              title={
                <div style={{ fontSize: "12px" }}>
                  Available judges - {data.judges.length}
                </div>
              }
              content={
                <>
                  <InputNumber
                    name="assigned_judges"
                    type="number"
                    placeholder="number"
                    min={data.judges.length ? 1 : 0}
                    max={data.judges.length}
                    onChange={(e) => onChangeAssignJudges(e)}
                  />

                  <Button
                    onClick={postAssignJudges}
                    // size="small"
                    // type="primary"
                  >
                    Assign
                  </Button>
                </>
              }
              trigger="click"
              visible={assignJudgesVisible}
              onVisibleChange={handleAssignJudgesHover}
            >
              <Tooltip title="Assign Judge(s)" placement="bottom">
                <Button shape="circle" icon={<UserAddOutlined />}></Button>
              </Tooltip>
            </Popover>
          ) : null,
          <Tooltip title="Save" placement="bottom">
            <Button
              key="save"
              icon={<SaveOutlined />}
              onClick={handleSaveIcon}
            ></Button>
          </Tooltip>,
          <Tooltip title="Edit" placement="bottom">
            <Button
              key="edit"
              icon={<EditOutlined />}
              onClick={handleEditIcon}
            ></Button>
          </Tooltip>,
        ]}
        avatar={{ icon: <ProjectOutlined /> }}
      >
        <Form
          layout="vertical"
          form={eventDetailForm}
          hideRequiredMark
          initialValues={data}
        >
          <Row gutter={16}>
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
                    message: "Please enter user name",
                  },
                ]}
              >
                <Input
                  className="Border-Style"
                  style={{ color: "midnightblue" }}
                  disabled={hide}
                  placeholder="Please enter user name"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Location:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter location",
                  },
                ]}
              >
                <Input
                  className="Border-Style"
                  disabled={hide}
                  style={{
                    width: "100%",
                    color: "midnightblue",
                  }}
                  placeholder="Please enter location"
                />
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
                  className="Border-Style"
                  style={{ color: "midnightblue" }}
                  disabled={hide}
                  rows={10}
                />
              </Form.Item>
            </Col>
          </Row>
          {data.date && data.date[0] instanceof moment ? (
            <Col span={12}>
              <Form.Item
                name="date"
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Start Date and End Date:
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: "please select dates",
                  },
                ]}
              >
                <RangePicker
                  className="Border-Style"
                  allowClear={false}
                  disabled={hide}
                  showTime={{
                    format: "HH:mm",
                    use12Hours: true,
                  }}
                  format="YYYY-MM-DD HH:mm"
                  //onChange={onChange}
                  //onOk={onOk}
                />
              </Form.Item>
            </Col>
          ) : null}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                    Winners:
                  </div>
                }
              >
                {data.hasOwnProperty("winners") && data.winners.length > 0 ? (
                  data.winners.map((obj) => {
                    return (
                      <>
                        <Tooltip
                          placement="bottom"
                          title={"Project name - " + obj.project_name}
                        >
                          <Tag color="#108ee9" icon={<TrophyOutlined />}>
                            {getWinnerCategoryName(obj.winner_category_id)}
                          </Tag>
                        </Tooltip>
                      </>
                    );
                  })
                ) : (
                  <h4>NA</h4>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={
              <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                Projects, Sponsors, Judges, Winner Categories:
              </div>
            }
          >
            <PageHeader
              ghost={false}
              className="site-page-header"
              extra={[
                // <Popover
                //   placement="bottom"
                //   content={<>{filtersByType}</>}
                //   trigger="hover"
                //   visible={openFilters}
                //   onVisibleChange={handleOpenFilters}
                // >
                //   <Button
                //     key="filters"
                //     icon={<FunnelPlotOutlined />}
                //     size="small"
                //     style={{ background: "#52c41a", color: "white" }}
                //   >
                //     filters
                //   </Button>
                // </Popover>,
                currentTab === "projects" || currentTab === "judges" ? (
                  <Tooltip title="Download Data">
                    <Button
                      key="download"
                      icon={<DownloadOutlined />}
                      onClick={loadDownloadLinks}
                    ></Button>
                  </Tooltip>
                ) : null,
                <Tooltip title="Attach" placement="bottom">
                  <Button
                    key="attach"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      onClickAttachItems(currentTab);
                    }}
                  ></Button>
                </Tooltip>,
                <Tooltip title="Detach" placement="bottom">
                  <Button
                    key="detach"
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={deleteSelectedRows}
                  ></Button>
                </Tooltip>,
              ]}
            >
              <Tabs defaultActiveKey="projects" centered onChange={onTabChange}>
                <TabPane
                  tab={
                    <Button
                      type={highLight.projects ? "primary" : "dashed"}
                      shape="round"
                    >
                      Projects
                    </Button>
                  }
                  key="projects"
                >
                  <Table
                    bordered
                    rowSelection={{
                      type: "checkbox",
                      ...rowSelection,
                    }}
                    pagination={{
                      defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                      showSizeChanger: true,
                    }}
                    columns={projectColumns.projects}
                    dataSource={refdata.projectRefData}
                    scroll={{ x: 1500, y: 500 }}
                  />
                  {viewScoresDetails.visible && (
                    <Modal
                      visible={viewScoresDetails.visible}
                      onCancel={onCloseViewScoresModal}
                      centered
                      closable={false}
                      width="70%"
                      cancelText="Close"
                      okButtonProps={{ style: { display: "none" } }}
                    >
                      <Table
                        bordered
                        columns={viewScoresDetails.columns}
                        dataSource={viewScoresDetails.data}
                        pagination={{
                          defaultPageSize: 10,
                          pageSizeOptions: ["10", "20", "30", "40"],
                          showSizeChanger: true,
                        }}
                        expandable={{
                          expandedRowRender: (record, index) =>
                            expandedRowRenderCustom(record, index),
                        }}
                      />
                    </Modal>
                  )}

                  {assignJudgesModalDetails.visible && (
                    <Modal
                      visible={assignJudgesModalDetails.visible}
                      onCancel={onCloseAssignJudgesModal}
                      centered
                      closable={false}
                      onOk={onSubmitAssignSelectedJudges}
                      width="60%"
                      okText="Assign"
                      cancelText="Close"
                    >
                      <Table
                        bordered
                        rowSelection={{
                          type: "checkbox",
                          ...rowSelection,
                        }}
                        pagination={{
                          defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                          showSizeChanger: true,
                        }}
                        columns={assignJudgesModalDetails.columns.filter(
                          (k) => !k.disable && !k.hide
                        )}
                        dataSource={assignJudgesModalDetails.data}
                      />
                    </Modal>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <Button
                      type={highLight.judges ? "primary" : "dashed"}
                      shape="round"
                    >
                      Judges
                    </Button>
                  }
                  key="judges"
                >
                  <Table
                    bordered
                    rowSelection={{
                      type: "checkbox",
                      ...rowSelection,
                    }}
                    pagination={{
                      defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                      showSizeChanger: true,
                    }}
                    columns={columns.judges}
                    dataSource={refdata.jugdesRefData}
                    scroll={{ x: 1500, y: 500 }}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <Button
                      type={highLight.sponsors ? "primary" : "dashed"}
                      shape="round"
                    >
                      Sponsors
                    </Button>
                  }
                  key="sponsors"
                >
                  <Table
                    bordered
                    rowSelection={{
                      type: "checkbox",
                      ...rowSelection,
                    }}
                    pagination={{
                      defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                      showSizeChanger: true,
                    }}
                    columns={columns.sponsors}
                    dataSource={refdata.sponsersRefData}
                    //scroll={{ x: 1500, y: 500 }}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <Button
                      type={highLight.winner_categories ? "primary" : "dashed"}
                      shape="round"
                    >
                      Winner Categories
                    </Button>
                  }
                  key="winner_categories"
                >
                  <Table
                    bordered
                    rowSelection={{
                      type: "checkbox",
                      ...rowSelection,
                    }}
                    pagination={{
                      defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                      showSizeChanger: true,
                    }}
                    columns={columns.winnerCategories}
                    dataSource={refdata.winnerCategoryRefData}
                    //scroll={{ x: 1500, y: 500 }}
                  />
                </TabPane>
              </Tabs>
            </PageHeader>
          </Form.Item>
        </Form>
        {attachModalDetails.visible && (
          <Modal
            visible={attachModalDetails.visible}
            onCancel={onCancelAttachModal}
            width="80%"
            okText="Attach Selected"
            onOk={onClickAttachSelected}
            centered
          >
            <Table
              bordered
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              pagination={{
                defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
                showSizeChanger: true,
              }}
              columns={attachModalDetails.columns}
              dataSource={attachModalDetails.data}
              scroll={{ x: 1000, y: 500 }}
            ></Table>
          </Modal>
        )}
      </PageHeader>
    </Card>
  ) : (
    <Spinner />
  );
};

export default ViewEventById;
