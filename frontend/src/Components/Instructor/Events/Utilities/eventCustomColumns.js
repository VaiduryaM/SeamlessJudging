import React from "react";
export const getScoreDetailsColumns = () => {
  return [
    {
      title: "Judge",
      dataIndex: ["first_name", "last_name"],
      key: "judge",
      render: (text, row) => (
        <h5>{row["first_name"] + ", " + row["last_name"]}</h5>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      key: "email",
    },
  ];
};
