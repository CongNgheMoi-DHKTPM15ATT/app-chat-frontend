import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { Link, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import { closeModalLogout } from "../../slide/modalSlide";
import { setAccount } from "../../slide/userSlide";
import { setChatAccount } from "../../slide/chatSlide";
import { createConversations } from "../../slide/conversationSlide";
import ListFriend from "../listFriend/listFriend";
import {
  addUser,
  closeModelAddFriend,
  showModelAddFriend,
} from "../../slide/modalAddFriendSlide";
import userAPI from "../../api/userAPI";
import { closeModelAcountUser } from "../../slide/modelAcountSlide";
import { setVideoCallAccount } from "../../slide/videoCallSlide";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const [receivingCall, setReceivingCall] = useState(false);
  const account = useSelector((state) => state.account.account);
  const modelAcountUser = useSelector(
    (state) => state.modelAcountUser.openModal
  );
  const modelLogout = useSelector((state) => state.modalLogout.openModal);
  const modelAddFriend = useSelector((state) => state.modelAddFriend.openModal);
  const modelAddFriend_user = useSelector(
    (state) => state.modelAddFriend.user.receiver_id
  );
  const [userGetById, setUserGetById] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [videoName, setVideoName] = useState("");
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);

  useEffect(() => {
    socket.on("request_video_call", (data) => {
      setReceivingCall(true);
      setVideoName(data.sender_name);
      setVideoData(data);
    });
  }, [socket]);

  useEffect(() => {
    getUserById(modelAddFriend_user);
    console.log(getUserById(modelAddFriend_user));
  }, [modelAddFriend_user]);

  // useEffect(() => {
  //   console.log(userGetById);
  // }, [userGetById]);

  const getUserById = async (id) => {
    const params = { _id: id };

    try {
      const response = await userAPI.getUserbyId(params);
      setUserGetById(response);
    } catch (error) {
      console.log("Fail when axios API get user by ID: " + error);
    }
  };

  const sendRequestAddFriend = async (user_id, receiver_id) => {
    const params = {
      user_id: user_id,
      receiver_id: receiver_id,
    };
    try {
      const response = await userAPI.sendFriendRequest(params);
      console.log(response);
    } catch (error) {
      console.log("Fail when call API sen request add friend: " + error);
    }
  };

  const handleCancel_Call = () => {
    setReceivingCall(false);
  };

  const handleCancel_modelAcountUser = () => {
    dispatch(closeModelAcountUser());
  };
  const handleOk_modelAddFriend = () => {
    sendRequestAddFriend(account._id, modelAddFriend_user);
    dispatch(closeModelAddFriend());
    dispatch(addUser({ receiver_id: "" }));
  };
  const handleCancel_modelAddFriend = () => {
    dispatch(closeModelAddFriend());
    dispatch(addUser({ receiver_id: "" }));
  };
  const handleOk = () => {
    console.log("ok");
    const action = setAccount({ _id: "" });
    dispatch(action);
    dispatch(
      setChatAccount({
        receiver_nick_name: "",
        user_nick_name: "",
        conversation_id: "",
        receiver_id: "",
      })
    );
    dispatch(createConversations([]));
    dispatch(closeModalLogout());
    navigate("/login");
  };
  const handleCancel = () => {
    console.log("cancel");
    dispatch(closeModalLogout());
  };
  return (
    <div className="homepage">
      <Row>
        <Col span={6}>
          <SideBar socket={socket} />
        </Col>
        <Routes>
          <Route
            path="/list-friend"
            element={
              <PrivateRoute>
                <Col span={18}>
                  <ListFriend socket={socket} />
                </Col>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/message"
            element={
              <PrivateRoute>
                <Col span={18}>
                  <Chat socket={socket} />
                </Col>
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Row>

      <Modal
        title="Cảnh báo"
        open={modelLogout}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p
          style={{ textAlign: "center", fontWeight: "500", fontSize: "1.2em" }}
        >
          Bạn muốn đăng xuất tài khoản trên thiết bị này !
        </p>
      </Modal>

      <Modal
        title="Thông tin người dùng"
        open={modelAddFriend}
        //onOk={handleOk_modelAddFriend}
        onCancel={handleCancel_modelAddFriend}
        className="modal-addfriend"
        footer={null}
      >
        <div className="info-user">
          <div className="info-user-img">
            <img
              src={require("../../assets/images/user-icon_03.png")}
              alt="avatar"
            />
          </div>
          <div className="info-user-name">{userGetById.user_name}</div>
          {/* <div className="info-user-date">{userGetById.birth_day}</div> */}
        </div>

        <div className="modal-addfriend-footer">
          <Button
            onClick={handleCancel_modelAddFriend}
            className="modal-addfriend-footer-btn"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleOk_modelAddFriend}
            className="modal-addfriend-footer-btn"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </Modal>

      <Modal
        title="Thông tin cá nhân"
        open={modelAcountUser}
        //onOk={handleOk_modelAddFriend}
        onCancel={handleCancel_modelAcountUser}
        className="modal-modelAcountUser"
        footer={null}
      >
        <div className="info-user">
          <div className="info-user-img">
            <img
              src={require("../../assets/images/user-icon_03.png")}
              alt="avatar"
            />
          </div>
          <div className="info-user-name">{account.user_name}</div>
          {/* <div className="info-user-date">{userGetById.birth_day}</div> */}
        </div>
      </Modal>

      <Modal
        title="Cuộc gọi hình ảnh"
        open={receivingCall}
        onCancel={handleCancel_Call}
        footer={null}
        className="video-call"
        style={{ width: "200px" }}
      >
        <div>
          <div className="caller">
            <p>
              <center>Cuộc gọi</center>
            </p>
            <h5>
              <center>
                <b>{videoName}</b>
              </center>
            </h5>
            <Button
              type="primary"
              onClick={() => {
                const action = setVideoCallAccount({
                  senderId: account._id,
                  sender_name: account.user_name,
                  receiverId: videoData.senderId,
                  receiver_name: videoData.sender_name,
                  type: "receiver",
                });
                dispatch(action);
                setReceivingCall(false);
                const y =
                  window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
                const x =
                  window.top.outerWidth / 2 + window.top.screenX - 900 / 2;

                window.open(
                  "/video-call",
                  "",
                  `width=900,height=500,top=${y},left=${x}`
                );
              }}
            >
              Nhấc máy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HomePage;

function useAuth() {
  const account = useSelector((state) => state.account.account);
  return account._id !== "";
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth ? children : <Navigate to="/login" />;
}
