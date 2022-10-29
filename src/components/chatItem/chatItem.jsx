import { Col, Row } from "antd";

function ChatItem(prop) {
  const time =
    new Date(prop.createdAt).getHours() +
    ":" +
    new Date(prop.createdAt).getMinutes();
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
        <div
          className={
            "chat-item chat-item-" +
            (prop.senderId == prop.userID ? "right" : "left")
          }
        >
          <div span={2} className="chat-item-img">
            {prop.loadImg ? <img src={prop.avatar} alt="avatar" /> : ""}
          </div>
          <div
            span={22}
            className={
              "chat-item-content chat-item-content-" +
              (prop.senderId == prop.userID ? "right " : "left ")
            }
            content_type={prop.content_type}
          >
            {prop.content_type === "image" ? (
              <img className="image-content" src={prop.content} alt="image" />
            ) : (
              prop.content
            )}
          </div>
          <p className="chat-item-time">{time}</p>
        </div>
      )}
    </div>
  );
}

export default ChatItem;
