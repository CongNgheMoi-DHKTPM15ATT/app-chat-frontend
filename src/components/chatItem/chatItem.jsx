import { Col, Row } from "antd";

function ChatItem(prop) {
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
        </>
      )}
    </div>
  );
}

export default ChatItem;
