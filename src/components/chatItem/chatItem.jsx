import { Col, Row } from "antd";

function ChatItem(prop) {
  console.log(prop);
  const time =
    new Date(prop.createdAt).getHours() +
    ":" +
    new Date(prop.createdAt).getMinutes();
  return (
    <div className="chatItem">
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
            (prop.senderId == prop.userID ? "right" : "left")
          }
        >
          {prop.content_type === "image" ? (
            // <img className="image-content" src={prop.content} alt="image" />
            <img
              className="image-content"
              src="https://zpsocial-f48-org.zadn.vn/ccdf550265c28a9cd3d3.jpg"
              alt="image"
            />
          ) : (
            prop.content
          )}
        </div>
        <p className="chat-item-time">{time}</p>
      </div>
    </div>
  );
}

export default ChatItem;
