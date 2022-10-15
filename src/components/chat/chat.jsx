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

  const getAllMess = async (conver_id) => {
    try {
      const params = {
        conversation_id: conver_id,
      };
      const response = await messageAPI.getAllMessage(params);
      _setListMessage(response.message);
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
          senderId={mess.sender}
          senderName={mess.senderName}
          userID={_id}
        />
      );
    });
    return _ListMess;
  };

  useEffect(() => {
    const addList = (data) => {
      const mess = {
        content: data.text,
        content_type: "text",
        senderId: data.senderId,
        deleted: false,
        // createAt: new Date(Date.now()),
      };
      _setListMessage((_listMessage) => [..._listMessage, mess]);
    };
    socket.on("getMessage", addList);
    return () => socket.off("getMessage", addList);
  }, [socket]);

  useEffect(() => {
    getAllMess(chatAcount.id);
  }, [chatAcount]);

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
      const mess = {
        content: _text.innerHTML.trim(),
        content_type: "text",
        senderId: _id,
        deleted: false,
        // createAt: new Date(Date.now()),
      };
      _setListMessage((_listMessage) => [..._listMessage, mess]);
      // _listMessage.push(mess);
      // nguyenhainam_01 = 634255ff21fbe65180fa2f07;
      // nguyenhainam_02 = 63425fe9468cba4024ddb894;
      socket.emit("send", {
        senderId: _id,
        receiverId: "63425fe9468cba4024ddb894",
        text: _text.innerHTML.trim(),
      });
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
