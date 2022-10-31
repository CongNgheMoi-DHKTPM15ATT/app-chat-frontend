import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConversationAPI from "../../api/conversationAPI";
import messageAPI from "../../api/messageAPI";
import userAPI from "../../api/userAPI";

function ListFriend({ socket }) {
  const [chooseTab, setChooseTab] = useState(0);
  const account = useSelector((state) => state.account.account);
  const [listRender, setListRender] = useState([]);

  useEffect(() => {
    if (chooseTab === 2) handleGetListPending("pending");
    else if (chooseTab === 0) handleGetListPending("friended");
    else if (chooseTab === 1) handleGetListPending("accepting");
    else if (chooseTab === 3) handleGetListPending("block");
  }, [chooseTab]);

  const handleGetListPending = async (status) => {
    const params = {
      user_id: account._id,
      status: status,
    };
    try {
      const response = await userAPI.getUserPending(params);
      console.log(response);
      setListRender(response);
    } catch (error) {
      console.log("Fial when call API get list pending friend");
    }
  };

  const handleRemoveFriend = async (receiver_id) => {
    const params = {
      user_id: account._id,
      receiver_id: receiver_id,
    };
    try {
      const response = await userAPI.removeFriend(params);
      if (response.success) {
        socket.emit("loadConver", { sender_id: account._id });
        socket.emit("requestLoadConver", { user: [receiver_id] });
        handleGetListPending("friended");
      }
    } catch (error) {
      console.log("Fail when call API confirm request");
    }
  };

  const handleCancelRequest = async (receiver_id) => {
    const params = {
      user_id: account._id,
      receiver_id: receiver_id,
    };
    try {
      const response = await userAPI.cancelRequest(params);
      if (response) handleGetListPending("pending");
    } catch (error) {
      console.log("Fail when call API confirm request");
    }
  };

  const handleBlockFriend = async (receiver_id) => {
    const params = {
      user_id: account._id,
      receiver_id: receiver_id,
    };
    try {
      const response = await userAPI.blockFriend(params);
      if (response) handleGetListPending("friended");
    } catch (error) {
      console.log("Fail when call API confirm request");
    }
  };

  const handleConfirmRequest = async (receiver_id, status) => {
    const params = {
      user_id: account._id,
      receiver_id: receiver_id,
      is_accept: status,
    };
    try {
      const response = await userAPI.sendConfirmRequest(params);
      if (response) {
        if (status) handleCreateConversation(receiver_id);
        else handleGetListPending("accepting");
      }
      console.log(response);
    } catch (error) {
      console.log("Fail when call API confirm request");
    }
  };

  const handleCreateConversation = async (receiver_id) => {
    const params = {
      user_id: [account._id, receiver_id],
    };
    try {
      const response = await ConversationAPI.createConversation(params);
      if (response._id) {
        await messageAPI.sendMessage({
          sender_id: account._id,
          conversation_id: response._id,
          text: "Các bạn đã được kêt nối với nhau trên Nulo. Hãy bắt đầu cuộc trò chuyện ngay thôi",
          content_type: "notification",
        });
        socket.emit("loadConver", { sender_id: account._id });
        socket.emit("requestLoadConver", { user: [receiver_id] });
        handleGetListPending("accepting");
      }
    } catch (error) {
      console.log("Fail when call API create conversation");
    }
  };

  function renderListFriend() {
    var list = [];
    listRender.map((user, index) => {
      list.push(
        <UserCard_Friended user={user} key={index}></UserCard_Friended>
      );
    });

    return list;
  }

  function renderListAcceptingFriend() {
    var list = [];
    listRender.map((user, index) => {
      list.push(
        <UserCard_Accepting user={user} key={index}></UserCard_Accepting>
      );
    });

    return list;
  }

  function renderListPendingFriend() {
    var list = [];
    listRender.map((user, index) => {
      list.push(<UserCard_Pending user={user} key={index}></UserCard_Pending>);
    });

    return list;
  }

  function renderListBlock() {
    var list = [];
    listRender.map((user, index) => {
      list.push(<UserCard_Block user={user} key={index}></UserCard_Block>);
    });

    return list;
  }

  return (
    <div className="listFriend">
      <div className="listFriend-header">
        <div className="listFriend-header-info">
          <div className="listFriend-header-info-img">
            <img
              src={require("../../assets/images/add-friend-02.jpg")}
              alt="avatar"
            />
          </div>
          <div className="listFriend-header-info-name">
            <p>Danh sách bạn bè</p>
          </div>
        </div>
      </div>
      <div className="listFriend-center">
        <div className="listFriend-center-toolbar">
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 0 ? " active" : "")
            }
            onClick={() => setChooseTab(0)}
          >
            <p>Bạn bè</p>
          </div>
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 1 ? " active" : "")
            }
            onClick={() => setChooseTab(1)}
          >
            <p>Lời mời trò chuyện</p>
          </div>
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 2 ? " active" : "")
            }
            onClick={() => setChooseTab(2)}
          >
            <p>Đã gửi lời mời</p>
          </div>
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 3 ? " active" : "")
            }
            onClick={() => setChooseTab(3)}
          >
            <p>Chặn người dùng</p>
          </div>
        </div>
        <div className="listFriend-center-list">
          <div className="listFriend-center-list-thong-ke">
            <p>
              Bạn có {listRender.length}{" "}
              {chooseTab === 0
                ? "người để trò chuyện"
                : chooseTab === 1
                ? "yêu cầu trò chuyện"
                : chooseTab === 2
                ? "đã được bạn gửi lời mời"
                : "người trong danh sách chặn"}
            </p>
          </div>
          <Row gutter={[20, 24]} justify="space-evenly">
            {chooseTab === 0
              ? renderListFriend()
              : chooseTab === 1
              ? renderListAcceptingFriend()
              : chooseTab === 2
              ? renderListPendingFriend()
              : renderListBlock()}
          </Row>
        </div>
      </div>
    </div>
  );

  function UserCard_Friended(props) {
    return (
      <Col>
        <div className="user-card">
          <div className="user-card-img">
            <img src={props.user.avatar} alt="avatar" />
          </div>
          <div className="user-card-center">
            <div className="user-card-center-name">
              <p>{props.user.user_name}</p>
            </div>
          </div>
          <div className="user-card-button button-friend">
            <button
              onClick={() => handleRemoveFriend(props.user._id)}
              className="btn-primary"
            >
              Hủy trò chuyện
            </button>
            <button
              className="btn-danger"
              onClick={() => handleBlockFriend(props.user._id)}
            >
              Chặn
            </button>
          </div>
        </div>
      </Col>
    );
  }

  function UserCard_Accepting(props) {
    return (
      <Col>
        <div className="user-card">
          <div className="user-card-img">
            <img src={props.user.avatar} alt="avatar" />
          </div>
          <div className="user-card-center">
            <div className="user-card-center-name">
              <p>{props.user.user_name}</p>
            </div>
          </div>
          <div className="user-card-button button-friend">
            <button
              onClick={() => handleConfirmRequest(props.user._id, true)}
              className="btn-primary"
            >
              Đồng ý
            </button>
            <button
              className="btn-danger"
              onClick={() => handleConfirmRequest(props.user._id, false)}
            >
              Từ chối
            </button>
          </div>
        </div>
      </Col>
    );
  }

  function UserCard_Pending(props) {
    return (
      <Col>
        <div className="user-card">
          <div className="user-card-img">
            <img src={props.user.avatar} alt="avatar" />
          </div>
          <div className="user-card-center">
            <div className="user-card-center-name">
              <p>{props.user.user_name}</p>
            </div>
          </div>
          <div className="user-card-button button-friend">
            <button
              className="btn-danger"
              onClick={() => handleCancelRequest(props.user._id)}
            >
              Thu hồi
            </button>
          </div>
        </div>
      </Col>
    );
  }

  function UserCard_Block(props) {
    return (
      <Col>
        <div className="user-card">
          <div className="user-card-img">
            <img src={props.user.avatar} alt="avatar" />
          </div>
          <div className="user-card-center">
            <div className="user-card-center-name">
              <p>{props.user.user_name}</p>
            </div>
          </div>
          <div className="user-card-button button-friend">
            <button className="btn-primary">Bỏ chặn</button>
          </div>
        </div>
      </Col>
    );
  }
}

export default ListFriend;
