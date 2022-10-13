import React, { useState } from "react";
import { Menu, Button, Form, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import {
  MessageTwoTone,
  ContactsTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  SettingTwoTone,
  NotificationTwoTone,
  UserAddOutlined,
  UsergroupDeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function SideBar() {
  const [chooseItem, setChooseItem] = useState("btn-message");
  const [chooseMessage, setChooseMessage] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const [listMessage, setListMessage] = useState([
    {
      name: "Nguyễn Hải Nam",
      content: "Anh thư cute hihi hhhhhhhhhhhhhhhhhhhhhhhhh",
      lastMess: "1 giờ",
      avatar: "../../assets/images/google-icon.jpg",
    },
    {
      name: "Nguyễn Nhật Quang",
      content: "Anh thư cute hihi hhhhhhhhhhhhhhhhhhhhhhhhh",
      lastMess: "2 giờ",
      avatar: "../../assets/images/google-icon.jpg",
    },
    {
      name: "Antii",
      content: "Anh thư cute hihi hhhhhhhhhhhhhhhhhhhhhhhhh",
      lastMess: "2 giờ",
      avatar: "../../assets/images/google-icon.jpg",
    },
    {
      name: "Thanh Ngân",
      content: "Anh thư cute hihi hhhhhhhhhhhhhhhhhhhhhhhhh",
      lastMess: "4 giờ",
      avatar: "../../assets/images/google-icon.jpg",
    },
  ]);

  function renderListMessage() {
    return (
      <div className="sidebar-content-center">
        {listMessage.map((user, index) => (
          <MessageItem
            key={index}
            id={index}
            name={user.name}
            avatar={user.avatar}
            content={user.content}
            lastMess={user.lastMess}
          ></MessageItem>
        ))}
      </div>
    );
  }

  function renderTabFriend() {
    return (
      <div className="sidebar-content-center">
        <div className="tag-Friend">
          <UserAddOutlined />
          <span>Thêm bạn bằng số điện thoại</span>
        </div>
        <div className="tag-Friend">
          <UsergroupDeleteOutlined />
          <span>Tạo nhóm</span>
        </div>
        <div className="tag-Friend">
          <UnorderedListOutlined />
          <span>Danh sách bạn bè</span>
        </div>
        <div className="tag-Friend">
          <UnorderedListOutlined />
          <span>Danh sách nhóm</span>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Tin nhắn", key: "btn-message", icon: <MessageTwoTone /> }, // remember to pass the key prop
    {
      label: "Bạn bè",
      key: "btn-friend",
      icon: <ContactsTwoTone />,
    },
    { label: "Thông báo", key: "btn-notifi", icon: <NotificationTwoTone /> }, // which is required
    { label: "Cài đặt", key: "btn-setting", icon: <SettingTwoTone /> }, // which is required
  ];

  function MessageItem(props) {
    return (
      <div
        id={props.id}
        onClick={() => setChooseMessage(props.id)}
        className={"messageItem " + (chooseMessage == props.id ? "active" : "")}
      >
        <div className="messageItem-left">
          <img
            src={require("../../assets/images/google-icon.jpg")}
            alt="avatar"
          />
        </div>
        <div className="messageItem-center">
          <div className="message-name">{props.name}</div>
          <div className="message-content">{props.content}</div>
        </div>
        <div className="messageItem-right">
          <div className="lastMessageTime">{props.lastMess}</div>
        </div>
      </div>
    );
  }

  return (
    // <div >
    <Row className="sidebar">
      <Col span={6}>
        <Menu
          defaultSelectedKeys="btn-message"
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
          className="sidebar-menu"
          onClick={(e) => setChooseItem(e.key)}
        />
      </Col>
      <Col span={18}>
        <div className="sidebar-content">
          <div className="sidebar-content-header">
            <Form className="form-search">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm "
                type="text"
                className="txt-search"
              />
              {/* <Button htmlType="submit" className="btn-search">
              <SearchOutlined />
            </Button> */}
            </Form>
          </div>
          {chooseItem === "btn-message"
            ? renderListMessage()
            : chooseItem === "btn-friend"
            ? renderTabFriend()
            : ""}
        </div>
      </Col>
    </Row>
    // </div>
  );
}

export default SideBar;
