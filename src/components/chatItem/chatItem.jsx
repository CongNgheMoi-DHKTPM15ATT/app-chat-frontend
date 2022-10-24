import { Col, Row } from "antd";

function ChatItem(prop) {
  const time =
    new Date(prop.createdAt).getHours() +
    ":" +
    new Date(prop.createdAt).getMinutes();
  console.log(prop)
  return (
    // <div className="chat-item">
    //   {prop.senderId == prop.userID ? (
    //     ""
    //   ) : (
    //     <p className="chat-item-sender">{prop.senderName}</p>
    //   )}

    //   <div
    //     className={
    //       "chat-item-content chat-item-content-" +
    //       (prop.senderId == prop.userID ? "right" : "left")
    //     }
    //   >
    //     {prop.content}
    //   </div>
    // </div>

    <div className="chatItem">
      <div
        className={
          "chat-item chat-item-" +
          (prop.senderId == prop.userID ? "right" : "left")
        }
      >
        <div span={2} className="chat-item-img">
          {prop.loadImg ? (
            <img
              src={prop.avatar}
              alt="avatar"
            />
          ) : (
            ""
          )}
        </div>
        <div
          span={22}
          className={
            "chat-item-content chat-item-content-" +
            (prop.senderId == prop.userID ? "right" : "left")
          }
        >
          {prop.content}
        </div>
        <p className="chat-item-time">{time}</p>
      </div>
    </div>
  );
}

export default ChatItem;