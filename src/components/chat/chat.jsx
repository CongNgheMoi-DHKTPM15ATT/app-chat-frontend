import { Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../slide/messageSlide";
import ChatItem from "../chatItem/chatItem";

function Chat({ socket }) {
  const _ListMess = [];
  const account = useSelector((state) => state.account.account);
  const { _id } = account;
  const [_messageValue, _setMessageValue] = useState("");
  const [_listMessage, _setListMessage] = useState([
    {
      content: "Chào anh",
      senderId: _id,
      senderName: "dmd",
    },
    {
      content: "ukm, chào e",
      senderId: "63425fe9468cba4024ddb894",
      senderName: "Nguyễn Hải Nam",
    },
    {
      content: ":))))))))))))))))))))))",
      senderId: _id,
      senderName: "dmd",
    },
  ]);

  const rederListMess = useCallback(() => {
    _listMessage.map((mess, index) => {
      _ListMess.push(
        <ChatItem
          key={index}
          content={mess.content}
          senderId={mess.senderId}
          senderName={mess.senderName}
          userID={_id}
        />
      );
    });
    return _ListMess;
  }, [_listMessage]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      const mess = {
        content: data.text,
        content_type: "text",
        senderId: data.senderId,
        deleted: false,
        // createAt: new Date(Date.now()),
      };
      _setListMessage((_listMessage) => [..._listMessage, mess]);
    });

    rederListMess();
  }, [socket, rederListMess]);

  // useEffect(() => {
  // }, []);

  const handleOneBlur = () => {
    let _text = document.getElementById("mess-text").innerHTML;
    if (_text.trim() === "") _setMessageValue("");
  };

  const setInputValue = (e) => {
    _setMessageValue(e.target.value);
  };

  const handleEmitMessage = () => {
    let _text = document.getElementById("mess-text");
    _setMessageValue("");
    if (!(_text === "")) {
      const mess = {
        content: _text.innerHTML.trim(),
        content_type: "text",
        senderId: _id,
        deleted: false,
        // createAt: new Date(Date.now()),
      };
      _setListMessage((_listMessage) => [..._listMessage, mess]);
      // nguyenhainam_01 = 634255ff21fbe65180fa2f07;
      // nguyenhainam_02 = 63425fe9468cba4024ddb894;
      socket.emit("send", {
        senderId: _id,
        receiverId: "63425fe9468cba4024ddb894",
        text: _text.innerHTML.trim(),
      });
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-header-info"></div>
        <div className="chat-header-toolbar"></div>
      </div>
      <div className="chat-center">
        <div className="chat-center-message">{rederListMess()}</div>
      </div>
      <div className="chat-footer">
        <div className="chat-footer-toolbar"></div>
        <Form className="chat-footer-input">
          <Form.Item className="chat-footer-input-form">
            <TextArea
              rows={3}
              placeholder="Nhập tin nhắn...."
              className="text-area"
              name="text"
              id="mess-text"
              value={_messageValue}
              onPressEnter={handleEmitMessage}
              onBlur={handleOneBlur}
              onChange={setInputValue}
            ></TextArea>
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
    </div>
  );
}

export default Chat;
