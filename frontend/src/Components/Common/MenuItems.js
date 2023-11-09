import React from "react";
import { Menu } from "antd";

const MenuItems = ({ currentItem, optionsList, handleClick }) => {
  const items = optionsList;
  return (
    <Menu
      mode="inline"
      theme="dark"
      selectedKeys={currentItem.name}
      defaultOpenKeys={[currentItem.parent]}
      style={{
        height: "100vh",
        borderRight: 0,
      }}
      items={items}
    />
  );
};

export default MenuItems;
