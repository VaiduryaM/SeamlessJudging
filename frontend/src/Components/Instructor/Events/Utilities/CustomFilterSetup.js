import React from "react";
import { Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { NotificationHandler } from "../../../Common/Notifications/NotificationHandler";

export const getProjectFilters = (pData) => {
  let nm = [];
  let tnumbers = [];
  let pTypesSet = new Set();
  let pTypes = [];
  let cCodesSet = new Set();
  let cCodes = [];
  pData.data.hasOwnProperty("ongoing_projects")
    ? pData.data.ongoing_projects.forEach((obj) => {
        nm.push({
          text: obj.name,
          value: obj.name,
        });
        tnumbers.push({
          text: obj.table_number,
          value: obj.table_number,
        });
        if (!pTypesSet.has(obj.project_type_name)) {
          pTypes.push({
            text: obj.project_type_name,
            value: obj.project_type_name,
          });
          pTypesSet.add(obj.project_type_name);
        }
        if (!cCodesSet.has(obj.course_code)) {
          cCodes.push({
            text: obj.course_code,
            value: obj.course_code,
          });
          cCodesSet.add(obj.course_code);
        }
      })
    : NotificationHandler("failure", "Failed!", pData.message);
  return {
    names: nm,
    table_numbers: tnumbers,
    project_type_names: pTypes,
    course_codes: cCodes,
  };
};

export const getProjectColumns = (localTableFilters) => {
  return [
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
      // sorter: (a, b) => a.course_code.localeCompare(b.course_code),
      // filters: localTableFilters ? localTableFilters["course_codes"] : null,
      // filterMode: "tree",
      // filterSearch: true,
      // onFilter: (value, record) =>
      //   record.hasOwnProperty("course_codes")
      //     ? record.course_code.startsWith(value)
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
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
      record.project_types.map((obj) => obj.name).join(" ").toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: localTableFilters ? localTableFilters["names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("name") ? record.name.startsWith(value) : null,
    },
  ];
};

//Judges

export const getJudgesFilters = (jRefData) => {
  let fn = [];
  let ln = [];
  let el = [];
  let cd = [];
  Array.isArray(jRefData.data)
    ? jRefData.data.forEach((obj) => {
        fn.push({
          value: obj.first_name,
          text: obj.first_name,
        });
        ln.push({
          value: obj.last_name,
          text: obj.last_name,
        });
        el.push({
          value: obj.email,
          text: obj.email,
        });
        cd.push({
          value: obj.code,
          text: obj.code,
        });
      })
    : NotificationHandler("failure", "Failed!", jRefData.message);

  return {
    first_names: fn,
    last_names: ln,
    emails: el,
    codes: cd,
  };
};

export const getJudgeColumns = (localTableFilters) => {
  return [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      filters: localTableFilters ? localTableFilters["first_names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.first_name.startsWith(value),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      key: "last_name",
      filters: localTableFilters ? localTableFilters["last_names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.last_name.startsWith(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      key: "email",
      filters: localTableFilters ? localTableFilters["emails"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.email.startsWith(value),
    },
  ];
};

//Users
export const getUsersFilters = (uRefData) => {
  let u1 = [];
  let u2 = [];
  let u3 = [];
  let u4 = [];
  let u5 = [];
  let u5Set = new Set();
  let u6 = [];
  let u6Set = new Set();
  Array.isArray(uRefData.data)
    ? uRefData.data.forEach((obj) => {
        u1.push({
          value: obj.first_name,
          text: obj.first_name,
        });
        u2.push({
          value: obj.last_name,
          text: obj.last_name,
        });
        u3.push({
          value: obj.middle_name,
          text: obj.middle_name,
        });
        u4.push({
          value: obj.email,
          text: obj.email,
        });
        if (!u5Set.has(obj.role)) {
          u5.push({
            value: obj.role,
            text: obj.role,
          });
          u5Set.add(obj.role);
        }
        if (!u6Set.has(obj.status)) {
          u6.push({
            value: obj.status,
            text: obj.status,
          });
          u6Set.add(obj.status);
        }
      })
    : NotificationHandler("failure", "Failed!", uRefData.message);

  return {
    first_names: u1,
    last_names: u2,
    middle_names: u3,
    emails: u4,
    roles: u5,
    statuss: u6,
  };
};

export const getUserColumns = (localTableFilters) => {
  return [
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      key: "first_name",
      filters: localTableFilters ? localTableFilters["first_names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.first_name.startsWith(value),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      key: "last_name",
      filters: localTableFilters ? localTableFilters["last_names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.last_name.startsWith(value),
    },
    {
      title: "Middle Name",
      dataIndex: "middle_name",
      sorter: (a, b) => a.middle_name.localeCompare(b.middle_name),
      key: "middle_name",
      filters: localTableFilters ? localTableFilters["middle_names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.last_name.startsWith(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      key: "email",
      filters: localTableFilters ? localTableFilters["emails"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.email.startsWith(value),
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      key: "role",
      filters: localTableFilters ? localTableFilters["roles"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.email.startsWith(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      key: "status",
      filters: localTableFilters ? localTableFilters["statuss"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.email.startsWith(value),
    },
  ];
};

//Sponsors
export const getSponsorsFilters = (sRefData) => {
  let t1 = [];
  let t2 = [];
  Array.isArray(sRefData.data)
    ? sRefData.data.map((obj) => {
        t1.push({
          value: obj.name,
          text: obj.name,
        });

        t2.push({
          value: obj.description,
          text: obj.description,
        });
      })
    : NotificationHandler("failure", "Failed!", sRefData.message);

  return { names: t1, descriptions: t2 };
};

export const getSponsorsColumns = (localTableFilters) => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      key: "name",
      filters: localTableFilters ? localTableFilters["names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (_, record) => (
        record.logo!=""?(
      <img
                      src={record.logo}
                      style={{
                        borderRadius: "10%",
                        // border: "1px solid",
                        cursor: "pointer",
                      }}
                      width="50"
                      height="25"
                    />
      ):<span></span>
    )},
  ];
};

//winner category

export const getWinnerCategoryFilter = (wRefData) => {
  let wname = [];
  Array.isArray(wRefData.data)
    ? wRefData.data.forEach((obj) => {
        wname.push({
          value: obj.name,
          text: obj.name,
        });
      })
    : NotificationHandler("failure", "Failed!", wRefData.message);

  return { names: wname };
};

export const getWinnerCategoryColumns = (localTableFilters) => {
  return [
    // {
    //   title: "Winner ID",
    //   dataIndex: "winner_category_id",
    //   sorter: (a, b) => a.winner_category_id - b.winner_category_id,
    //   key: "winner_category_id",
    //   hidden: true,
    // },
    {
      title: " Winner Category",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      key: "name",
      filters: localTableFilters ? localTableFilters["names"] : null,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.hasOwnProperty("name") ? record.name.startsWith(value) : null,
    },
  ];
};

//scoring categories

export const getScoringCategoryFilter = (sRefData) => {
  let sname = [];
  Array.isArray(sRefData.data)
    ? sRefData.data.forEach((obj) => {
        sname.push({
          value: obj.name,
          text: obj.name,
        });
      })
    : NotificationHandler("failure", "Failed!", sRefData.message);

  return { names: sname };
};

//proejct type filters

export const getProjectTypeFilters = (ptRefData) => {
  let ptName = [];
  let tSize = [];
  Array.isArray(ptRefData.data)
    ? ptRefData.data.forEach((obj) => {
        ptName.push({
          value: obj.project_type,
          text: obj.project_type,
        });
        tSize.push({
          value: obj.team_size,
          text: obj.team_size,
        });
      })
    : NotificationHandler("failure", "Failed!", ptRefData.message);

  return { project_types: ptName, team_sizes: tSize };
};

//course code

export const getCourseCodeFilters = (cCRefData) => {
  let cName = [];
  let cNameSet = new Set();
  let code = [];
  Array.isArray(cCRefData.data)
    ? cCRefData.data.forEach((obj) => {
        if (!cNameSet.has(obj.name)) {
          cName.push({
            value: obj.name,
            text: obj.name,
          });
          cNameSet.add(obj.name);
        }
        code.push({
          value: obj.code,
          text: obj.code,
        });
      })
    : NotificationHandler("failure", "Failed!", cCRefData.message);

  return { names: cName, codes: code };
};
