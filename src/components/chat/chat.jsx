import { Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../slide/messageSlide";

function Chat({ socket }) {
  const [_messageValue, _setMessageValue] = useState("");
  const message = useSelector((state) => state.message);
  const [_listMessage, _setListMessage] = useState();
  // let _listMessage = [];
  const account = useSelector((state) => state.account.account);
  const dispatch = useDispatch();
  const { _id } = account;

  useEffect(() => {
    socket.on("getMessage", (data) => {
      // ListMessage.push({
      //   content: data.text,
      //   content_type: "text",
      //   sender: data.senderId,
      //   deleted: false,
      //   createAt: new Date(Date.now()),
      // });
      console.log(data.text);
    });
  }, [socket]);

  useEffect(() => {
    rederListMess();
  }, [message]);

  function ChatItem(prop) {
    return (
      <div className="chat-item">
        {prop.senderId == _id ? (
          ""
        ) : (
          <p className="chat-item-sender">{prop.senderName}</p>
        )}

        <div
          className={
            "chat-item-content chat-item-content-" +
            (prop.senderId == _id ? "right" : "left")
          }
        >
          {prop.content}
        </div>
      </div>
    );
  }

  //   useEffect(() => {
  //     _listMessage.map((mess, index) => {
  //       console.log(index + " : " + mess.content);
  //       //   _rederListMess.push(
  //       //     <ChatItem
  //       //       key={index}
  //       //       content={mess.content}
  //       //       senderId={mess.sender}
  //       //       senderName={mess.sender}
  //       //     />
  //       //   );
  //     });
  //   }, [_listMessage]);

  const rederListMess = () => {
    const _ListMess = [];
    message.forEach((mess, index) => {
      console.log(index + " : " + mess.content);
    });
    // _rederListMess.push(
    //   <ChatItem
    //     content={mess.content}
    //     senderId={mess.sender}
    //     senderName={mess.sender}
    //   />
    // );
    _setListMessage(_ListMess);
  };

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
        sender: _id,
        deleted: false,
        // createAt: new Date(Date.now()),
      };
      // _listMessage.push(_listMessage, mess);
      // console.log(_listMessage);
      //   rederListMess(mess);
      dispatch(addMessage(mess));
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
        {/* <div className="chat-center-message"> */}
        {/* {.map((mess, index) => {
            <ChatItem key={index} content={mess.content}></ChatItem>;
          })} */}
        {/* <ChatItem
            content="hello nhok"
            senderId="634255ff21fbe65180fa2f07"
            senderName="dmd"
          ></ChatItem>
          <ChatItem
            content="hello nhok          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassssssssssssss sssssssssssssssssssssss"
            senderId="63425fe9468cba4024ddb894"
            senderName="dmd"
          ></ChatItem>
          <ChatItem
            content="hello nhok"
            senderId="634255ff21fbe65180fa2f07"
            senderName="dmd"
          ></ChatItem>
        </div> */}
        <div className="chat-center-message">{_listMessage}</div>
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
