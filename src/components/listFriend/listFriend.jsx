import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConversationAPI from "../../api/conversationAPI";
import messageAPI from "../../api/messageAPI";
import userAPI from "../../api/userAPI";
import { setChatAccount } from "../../slide/chatSlide";

function ListFriend({ socket }) {
  const [chooseTab, setChooseTab] = useState(0);
  const account = useSelector((state) => state.account.account);
  const [listRender, setListRender] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        socket.emit("requestLoadConver", { user: receiver_id });
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
          text: "C??c b???n ???? ???????c k??t n???i v???i nhau tr??n Nulo. H??y b???t ?????u cu???c tr?? chuy???n ngay th??i",
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
            <p>Danh s??ch b???n b??</p>
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
            <p>B???n b??</p>
          </div>
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 1 ? " active" : "")
            }
            onClick={() => setChooseTab(1)}
          >
            <p>L???i m???i tr?? chuy???n</p>
          </div>
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 2 ? " active" : "")
            }
            onClick={() => setChooseTab(2)}
          >
            <p>???? g???i l???i m???i</p>
          </div>
          <div
            className={
              "listFriend-center-toolbar-icon " +
              (chooseTab === 3 ? " active" : "")
            }
            onClick={() => setChooseTab(3)}
          >
            <p>Ch???n ng?????i d??ng</p>
          </div>
        </div>
        <div className="listFriend-center-list">
          <div className="listFriend-center-list-thong-ke">
            <p>
              B???n c?? {listRender.length}{" "}
              {chooseTab === 0
                ? "ng?????i ????? tr?? chuy???n"
                : chooseTab === 1
                ? "y??u c???u tr?? chuy???n"
                : chooseTab === 2
                ? "???? ???????c b???n g???i l???i m???i"
                : "ng?????i trong danh s??ch ch???n"}
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
    const handleGetListSearch = async (text) => {
      try {
        const params = {
          user_id: account._id,
          filter: text,
        };
        const response = await userAPI.searchUser(params);
        navigate("/home/message");
        const action = setChatAccount({
          receiver_id: response[0]._id,
          conversation_id: response[0].conversation,
          user_nick_name: account.user_name,
          receiver_nick_name: response[0].nick_name,
          avatar: response[0].avatar,
        });
        dispatch(action);
      } catch (error) {
        console.log("Failed to call API get list search" + error);
      }
    };
    const handleChangetoMess = (data) => {
      handleGetListSearch(data.user.phone);
    };
    return (
      <Col onClick={() => handleChangetoMess(props)}>
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
              H???y tr?? chuy???n
            </button>
            <button
              className="btn-danger"
              onClick={() => handleBlockFriend(props.user._id)}
            >
              Ch???n
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
              ?????ng ??
            </button>
            <button
              className="btn-danger"
              onClick={() => handleConfirmRequest(props.user._id, false)}
            >
              T??? ch???i
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
              Thu h???i
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
            <button className="btn-primary">B??? ch???n</button>
          </div>
        </div>
      </Col>
    );
  }
}

export default ListFriend;
