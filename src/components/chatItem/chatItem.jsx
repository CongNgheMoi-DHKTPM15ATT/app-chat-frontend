import { Col, Row, Popover, List, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faArrowRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import messageAPI from "../../api/messageAPI";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";

function ChatItem(prop) {
  const account = useSelector((state) => state.account.account);
  const chatAcount = useSelector((state) => state.chat.account);
  const [open, setOpen] = useState(false);
  const { Title, Paragraph, Text } = Typography;
  const [itemOption, setItemOption] = useState(null);

  const handelDeleteMess = async () => {
    try {
      const params = {
        _id: prop.mess_id,
      };
      const response = await messageAPI.recoverMessage(params);
      if (response.success) {
        console.log(chatAcount.conversation_id);
        prop.socket.emit("load_message", {
          sender_id: account._id,
          receiverId: chatAcount.receiver_id,
          conversation: chatAcount.conversation_id,
        });
      }
    } catch (error) {
      console.log("faid when call API recover message " + error);
    }
  };

  useEffect(() => {
    if (itemOption) {
      if (open) {
        itemOption.style.opacity = 0.6;
      } else {
        itemOption.style.opacity = 0;
      }
    }
  }, [open]);

  const actionMessages = [
    {
      title: "Thu hồi tin nhắn",
      icon: (
        <FontAwesomeIcon
          className="right-tab-action-icon"
          icon={faArrowRotateLeft}
        />
      ),
    },
    {
      title: "Xóa tin nhắn phía bạn",
      icon: (
        <FontAwesomeIcon className="right-tab-action-icon" icon={faTrash} />
      ),
    },
  ];

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const time =
    new Date(prop.createdAt).getHours() +
    ":" +
    new Date(prop.createdAt).getMinutes();

  const renderImage = () => {
    const list_file = prop.content.split("&%&");
    var list = [];
    var tmp = list_file.length;
    var check = (list_file.length - 1) % 2 === 1 ? true : false;
    const y = window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
    const x = window.top.outerWidth / 2 + window.top.screenX - 900 / 2;
    list_file.map((url, index) => {
      const type_file = url.split(".");
      if (url) {
        if (
          type_file[type_file.length - 1] === "mp4" ||
          type_file[type_file.length - 1] === "mp3" ||
          type_file[type_file.length - 1] === "avi" ||
          type_file[type_file.length - 1] === "flv"
        )
          list.push(
            <video
              className="image-content"
              controls
              onClick={() =>
                window.open(url, "", `width=900,height=500,top=${y},left=${x}`)
              }
            >
              <source src={url} />
            </video>
          );
        else if (list_file.length === 1 || (tmp === 2 && check))
          list.push(
            <Col span={24} style={{ margin: "2px" }}>
              <img
                className="image-content"
                src={url}
                alt="image"
                onClick={() =>
                  window.open(
                    url,
                    "",
                    `width=900,height=500,top=${y},left=${x}`
                  )
                }
              />
            </Col>
          );
        else
          list.push(
            <Col span={11} style={{ margin: "2px" }}>
              <img
                className="image-content"
                src={url}
                alt="image"
                onClick={() =>
                  window.open(
                    url,
                    "",
                    `width=900,height=500,top=${y},left=${x}`
                  )
                }
              />
            </Col>
          );
      }
      tmp -= 1;
    });
    return list;
  };

  const openOptional = (e) => {
    setItemOption(
      e.target.closest(".chat-item").querySelector(".chat-item-option")
    );
  };

  const renderOptinal = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={actionMessages}
        className="listActionOptional"
        renderItem={(item) => (
          <List.Item
            onClick={item.event}
            className="right-tab-ant-list-item"
            style={{
              width: "100%",
              cursor: "pointer",
              justifyContent: "flex-start",
            }}
          >
            {item.icon}
            <Text style={{}}>{item.title}</Text>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="chatItem">
      {prop.content_type === "notification" ? (
        <Row className="chatItem-notification">
          <Col className="chatItem-notification-line" span={8}>
            <div className="line"></div>
          </Col>
          <Col className="chatItem-notification-content" span={8}>
            {prop.content}
          </Col>
          <Col className="chatItem-notification-line" span={8}>
            <div className="line"></div>
          </Col>
        </Row>
      ) : (
        <>
          {prop.is_group && prop.loadName ? (
            <div
              className={
                "chatItem-nameSender" +
                (prop.senderId == prop.userID ? "Right" : "Left")
              }
            >
              {prop.senderName}
            </div>
          ) : null}
          <div
            className={
              "chat-item chat-item-" +
              (prop.senderId == prop.userID ? "right" : "left")
            }
          >
            <div className="chat-item-img">
              {prop.loadImg ? <img src={prop.avatar} alt="avatar" /> : ""}
            </div>
            <div
              className={
                "chat-item-content chat-item-content-" +
                (prop.senderId == prop.userID ? "right " : "left ")
              }
              content_type={prop.content_type}
            >
              {prop.content_type === "image" ? renderImage() : prop.content}
            </div>

            <div
              className={
                "chat-item-option chat-item-option-" +
                (prop.senderId == prop.userID ? "right " : "left ")
              }
            >
              {!(prop.content_type === "recover") &&
                prop.senderId == prop.userID && (
                  <Popover
                    content={
                      <>
                        <div
                          onClick={handelDeleteMess}
                          style={{ cursor: "pointer" }}
                          className="popover-action"
                        >
                          <p className="popover-action-item">
                            Thu hồi tin nhắn
                          </p>
                        </div>
                        <div
                          onClick={handelDeleteMess}
                          style={{ cursor: "pointer" }}
                          className="popover-action"
                        >
                          <p className="popover-action-item">Chuyển tiếp</p>
                        </div>
                      </>
                    }
                    title={false}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                  >
                    <div
                      onClick={openOptional}
                      className="chat-item-option-element"
                    >
                      <FontAwesomeIcon
                        className="icon-camera"
                        size="lg"
                        icon={faEllipsis}
                      />
                    </div>
                  </Popover>
                )}
              <div className="chat-item-option-element">{time}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatItem;
