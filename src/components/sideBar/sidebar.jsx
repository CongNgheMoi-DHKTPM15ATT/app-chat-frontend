import React, { useState } from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import {
  MessageTwoTone,
  ContactsTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingTwoTone,
  NotificationTwoTone,
  UserAddOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";

function SideBar() {
  const [collapsed, setCollapsed] = useState(true);
  const handleClickMenu = (e) => {
    if (e.key == "btn-collapsed") setCollapsed(!collapsed);
  };

  const items = [
    { label: "Tin nhắn", key: "btn-message", icon: <MessageTwoTone /> }, // remember to pass the key prop
    {
      label: "Bạn bè",
      key: "btn-friend",
      icon: <ContactsTwoTone />,
      children: [
        {
          label: "Thêm bạn bè",
          key: "btn-add-friend",
          icon: <UserAddOutlined />,
        },
        {
          label: "Danh sách bạn bè",
          key: "btn-list-friend",
          icon: <UsergroupDeleteOutlined />,
        },
      ],
    }, // which is required
    { label: "Thông báo", key: "btn-notifi", icon: <NotificationTwoTone /> }, // which is required
    { label: "Cài đặt", key: "btn-setting", icon: <SettingTwoTone /> }, // which is required

    {
      label: "",
      key: "btn-collapsed",
      icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
    },
  ];
  return (
    <Menu
      //   defaultSelectedKeys={['1']}
      //   defaultOpenKeys={['sub1']}
      mode="inline"
      inlineCollapsed={collapsed}
      items={items}
      className="sidebar"
      onClick={(e) => handleClickMenu(e)}
    />
  );
}

export default SideBar;
