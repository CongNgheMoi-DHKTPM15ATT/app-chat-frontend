function ChatItem(prop) {
  return (
    <div className="chat-item">
      {prop.senderId == prop.userID ? (
        ""
      ) : (
        <p className="chat-item-sender">{prop.senderName}</p>
      )}

      <div
        className={
          "chat-item-content chat-item-content-" +
          (prop.senderId == prop.userID ? "right" : "left")
        }
      >
        {prop.content}
      </div>
    </div>
  );
}

export default ChatItem;
