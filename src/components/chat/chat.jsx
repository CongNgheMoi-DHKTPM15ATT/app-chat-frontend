import { Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import { useEffect } from "react";

function Chat({ socket }) {
  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log(data.text);
    });
  }, [socket]);
  const handleEmitMessage = () => {
    let _text = document.getElementById("mess-text").innerHTML.trim();
    document.getElementById("mess-text").value = "";
    // nguyenhainam_01 = 634255ff21fbe65180fa2f07;
    // nguyenhainam_02 = 63425fe9468cba4024ddb894;
    socket.emit("send", {
      senderId: "634255ff21fbe65180fa2f07",
      receiverId: "63425fe9468cba4024ddb894",
      text: _text,
    });
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-header-info"></div>
        <div className="chat-header-toolbar"></div>
      </div>
      <div className="chat-center">
        <div className="chat-center-message"></div>
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
              onPressEnter={handleEmitMessage}
            ></TextArea>
          </Form.Item>
          <Form.Item className="chat-footer-input-action">
            {/* <Button htmlType="submit" className="action-icon"><SendOutlined /></Button> */}
            <Button className="action-icon" onClick={handleEmitMessage}>
              {" "}
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
