import { Button, Col, Form, Input, Row, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import InputEmoji from "react-input-emoji";
import {
  SendOutlined,
  PhoneTwoTone,
  VideoCameraTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileTwoTone,
  FileAddFilled,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "../chatItem/chatItem";
import messageAPI from "../../api/messageAPI";
import { useNavigate } from "react-router-dom";
import { setVideoCallAccount } from "../../slide/videoCallSlide";
import S3API from "../../api/s3API";

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
  const [__ListFileUpload, __SetListFileUpLoad] = useState([]);
  const input_file = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

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
      if (index === 0) {
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
        loadImg = mess.sender.user_id;
      } else {
        if (
          Math.abs(
            new Date(befor_date).getDate() - new Date(mess.createdAt).getDate()
          ) > 0 ||
          Math.abs(new Date(befor_date) - new Date(mess.createdAt)) > 600000
        ) {
          _ListMess.push(renderLine(befor_date));
          check = true;
        }
        if (loadImg !== mess.sender.user_id) check = true;
        loadImg = mess.sender.user_id;
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
      }
      check = false;
      befor_date = mess.createdAt;
    });
    return _ListMess;
  };

  const handleOneBlur = () => {
    let _text = document.getElementById("mess-text").innerHTML;
    if (_text.trim() === "") setValue("");
  };

  const handleVideoCall = () => {
    const y = window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
    const x = window.top.outerWidth / 2 + window.top.screenX - 900 / 2;
    const action = setVideoCallAccount({
      senderId: _id,
      receiverId: chatAcount.receiver_id,
      sender_name: account.user_name,
      receiver_name: chatAcount.receiver_nick_name,
      type: "sender",
    });
    dispatch(action);

    window.open("/video-call", "", `width=900,height=500,top=${y},left=${x}`);
  };

  const openCloseRightTab = () => {
    setRightTab(!rightTab);
  };

  //---- hàm gửi tin nhắn ----//
  const handleEmitMessage = () => {
    const _text = value;
    setValue("");
    if (!(_text === "")) {
      const mess = createMess(
        _text,
        "text",
        false,
        _id,
        chatAcount.user_nick_name
      );
      handleSendMessage(mess);
    }
  };

  const PostFileToS3 = async (img) => {
    try {
      const params = {
        img: img,
      };
      const response = await S3API.sendFile(params);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpLoadFile = (e) => {
    const listFile_size = e.target.files.length;
    for (var i = 0; i < listFile_size; i++) {
      console.log(e.target.files[i].name);
      PostFileToS3(e.target.files[i].name);
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
              <VideoCameraTwoTone
                className="chat-header-toolbar-icon"
                onClick={handleVideoCall}
              />
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
            <Form className="chat-footer-input">
              <Form.Item className="chat-footer-input-form">
                <InputEmoji
                  className="text-area"
                  value={value}
                  ref={content}
                  onChange={setValue}
                  onEnter={handleEmitMessage}
                  placeholder="Nhập tin nhắn...."
                />
              </Form.Item>
              <Form.Item className="chat-footer-input-file">
                <label className="custom-file-upload">
                  <input
                    type="file"
                    name="file"
                    onChange={handleUpLoadFile}
                    multiple
                    style={{ display: "none" }}
                  />
                  <FileAddFilled className="toolbar-icon" />
                </label>
                {/* <input
                  type="file"
                  name="file"
                  onChange={handleUpLoadFile}
                  multiple
                  className="custom-file-input"
                  style={{ visibility: "hidden" }}
                /> */}
                {/* <FileAddFilled
                  className="toolbar-icon"
                  onClick={handleClickChooseFile}
                /> */}
              </Form.Item>
              <Form.Item className="chat-footer-input-action">
                {/* <Button htmlType="submit" className="action-icon"><SendOutlined /></Button> */}
                {value !== "" ? (
                  <Button className="action-icon" onClick={handleEmitMessage}>
                    {/* Gửi */}
                    <SendOutlined />
                  </Button>
                ) : (
                  <button className="action-icon" onClick={handleEmitMessage}>
                    <p>&#128077;</p>
                  </button>
                )}
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
