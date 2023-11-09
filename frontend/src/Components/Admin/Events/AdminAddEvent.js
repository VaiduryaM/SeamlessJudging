/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Drawer,
  Modal,
  Table,
  Collapse,
  Tabs,
} from "antd";
import { Form, Input, Select, DatePicker } from "antd";
import { getRefDataByType } from "../Services/AdminServices";
import moment from "moment";
import { getAllProjects } from "../../Common/Services/Projects/ProjectsService";
import { addNewEvent } from "../../Common/Services/Events/EventsServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { GroupOutlined, SettingTwoTone } from "@ant-design/icons";
import { RefDataColumnDefinitions } from "../ReferenceData/ColumnDefinitions/RefDataColumnDefinitions";
import {
  getJudgesFilters,
  getProjectFilters,
  getSponsorsFilters,
  getWinnerCategoryFilter,
} from "./Utilities/CustomFilterSetup";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const AdminAddEvent = (props) => {
  const onClose = () => {
    props.setShowAddEvent(false);
  };
  const [highLight, setHighLight] = useState({
    projects: true,
    judges: false,
    sponsers: false,
    winner_categories: false,
  });
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
        break;
      case "sponsors":
        setHighLight({
          projects: false,
          judges: false,
          sponsors: true,
          winner_categories: false,
        });
        break;
      case "winner_categories":
        setHighLight({
          projects: false,
          judges: false,
          sponsors: false,
          winner_categories: true,
        });
        break;
    }
  };
  const [currentTab, setCurrentTab] = useState("projects");
  const [addEventForm] = Form.useForm();
  const [refdata, setRefData] = useState({
    sponsersRefData: [],
    jugdesRefData: [],
    projectRefData: [],
    winnerCategoryRefData: [],
  });
  const initialSelectedRows = {
    projects: [],
    sponsors: [],
    judges: [],
    winner_categories: [],
  };
  const [selectedRowsByType, setSelectedRowsByType] =
    useState(initialSelectedRows);

  const [localTableFilters, setLocalTableFilter] = useState({
    projects: {
      names: [],
      table_numbers: [],
      course_codes: [],
      project_type_names: [],
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
  const onFinish = async (values) => {
    if (values.date) {
      values["date"][0] = new moment(values["date"][0]).utc();
      values["date"][1] = new moment(values["date"][1]).utc();
    }
    const payload = Object.assign({}, values, selectedRowsByType);
    const result = await addNewEvent(payload);
    if (result.status === 200) {
      props.setRefresh(true);
      onClose();
      resetFields();
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  const resetFields = () => {
    addEventForm.resetFields();
  };

  const getReferenceData = async () => {
    const sRefData = await getRefDataByType("sponsor");
    const tempFilter = getSponsorsFilters(sRefData);

    const jRefData = await getRefDataByType("judge");

    const judgeFilter = getJudgesFilters(jRefData);

    const wRefData = await getRefDataByType("winner-categories");

    const winnerFilter = getWinnerCategoryFilter(wRefData);

    const pData = await getAllProjects(null);
    const proFilter = getProjectFilters(pData);

    setColumns({
      ...columns,
      sponsors: RefDataColumnDefinitions("sponsors", {
        ...localTableFilters,
        sponsors: tempFilter,
      }).filter((k) => !k.hidden),
      judges: RefDataColumnDefinitions("judges", {
        ...localTableFilters,
        judges: judgeFilter,
      }).filter((k) => !k.hide && !k.disable && !k.hidden),
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
  const [columns, setColumns] = useState({
    sponsors: RefDataColumnDefinitions("sponsors", localTableFilters).filter(
      (k) => !k.hidden
    ),
    judges: RefDataColumnDefinitions("judges", localTableFilters).filter(
      (k) => !k.hide && !k.disable && !k.hidden
    ),
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
        title: "Project Type",
        dataIndex: "project_type_name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        filters: localTableFilters
          ? localTableFilters["projects"]["project_type_names"]
          : null,
        filterMode: "tree",
        filterSearch: true,
        onFilter: (value, record) =>
          record.hasOwnProperty("project_type_name")
            ? record.project_type_name === value
            : null,
      },
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        filters: localTableFilters
          ? localTableFilters["projects"]["names"]
          : null,
        filterMode: "tree",
        filterSearch: true,
        onFilter: (value, record) =>
          record.hasOwnProperty("name") ? record.name === value : null,
      },
    ],
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      switch (currentTab) {
        case "projects":
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
      // //console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      //console.log(selectedRowsByType);
    },
  };

  useEffect(() => {
    getReferenceData();
  }, []);

  return (
    <Modal
      centered
      title={
        <p
          style={{
            textAlign: "center",
            fontSize: "22px",
            color: "midnightblue",
          }}
        >
          <GroupOutlined style={{ fontSize: "22px" }} twoToneColor="red" />
          &nbsp; Add New Event
        </p>
      }
      visible={props.showAddEvent}
      onCancel={onClose}
      footer={null}
      width="90%"
    >
      <Form
        layout="vertical"
        form={addEventForm}
        hideRequiredMark
        onFinish={onFinish}
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
              <Input placeholder="Please enter user name" />
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
                style={{
                  width: "100%",
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
                  message: "please enter url description",
                },
              ]}
            >
              <Input.TextArea
                rows={10}
                placeholder="please enter url description"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
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
        </Row>
        <Form.Item
          label={
            <>
              <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                Attach Projects, Sponsors, Judges, Winner Categories:
              </div>
              <div style={{ color: "orange" }}>
                (Select all the required items before submitting)
              </div>
            </>
          }
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
                scroll={{ x: 1500, y: 500 }}
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
                scroll={{ x: 1500, y: 500 }}
              />
            </TabPane>
          </Tabs>
        </Form.Item>
        <Row gutter={8}>
          <Space>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={resetFields}>
                Reset
              </Button>
            </Form.Item>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default AdminAddEvent;
