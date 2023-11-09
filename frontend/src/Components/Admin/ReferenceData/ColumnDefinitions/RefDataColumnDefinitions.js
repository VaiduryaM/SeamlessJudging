import {
  ProjectOutlined,
  ProjectTwoTone,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, Tooltip } from "antd";
import React from "react";

export const RefDataColumnDefinitions = (
  type,
  localTableFilters,
  setRegenerateCodeDetails,
  fromPage
) => {
  let sponsors_columns = [
    {
      title: "Sponsor ID",
      dataIndex: "sponsor_id",
      key: "sponsor_id",
      hidden: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) =>
        a.hasOwnProperty("name") ? a.name.localeCompare(b.name) : null,
      key: "name",
      filters: localTableFilters
        ? localTableFilters["sponsors"]["names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name === value,
    },
    // {
    //   title: "Logo",
    //   dataIndex: "logo",
    //   key: "logo",
    // },
  ];

  let judges_columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a, b) =>
        a.hasOwnProperty("first_name")
          ? a.first_name.localeCompare(b.first_name)
          : null,
      key: "first_name",
      filters: localTableFilters
        ? localTableFilters["judges"]["first_names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.first_name === value,
      refdata: true,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a, b) =>
        a.hasOwnProperty("last_name")
          ? a.last_name.localeCompare(b.last_name)
          : null,
      key: "last_name",
      filters: localTableFilters
        ? localTableFilters["judges"]["last_names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.last_name === value,
      refdata: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) =>
        a.hasOwnProperty("email") ? a.email.localeCompare(b.email) : null,
      key: "email",
      filters: localTableFilters ? localTableFilters["judges"]["emails"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.email === value,
      refdata: true,
    },
    {
      title: "Company",
      dataIndex: "company",
      sorter: (a, b) =>
        a.hasOwnProperty("company") ? a.company.localeCompare(b.company) : null,
      key: "company",
      filters: localTableFilters ? localTableFilters["judges"]["comapanies"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.company === value,
      refdata: true,
    },
    {
      title: "Code",
      dataIndex: "events",
      render: (events) => events && events.map((obj) => obj.code).join(),
      key: "code",
      disable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Tooltip title="Regenerate Access Code" placement="bottom">
          <Button
            shape="circle"
            icon={<SyncOutlined />}
            onClick={() =>
              setRegenerateCodeDetails({
                judgeID: record.user_id,
                isButtonClicked: true,
              })
            }
          ></Button>
        </Tooltip>
      ),
      fixed: "right",
      width: 100,
      key: "actions_judge",
      hide: true,
    },
    {
      title: "Tagged Events",
      dataIndex: "events",
      render: (_, records) => (
        <Button
          shape="circle"
          icon={
            <Tooltip
              title={
                records.events ? records.events.length + " events tagged" : null
              }
            >
              <ProjectTwoTone twoToneColor="#f44336" />
            </Tooltip>
          }
          onClick={() => {
            Modal.info({
              icon: <ProjectOutlined />,
              width: "80%",
              title:
                "Tagged events of " +
                records.first_name +
                " " +
                records.last_name,
              content: (
                <Table
                  dataSource={records.events}
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      sorter: (a, b) => a.name - b.name,
                    },
                    {
                      title: "Start & End Dates",
                      dataIndex: "events",
                      render: (_, record) =>
                        record.date.length === 2
                          ? new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(Date.parse(record.date[0])) +
                            " to " +
                            new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(Date.parse(record.date[1]))
                          : null,
                    },
                    {
                      title: "Location",
                      dataIndex: "location",
                      sorter: (a, b) => a.location.localeCompare(b.location),
                    },
                    {
                      title: "Access Code",
                      dataIndex: "code",
                      sorter: (a, b) => a.code.localeCompare(b.code),
                    },
                    {
                      title: "Actions",
                      dataIndex: "actions",
                      render: (_, record) => (
                        <Tooltip
                          title="Regenerate Access Code"
                          placement="bottom"
                        >
                          <Button
                            shape="circle"
                            icon={<SyncOutlined />}
                            onClick={() => {
                              setRegenerateCodeDetails({
                                judgeID: records.user_id,
                                isButtonClicked: true,
                                eventID: record.event_id,
                              });
                              Modal.destroyAll();
                            }}
                          ></Button>
                        </Tooltip>
                      ),
                      fixed: "right",
                      width: 100,
                      key: "action_judge",
                    },
                  ]}
                />
              ),

              onOk() {},
              okText: "Close",
            });
          }}
        ></Button>
      ),
      key: "tagged_event",
      refdata: true,
      hidden: true,
    },
  ];

  let project_types_columns = [
    {
      title: "Project Type",
      dataIndex: "project_type",
      sorter: (a, b) =>
        a.hasOwnProperty("project_type")
          ? a.project_type.localeCompare(b.project_type)
          : null,
      filters: localTableFilters
        ? localTableFilters["project_types"]["project_types"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.project_type === value,
    },
    {
      title: "Tagged Scoring Categories",
      dataIndex: "scoring_categories",
      render: (_, record) => (
        <Button
          shape="circle"
          icon={
            <Tooltip
              title={
                record.scoring_categories
                  ? record.scoring_categories.length + " categories tagged"
                  : null
              }
            >
              <ProjectTwoTone twoToneColor="#f44336" />
            </Tooltip>
          }
          onClick={() => {
            Modal.info({
              icon: <ProjectOutlined />,
              width: "80%",
              title: "Tagged scoring categories of " + record.project_type,
              content: (
                <Table
                  dataSource={record.scoring_categories}
                  columns={scoring_cat_custom_cols}
                />
              ),

              onOk() {},
              okText: "Close",
            });
          }}
        ></Button>
      ),
      key: "code",
      refdata: true,
    },
  ];

  let winner_categories_columns = [
    // {
    //   title: "Winner ID",
    //   dataIndex: "winner_category_id",
    //   sorter: (a, b) => a.winner_category_id - b.winner_category_id,
    //   key: "winner_category_id",
    //   hidden: true,
    // },
    {
      title: "Winner Category",
      dataIndex: "name",
      sorter: (a, b) =>
        a.hasOwnProperty("name") ? a.name.localeCompare(b.name) : null,
      key: "name",
      filters: localTableFilters
        ? localTableFilters["winner_categories"]["names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("name") ? record.name === value : null,
    },
  ];
  let scoring_categories_columns = [
    // {
    //   title: "Winner ID",
    //   dataIndex: "winner_category_id",
    //   sorter: (a, b) => a.winner_category_id - b.winner_category_id,
    //   key: "winner_category_id",
    //   hidden: true,
    // },
    {
      title: "Scoring Category",
      dataIndex: "name",
      sorter: (a, b) =>
        a.hasOwnProperty("name") ? a.name.localeCompare(b.name) : null,
      key: "name",
      filters: localTableFilters
        ? localTableFilters["scoring_categories"]["names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("name") ? record.name === value : null,
    },
    {
      title: "Scale",
      dataIndex: "scale",
      sorter: (a, b) => a.scale - b.scale,
      key: "scale",
    },
  ];
  let scoring_cat_custom_cols = [
    {
      title: "Scoring Category",
      dataIndex: "name",
      sorter: (a, b) =>
        a.hasOwnProperty("name") ? a.name.localeCompare(b.name) : null,
      key: "name",
    },
    {
      title: "Scale",
      dataIndex: "scale",
      sorter: (a, b) =>
        a.hasOwnProperty("scale") ? a.scale.localeCompare(b.scale) : null,
      key: "scale",
    },
  ];

  let course_code_columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      sorter: (a, b) =>
        a.hasOwnProperty("name") ? a.name.localeCompare(b.name) : null,
      key: "name",
      filters: localTableFilters
        ? localTableFilters["course_code"]["names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("name") ? record.name === value : null,
    },
    {
      title: "Course Code",
      dataIndex: "code",
      sorter: (a, b) =>
        a.hasOwnProperty("code") ? a.code.localeCompare(b.code) : null,
      key: "code",
      filters: localTableFilters
        ? localTableFilters["course_code"]["codes"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("code") ? record.code === value : null,
    },
  ];

  let users_custom_cols = [
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a, b) =>
        a.hasOwnProperty("first_name")
          ? a.first_name.localeCompare(b.first_name)
          : null,
      key: "first_name",
      filters: localTableFilters
        ? localTableFilters["users"]["first_names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("first_name")
          ? record.first_name === value
          : null,
    },
    {
      title: "Middle Name",
      dataIndex: "middle_name",
      sorter: (a, b) =>
        a.hasOwnProperty("middle_name")
          ? a.middle_name.localeCompare(b.middle_name)
          : null,
      key: "middle_name",
      filters: localTableFilters
        ? localTableFilters["users"]["middle_names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("middle_name")
          ? record.middle_name === value
          : null,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a, b) =>
        a.hasOwnProperty("last_name")
          ? a.last_name.localeCompare(b.last_name)
          : null,
      key: "last_name",
      filters: localTableFilters
        ? localTableFilters["users"]["last_names"]
        : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("last_name") ? record.last_name === value : null,
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) =>
        a.hasOwnProperty("email") ? a.email.localeCompare(b.email) : null,
      key: "email",
      filters: localTableFilters ? localTableFilters["users"]["emails"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("email") ? record.email === value : null,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) =>
        a.hasOwnProperty("role") ? a.role.localeCompare(b.role) : null,
      key: "role",
      filters: localTableFilters ? localTableFilters["users"]["roles"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("role") ? record.role === value : null,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) =>
        a.hasOwnProperty("status") ? a.status.localeCompare(b.status) : null,
      key: "status",
      filters: localTableFilters ? localTableFilters["users"]["statuss"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("status") ? record.status === value : null,
    },
    {
      title: "Enrollment Status",
      dataIndex: "enrollment_status",
      sorter: (a, b) =>
        a.hasOwnProperty("enrollment_status")
          ? a.enrollment_status.localeCompare(b.enrollment_status)
          : null,
      key: "enrollment_status",
      filters: [
        { value: "ONGOING", text: "ONGOING" },
        { value: "COMPLETED", text: "COMPLETED" },
        { value: "UNENROLLED", text: "UNENROLLED" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("enrollment_status")
          ? record.enrollment_status === value
          : null,
    },
  ];

  switch (type) {
    case "sponsors":
      return sponsors_columns;
    case "winner_categories":
      return winner_categories_columns;
    case "scoring_categories":
      return scoring_categories_columns;
    case "project_types":
      return project_types_columns;
    case "judges":
      return judges_columns;
    case "course_code":
      return course_code_columns;
    case "users":
      return users_custom_cols;
    default:
      return null;
  }
};
