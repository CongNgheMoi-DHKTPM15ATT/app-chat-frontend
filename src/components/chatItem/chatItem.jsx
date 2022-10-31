import { Col, Row, Popover, List, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faArrowRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";


function ChatItem(prop) {
  const [open, setOpen] = useState(false);
  const { Title, Paragraph, Text } = Typography;
  const [itemOption, setItemOption] = useState(null)

  useEffect(() => {
    console.log(itemOption)
    if (itemOption) {
      if (open) {
        itemOption.style.opacity = 0.6;
      } else {
        itemOption.style.opacity = 0;
      }
    }

  }, [open])

  const actionMessages = [{
    title: "Thu hồi tin nhắn",
    icon: (
      <FontAwesomeIcon className="right-tab-action-icon" icon={faArrowRotateLeft} />
    ),
  }, {
    title: "Xóa tin nhắn phía bạn",
    icon: (
      <FontAwesomeIcon className="right-tab-action-icon" icon={faTrash} />
    ),
  }];

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
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
    list_file.map((url, index) => {
      if (url) {
        if (list_file.length === 1 || (tmp === 2 && check))
          list.push(
            <Col span={24} style={{ margin: "2px" }}>
              <img className="image-content" src={url} alt="image" />
            </Col>
          );
        else
          list.push(
            <Col span={11} style={{ margin: "2px" }}>
              <img className="image-content" src={url} alt="image" />
            </Col>
          );
      }
      tmp -= 1;
    });
    return list;
  };

  const openOptional = (e) => {
    console.log("vào vào")
    setItemOption(e.target.closest('.chat-item').querySelector('.chat-item-option'))
    console.log(itemOption)

  }
  const renderOptinal = () => {
      return (
          <List
        itemLayout="horizontal"
        dataSource={actionMessages}
        className="listActionOptional"
        renderItem={(item) => (
          <List.Item
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
    )
  }

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
              {prop.content_type === "image" ? (
                <Row justify="space-evenly">{renderImage()}</Row>
              ) : (
                prop.content
              )}
            </div>
            <p className="chat-item-time">{time}</p>
            <p className="chat-item-action">...</p>
          </div>


          <div className={"chat-item-option chat-item-option-"+(prop.senderId == prop.userID ? "right " : "left ")}>
            <div className="chat-item-option-element">{time}</div>
            <Popover
              content={renderOptinal}
              title={false}
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
            >
            <div onClick={openOptional} className="chat-item-option-element">
              < FontAwesomeIcon className = "icon-camera" size = "lg" icon = { faEllipsis }/>
            </div>
            </Popover>
          </div>
          <div className={"chat-item-optional chat-item-optional-"+(prop.senderId == prop.userID ? "right " : "left ")}>
              <div className="chat-item-optional-element">{time}</div>
              <div className="chat-item-optional-element">
              < FontAwesomeIcon className = "icon-camera" size = "lg" icon = { faEllipsis }/>
            </div>
          </div>

          
          
          
        </div>
  )
} <
/div>
);

}

export default ChatItem;