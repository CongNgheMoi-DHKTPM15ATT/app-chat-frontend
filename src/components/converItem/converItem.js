function ConversationItem(props) {
  return (
    <div
      id={props.id}
      className={
        "messageItem " + (props.chooseMessage == props.id ? "active" : "")
      }
    >
      <div className="messageItem-left">
        <img
          src={require("../../assets/images/user-icon_03.png")}
          alt="avatar"
        />
      </div>
      <div className="messageItem-center">
        <div className="message-name">{props.name}</div>
        <div className="message-content">{props.content}</div>
      </div>
      <div className="messageItem-right">
        <div className="lastMessageTime">{props.lastMess}</div>
      </div>
    </div>
  );
}

export default ConversationItem;
