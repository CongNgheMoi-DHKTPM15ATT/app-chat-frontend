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
  CloseCircleOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import ConversationAPI from "../../api/conversationAPI";
import { createConversations } from "../../slide/conversationSlide";
import { useDispatch } from "react-redux";
import { setChatAccount } from "../../slide/chatSlide";
import { showModalLogout } from "../../slide/modalSlide";
import { Link } from "react-router-dom";
import { addUser, showModelAddFriend } from "../../slide/modalAddFriendSlide";
import userAPI from "../../api/userAPI";
import { showModelAcountUser } from "../../slide/modelAcountSlide";
import { showModalCreateGroup } from "../../slide/modalCreateGroup";

function SideBar({ socket }) {
  const account = useSelector((state) => state.account.account);
  const chatAcount = useSelector((state) => state.chat.account);
  const conversations = useSelector((state) => state.conversation.conver);
  const [chooseItem, setChooseItem] = useState("btn-message");
  const [list_friend, setList_friend] = useState([]);
  const [chooseMessage, setChooseMessage] = useState(0);
  const [chooseUser, setChooseUser] = useState(-1);
  const [chooseFriend, setChooseFriend] = useState(0);
  const [chooseConver, setChooseConver] = useState("");
  const [search, setSearch] = useState(true);
  const [txt_search, setTxt_Search] = useState("");
  const dispatch = useDispatch();
  const href_now = window.location.pathname.split("/")[2];

  // useEffect(() => {
  //   console.log(chooseItem);
  // }, [chooseItem]);

  useEffect(() => {
    if (href_now === "list-friend") {
      setChooseItem("btn-friend");
    } else if (href_now === "message") setChooseItem("btn-message");
    handleGetConversations(account._id);
  }, []);

  useEffect(() => {
    setChooseConver(chatAcount.conversation_id);
  }, [chatAcount]);

  // useEffect(() => {
  //   console.log(chooseFriend);
  // }, [chooseFriend]);

  // useEffect(() => {
  //   console.log(chooseConver);
  // }, [chooseConver]);

  useEffect(() => {
    if (list_friend.length > 0) setSearch(false);
    setChooseUser(-1);
  }, [list_friend]);

  useEffect(() => {
    if (chatAcount.conversation_id === "" && conversations.length > 0) {
      const action = setChatAccount({
        receiver_id: conversations[0].receiver._id,
        conversation_id: conversations[0]._id,
        user_nick_name: conversations[0].nick_name,
        receiver_nick_name: conversations[0].receiver.nick_name,
        avatar: conversations[0].receiver.avatar,
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
      console.log(response);
      dispatch(action);
      console.log(response.conversations);
    } catch (error) {
      console.log("Failed to call API get Conversations By Id " + error);
    }
  };

  const handleGetListSearch = async (text) => {
    try {
      const params = {
        user_id: account._id,
        filter: text,
      };
      const response = await userAPI.searchUser(params);
      setList_friend(response);
    } catch (error) {
      console.log("Failed to call API get list search" + error);
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
            avatar="asdasd"
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
            <TeamOutlined />
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
          onClick={() => {
            // setChooseFriend(2);
            dispatch(showModalCreateGroup());
          }}
        >
          <UsergroupAddOutlined />
          <span>Tạo nhóm</span>
        </div>
      </div>
    );
  }

  const items = [
    {
      label: `${account.user_name}`,
      key: "btn-user",
      icon: <img src={account.avatar} alt="avatar" />,
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
    if (key !== "btn-logout" && key !== "btn-user") setChooseItem(key);
    if (key === "btn-logout") {
      dispatch(showModalLogout());
    } else if (key === "btn-message") {
      setSearch(true);
      setTxt_Search("");
      changeAcountbyChooseMessage(chooseMessage);
    } else if (key === "btn-user") {
      dispatch(showModelAcountUser());
      // setSearch(true);
      // setTxt_Search("");
      // changeAcountbyChooseMessage(chooseMessage);
    } else if (key === "btn-notifi") {
      setSearch(true);
      setTxt_Search("");
      changeAcountbyChooseMessage(chooseMessage);
    } else if (key === "btn-friend") {
      setSearch(true);
      setTxt_Search("");
      changeAcountbyChooseMessage(chooseMessage);
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
            avatar: conversations[props.id].receiver.avatar,
          });
          dispatch(action);
        }}
        className={"messageItem " + (chooseMessage == props.id ? "active" : "")}
      >
        <div className="messageItem-left">
          <img src={conversations[props.id].receiver.avatar} alt="avatar" />
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

  const changeAcountbyChooseMessage = (index) => {
    if (conversations.length <= 0) return;
    const action = setChatAccount({
      receiver_id: conversations[index].receiver._id,
      conversation_id: conversations[index]._id,
      user_nick_name: conversations[index].nick_name,
      receiver_nick_name: conversations[index].receiver.nick_name,
      avatar: conversations[index].receiver.avatar,
    });
    dispatch(action);
  };

  function UserItem(props) {
    return (
      <div
        id={props.id}
        onClick={() => {
          setChooseUser(props.id);
          if (props.user.conversation !== null) {
            const action = setChatAccount({
              receiver_id: props.user._id,
              conversation_id: props.user.conversation,
              user_nick_name: account._id,
              receiver_nick_name: props.user.nick_name,
              avatar: props.user.avatar,
            });
            dispatch(action);
          } else {
            dispatch(addUser({ receiver_id: props.user._id }));
            dispatch(showModelAddFriend());
          }
        }}
        className={"messageItem " + (chooseUser == props.id ? "active" : "")}
      >
        <div className="messageItem-left">
          <img src={props.user.avatar} alt="avatar" />
        </div>
        <div className="messageItem-center">
          <div className="message-name">{props.user.nick_name}</div>
          <div className="message-status">
            {props.user.status === "FRIENDED"
              ? "Đã trò chuyện"
              : props.user.status === "PENDING"
              ? "Đã gửi lời mời"
              : props.user.status === "ACCEPTING"
              ? "Chưa chấp nhận"
              : "Chưa yêu cầu"}
          </div>
        </div>
      </div>
    );
  }

  function rederListUser() {
    var render_list_friend = [];
    if (list_friend.length == 0) {
      return (
        <p style={{ margin: "2vw", fontWeight: "500" }}>
          Không có người dùng tương thích với yêu cầu tìm kiếm
        </p>
      );
    }
    list_friend.map((user, index) => {
      if (user.status !== "BLOCK") {
        render_list_friend.push(
          <UserItem key={index} id={index} user={user}></UserItem>
        );
      }
    });
    return render_list_friend;
  }

  return (
    <Row className="sidebar">
      <Col span={4}>
        <Menu
          defaultSelectedKeys={
            href_now === "message" ? "btn-message" : "btn-friend"
          }
          mode="inline"
          inlineCollapsed={true}
          items={items}
          className="sidebar-menu"
          onClick={(e) => onClicksideBar(e.key)}
        />
      </Col>
      <Col span={20}>
        <div className="sidebar-content">
          <div className="sidebar-content-header">
            <Form className="form-search">
              {/* <Form.Item> */}
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm "
                type="text"
                value={txt_search}
                className="txt-search"
                onChange={(e) => {
                  setTxt_Search(e.target.value);
                  handleGetListSearch(e.target.value);
                }}
              />
              <CloseCircleOutlined
                className={"clear-text " + (search ? "clear-text-hidden" : "")}
                onClick={() => {
                  setTxt_Search("");
                  setSearch(true);
                  setList_friend([]);
                  changeAcountbyChooseMessage(chooseMessage);
                }}
              />
              {/* </Form.Item> */}
            </Form>
          </div>
          {search === false ? (
            <div className="sidebar-content-center">{rederListUser()}</div>
          ) : chooseItem === "btn-message" ? (
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
