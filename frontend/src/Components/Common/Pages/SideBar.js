import { Affix, Layout } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../Context/MainContext";
import MenuItems from "../MenuItems";
import { getUserActions } from "../Utils/userFunctions";
const { Sider } = Layout;

const SideBar = ({ activeItem, menuActions }) => {
  const { actions, setActions } = useContext(MainContext);
  let { judgeActions, studentActions, clientActions, insActions } =
    getUserActions();
  studentActions[0].children.splice(1, 2);

  if (menuActions) {
    studentActions = menuActions;
  }

  useEffect(() => {
    let roles = JSON.parse(localStorage.getItem("roles"));
    if (roles) {
      roles.map((role) => {
        if (role === "INSTRUCTOR") {
          setActions((prevValues) => [...prevValues, ...insActions]);
        }
        if (role === "Client") {
          setActions((prevValues) => [...prevValues, ...clientActions]);
        }
        if (role === "Student") {
          setActions((prevValues) => [...prevValues, ...studentActions]);
        }
        if (role === "Judge") {
          setActions((prevValues) => [...prevValues, ...judgeActions]);
        }
      });
    }
  }, []);

  return (
    <>
      {actions.length && (
        // <Affix>
        <Sider
          style={{
            position: "sticky",
            top: "500px",
            overflowY: "scroll",
          }}
          breakpoint="lg"
          // collapsedWidth=""
          collapsible
        >
          <MenuItems currentItem={activeItem} optionsList={actions} />
        </Sider>
        // </Affix>
      )}
    </>
  );
};

export default SideBar;
