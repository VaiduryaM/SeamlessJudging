/* eslint-disable */

import { ProjectOutlined, ProjectTwoTone } from "@ant-design/icons";
import { Button, Modal, Table, Tooltip } from "antd";
import React from "react";

export const ResultColDefs = (type) => {
  let judge_result_columns = [
    {
      title: "Fist Name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Middle Name ",
      dataIndex: "middle_name",
      key: "middle_name",
      sorter: (a, b) => a.middle_name.localeCompare(b.middle_name),
    },
    {
      title: "Last Name ",
      dataIndex: "last_name",
      key: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.eamil),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      sorter: (a, b) => a.result.localeCompare(b.result),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "FAILED", value: "FAILED" },
        { text: "UPDATED", value: "UPDATED" },
        { text: "CREATED", value: "CREATED" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value),
    },
  ];
  let project_result_columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Project Type Name",
      dataIndex: "project_type_name",
      key: "project_type_name",
      sorter: (a, b) => a.project_type_name.localeCompare(b.project_type_name),
    },
    {
      title: "Course Code",
      dataIndex: "course_code",
      key: "course_code",
      sorter: (a, b) => a.course_code.localeCompare(b.course_code),
    },
    {
      title: "Team Size",
      dataIndex: "team_size",
      key: "teamsize",
      sorter: (a, b) => a.team_size.localeCompare(b.team_size),
    },
    {
      title: "Team Members",
      dataIndex: "team",
      key: "team",
      sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
      sorter: (a, b) => a.client_name.localeCompare(b.client_name),
    },
    {
      title: "Client Company",
      dataIndex: "client_company",
      key: "client_company",
      sorter: (a, b) => a.client_company.localeCompare(b.client_company),
    },
    {
      title: "Client Email",
      dataIndex: "client_email",
      key: "client_email",
      sorter: (a, b) => a.client_email.localeCompare(b.client_email),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      sorter: (a, b) => a.result.localeCompare(b.result),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "FAILED", value: "FAILED" },
        { text: "UPDATED", value: "UPDATED" },
        { text: "CREATED", value: "CREATED" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value),
    },
  ];
  let event_result_columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      sorter: (a, b) => a.start_date.localeCompare(b.start_date),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      sorter: (a, b) => a.end_date.localeCompare(b.end_date),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      sorter: (a, b) => a.result.localeCompare(b.result),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "FAILED", value: "FAILED" },
        { text: "UPDATED", value: "UPDATED" },
        { text: "CREATED", value: "CREATED" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value),
    },
  ];

  switch (type) {
    case "JUDGE":
      return judge_result_columns;
    case "PROJECT":
      return project_result_columns;
    case "EVENT":
      return event_result_columns;
    case "PARTICIPANT":
      return judge_result_columns;
    default:
      return null;
  }
};
