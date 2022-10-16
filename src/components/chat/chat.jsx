import { Button, Col, Form, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
  SendOutlined,
  PhoneTwoTone,
  VideoCameraTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "../chatItem/chatItem";
import messageAPI from "../../api/messageAPI";

function Chat({ socket }) {
  const account = useSelector((state) => state.account.account);
  const chatAcount = useSelector((state) => state.chat.account);
  const { _id } = account;
  const [value, setValue] = useState("");
  const [rightTab, setRightTab] = useState(false);
  const [_listMessage, _setListMessage] = useState([]);
  const [pendingMess, setPendingMess] = useState("");
  const content = useRef("");
  const ngay_trong_tuan = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const bottomRef = useRef(null);

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);
  //---- hàm lấy toàn bộ tin nhắn khi có sự thay dổi người nhận tin nhắn ----//
  useEffect(() => {
    getAllMess(chatAcount.conversation_id);
  }, [chatAcount]);

  useEffect(() => {
    if (pendingMess !== "") {
      if (chatAcount.receiver_id === pendingMess.sender.user_id)
        _setListMessage((_listMessage) => [pendingMess, ..._listMessage]);
    }
  }, [pendingMess]);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //   console.log("find");
  // }, [_listMessage]);

  //---- hàm nhận tin nhắn từ socket gửi đến ----//
  useEffect(() => {
    socket.on("getMessage", (data) => {
      const mess = createMess(
        data.text,
        "text",
        false,
        data.senderId,
        data.nick_name
      );
      setPendingMess(mess);
    });
    // return () => socket.off("getMessage", addList);
  }, [socket]);

  //---- hàm gửi tin nhắn ----//
  const handleSendMessage = async (message) => {
    try {
      const params = {
        sender_id: _id,
        conversation_id: chatAcount.conversation_id,
        text: message.content,
      };
      const response = await messageAPI.sendMessage(params);
      socket.emit("send", {
        senderId: _id,
        receiverId: chatAcount.receiver_id,
        nick_name: chatAcount.user_nick_name,
        text: message.content,
      });
      _setListMessage((_listMessage) => [message, ..._listMessage]);
    } catch (error) {
      console.log("Failed to call API send message" + error);
    }
  };
  //---- hàm tạo 1 đối tượng tin nhắn ----//
  function createMess(content, content_type, deleted, user_id, name) {
    const d = new Date();
    const mess = {
      content: content,
      content_type: content_type,
      deleted: deleted,
      createdAt: d,
      sender: {
        user_id: user_id,
        nick_name: name,
      },
    };
    return mess;
  }
  //---- hàm lấy toàn bộ tin nhắn ----//
  const getAllMess = async (conver_id) => {
    try {
      const params = {
        conversation_id: conver_id,
      };
      const response = await messageAPI.getAllMessage(params);
      _setListMessage(response.messages);
    } catch (error) {
      console.log("Failed to call API get all message " + error);
    }
  };

  function renderLine(time) {
    const d = new Date(time);
    return (
      <div className="line">
        <p>
          {Math.abs(new Date() - new Date(time)) > 1000 * 60 * 60 * 24 * 7
            ? `${d.getHours()}:${d.getMinutes()} ${d.getDate()}Tháng${
                d.getMonth() + 1
              }, ${d.getFullYear()}`
            : `${
                ngay_trong_tuan[d.getDay()]
              } ${d.getHours()}:${d.getMinutes()}`}
        </p>
      </div>
    );
  }

  //---- hàm render toàn bộ tin nhắn ----//
  const rederListMess = () => {
    const _ListMess = [];
    var loadImg = "";
    var check = true;
    var befor_date = "";
    _listMessage.map((mess, index) => {
      if (loadImg !== mess.sender.user_id) check = true;
      loadImg = mess.sender.user_id;
      if (
        Math.abs(
          new Date(befor_date).getDate() - new Date(mess.createdAt).getDate()
        ) > 0 ||
        Math.abs(new Date(befor_date) - new Date(mess.createdAt)) > 600000
      ) {
        _ListMess.push(renderLine(mess.createdAt));
        check = true;
      }
      _ListMess.push(
        <ChatItem
          key={index}
          content={mess.content}
          senderId={mess.sender.user_id}
          senderName={mess.sender.nick_name}
          loadImg={check}
          createdAt={mess.createdAt}
          userID={_id}
        />
      );
      check = false;
      befor_date = mess.createdAt;
    });
    return _ListMess;
  };

  const handleOneBlur = () => {
    let _text = document.getElementById("mess-text").innerHTML;
    if (_text.trim() === "") setValue("");
  };

  const openCloseRightTab = () => {
    setRightTab(!rightTab);
  };
  //---- hàm gửi tin nhắn ----//
  const handleEmitMessage = () => {
    const _text = content.current.resizableTextArea.props.value;
    if (!(_text === "")) {
      const mess = createMess(
        _text,
        "text",
        false,
        _id,
        chatAcount.user_nick_name
      );
      handleSendMessage(mess);
      setValue("");
    }
  };

  return (
    <div className="chat">
      <Row>
        <Col span={rightTab ? 18 : 24}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-info-img">
                <img
                  src={require("../../assets/images/user-icon_03.png")}
                  alt="avatar"
                />
              </div>
              <div className="chat-header-info-name">
                <p>{chatAcount.receiver_nick_name}</p>
              </div>
            </div>
            <div className="chat-header-toolbar">
              <PhoneTwoTone className="chat-header-toolbar-icon" />
              <VideoCameraTwoTone className="chat-header-toolbar-icon" />
              {rightTab ? (
                <MenuUnfoldOutlined
                  className="chat-header-toolbar-icon"
                  onClick={openCloseRightTab}
                />
              ) : (
                <MenuFoldOutlined
                  className="chat-header-toolbar-icon"
                  onClick={openCloseRightTab}
                />
              )}
            </div>
          </div>
          <div className="chat-center">
            <div className="chat-center-message">{rederListMess()}</div>
          </div>
          <div className="chat-footer">
            <div className="chat-footer-toolbar"></div>
            <Form className="chat-footer-input">
              <Form.Item className="chat-footer-input-form">
                <TextArea
                  id="mess-text"
                  ref={content}
                  className="text-area"
                  placeholder="Nhập tin nhắn...."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onPressEnter={handleEmitMessage}
                  onBlur={handleOneBlur}
                  autoSize={{
                    minRows: 1,
                    maxRows: 3,
                  }}
                />
              </Form.Item>
              <Form.Item className="chat-footer-input-action">
                {/* <Button htmlType="submit" className="action-icon"><SendOutlined /></Button> */}
                <Button className="action-icon" onClick={handleEmitMessage}>
                  Gửi
                  <SendOutlined />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        {rightTab ? (
          <Col span={6}>
            <div className="right-tab">
              <div className="right-tab-header">
                <p>Thông tin hội thoại</p>
              </div>
            </div>
          </Col>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
}

export default Chat;
