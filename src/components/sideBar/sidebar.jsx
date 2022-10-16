import React, { useState, useEffect } from "react";
import { Menu, Form, Input, Row, Col, Modal } from "antd";
import {
  MessageTwoTone,
  ContactsTwoTone,
  UnorderedListOutlined,
  SettingTwoTone,
  NotificationTwoTone,
  UserAddOutlined,
  UsergroupDeleteOutlined,
  SearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import ConversationAPI from "../../api/conversationAPI";
import { createConversations } from "../../slide/conversationSlide";
import { useDispatch } from "react-redux";
import { setChatAccount } from "../../slide/chatSlide";
import { showModalLogout } from "../../slide/modalSlide";
import { Link } from "react-router-dom";

function SideBar({ socket }) {
  const account = useSelector((state) => state.account.account);
  const chatAcount = useSelector((state) => state.chat.account);
  const conversations = useSelector((state) => state.conversation.conver);
  const [chooseItem, setChooseItem] = useState("btn-message");
  const [chooseMessage, setChooseMessage] = useState(0);
  const [chooseFriend, setChooseFriend] = useState(0);
  const [chooseConver, setChooseConver] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    handleGetConversations(account._id);
  }, []);

  useEffect(() => {
    setChooseConver(chatAcount.conversation_id);
  }, [chatAcount]);

  useEffect(() => {
    console.log(chooseFriend);
  }, [chooseFriend]);

  useEffect(() => {
    console.log(chooseConver);
  }, [chooseConver]);

  useEffect(() => {
    if (chatAcount.conversation_id === "" && conversations.length > 0) {
      const action = setChatAccount({
        receiver_id: conversations[0].receiver._id,
        conversation_id: conversations[0]._id,
        user_nick_name: conversations[0].nick_name,
        receiver_nick_name: conversations[0].receiver.nick_name,
      });
      dispatch(action);
      setChooseMessage(0);
    } else {
      setChooseMessage(
        conversations.findIndex((conver) => conver._id === chooseConver)
      );
    }
  }, [conversations]);

  //---- hàm nhận tin nhắn từ socket gửi đến ----//
  useEffect(() => {
    const changeConver = () => {
      handleGetConversations(account._id);
    };
    socket.on("getMessage", changeConver);
    socket.on("load-conver", changeConver);
    return () => socket.off("getMessage", changeConver);
  }, [socket]);

  const handleGetConversations = async (id) => {
    try {
      const params = {
        user_id: id,
      };
      const response = await ConversationAPI.getConversationsById(params);
      const action = createConversations(response.conversations);
      dispatch(action);
    } catch (error) {
      console.log("Failed to call API get Conversations By Id " + error);
    }
  };

  function changeCreate(date) {
    const time = Math.abs(new Date() - new Date(date));
    if (Math.floor(time / 1000) < 60) return "vài giây trước";
    else if (Math.floor(time / 1000 / 60) < 60) {
      return Math.floor(time / 1000 / 60) + " phút";
    } else if (Math.floor(time / 1000 / 60 / 60) < 24) {
      return Math.floor(time / 1000 / 60 / 60) + " giờ";
    } else return Math.floor(time / 1000 / 60 / 60 / 24) + " ngày";
  }

  function renderListMessage() {
    var list_conver = [];
    conversations.map((conver, index) => {
      if (!(conver.last_message == undefined)) {
        list_conver.push(
          <MessageItem
            key={index}
            id={index}
            conver_id={conver._id}
            // name={user.name}
            name={conver.receiver.nick_name}
            avatar="../../assets/images/user-icon_03.png"
            content={conver.last_message.content}
            lastMess={changeCreate(conver.last_message.createdAt)}
          ></MessageItem>
        );
      }
    });
    return list_conver;
  }

  function renderTabFriend() {
    return (
      <div className="sidebar-content-center">
        <Link to="/home/list-friend">
          <div
            className={"tag-Friend " + (chooseFriend == 0 ? "active" : "")}
            onClick={() => setChooseFriend(0)}
          >
            <UnorderedListOutlined />
            <span>Danh sách bạn bè</span>
          </div>
        </Link>
        <div
          className={"tag-Friend " + (chooseFriend == 1 ? "active" : "")}
          onClick={() => setChooseFriend(1)}
        >
          <UnorderedListOutlined />
          <span>Danh sách nhóm</span>
        </div>
        <div
          className={"tag-Friend " + (chooseFriend == 2 ? "active" : "")}
          onClick={() => setChooseFriend(2)}
        >
          <UserAddOutlined />
          <span>Thêm bạn bè</span>
        </div>
        <div
          className={"tag-Friend " + (chooseFriend == 3 ? "active" : "")}
          onClick={() => setChooseFriend(3)}
        >
          <UsergroupDeleteOutlined />
          <span>Tạo nhóm</span>
        </div>
      </div>
    );
  }

  const items = [
    {
      label: `${account.user_name}`,
      key: "btn-user",
      icon: (
        <img
          src={require("../../assets/images/user-icon_03.png")}
          alt="avatar"
        />
      ),
    },
    {
      label: <Link to="/home/message">tin nhắn</Link>,
      key: "btn-message",
      icon: <MessageTwoTone />,
    },
    {
      label: <Link to="/home/list-friend">Bạn bè</Link>,
      key: "btn-friend",
      icon: <ContactsTwoTone />,
    },
    { label: "Thông báo", key: "btn-notifi", icon: <NotificationTwoTone /> },
    {
      label: "Cài đặt",
      key: "btn-setting",
      icon: <SettingTwoTone />,
      children: [
        {
          label: "Đăng xuất",
          key: "btn-logout",
          icon: <LogoutOutlined />,
          // onClick: { showModal },
        },
      ],
    },
  ];
  const onClicksideBar = (key) => {
    setChooseItem(key);
    if (key === "btn-logout") {
      dispatch(showModalLogout());
    }
  };

  function MessageItem(props) {
    return (
      <div
        id={props.id}
        onClick={() => {
          setChooseMessage(props.id);
          const action = setChatAccount({
            receiver_id: conversations[props.id].receiver._id,
            conversation_id: conversations[props.id]._id,
            user_nick_name: conversations[props.id].nick_name,
            receiver_nick_name: conversations[props.id].receiver.nick_name,
          });
          dispatch(action);
        }}
        className={"messageItem " + (chooseMessage == props.id ? "active" : "")}
      >
        <div className="messageItem-left">
          <img
            src={require("../../assets/images/user-icon_03.png")}
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
    <Row className="sidebar">
      <Col span={6}>
        <Menu
          defaultSelectedKeys="btn-message"
          mode="inline"
          inlineCollapsed={true}
          items={items}
          className="sidebar-menu"
          onClick={(e) => onClicksideBar(e.key)}
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
          {chooseItem === "btn-message" || chooseItem === "btn-logout" ? (
            <div className="sidebar-content-center">{renderListMessage()}</div>
          ) : chooseItem === "btn-friend" ? (
            renderTabFriend()
          ) : (
            ""
          )}
        </div>
      </Col>
    </Row>
  );
}

export default SideBar;
