import { Button, Col, Form, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
  SendOutlined,
  PhoneTwoTone,
  VideoCameraTwoTone,
  LeftSquareTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../slide/messageSlide";
import ChatItem from "../chatItem/chatItem";
import messageAPI from "../../api/messageAPI";

function Chat({ socket }) {
  const account = useSelector((state) => state.account.account);
  const chatAcount = useSelector((state) => state.chat.account);
  const { _id } = account;
  const [value, setValue] = useState("");
  const [rightTab, setRightTab] = useState(false);
  const [_listMessage, _setListMessage] = useState([]);

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
      console.log(response);
    } catch (error) {
      console.log("Failed to call API send message" + error);
    }
  };

  function createMess(content, content_type, deleted, user_id, name) {
    const mess = {
      content: content,
      content_type: content_type,
      deleted: deleted,
      sender: {
        user_id: user_id,
        nick_name: name,
      },
    };
    return mess;
  }

  const getAllMess = async (conver_id) => {
    try {
      const params = {
        conversation_id: conver_id,
      };
      const response = await messageAPI.getAllMessage(params);
      console.log(response.messages);
      _setListMessage(response.messages);
    } catch (error) {
      console.log("Failed to call API get all message " + error);
    }
  };

  const rederListMess = () => {
    const _ListMess = [];
    _listMessage.map((mess, index) => {
      console.log(mess);
      _ListMess.push(
        <ChatItem
          key={index}
          content={mess.content}
          senderId={mess.sender.user_id}
          senderName={mess.sender.nick_name}
          userID={_id}
        />
      );
    });
    return _ListMess;
  };

  useEffect(() => {
    getAllMess(chatAcount.conversation_id);
  }, [chatAcount]);

  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);

  useEffect(() => {
    const addList = (data) => {
      const mess = createMess(
        data.text,
        "text",
        false,
        data.senderId,
        data.nick_name
      );
      console.log(mess);
      _setListMessage((_listMessage) => [..._listMessage, mess]);
    };
    socket.on("getMessage", addList);
    return () => socket.off("getMessage", addList);
  }, [socket]);

  const handleOneBlur = () => {
    let _text = document.getElementById("mess-text").innerHTML;
    if (_text.trim() === "") setValue("");
  };

  const openCloseRightTab = () => {
    setRightTab(!rightTab);
  };

  const handleEmitMessage = () => {
    let _text = document.getElementById("mess-text");
    if (!(_text === "")) {
      const mess = createMess(
        _text.innerHTML.trim(),
        "text",
        false,
        _id,
        chatAcount.user_nick_name
      );
      _setListMessage((_listMessage) => [..._listMessage, mess]);
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
                  src={require("../../assets/images/google-icon.jpg")}
                  alt="avatar"
                />
              </div>
              <div className="chat-header-info-name">
                <p>Nguyễn Hải Nam</p>
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
