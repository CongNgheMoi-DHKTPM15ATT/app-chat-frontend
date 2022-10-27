import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Card } from "antd";
import { Link, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import { closeModalLogout } from "../../slide/modalSlide";
import { setAccount } from "../../slide/userSlide";
import { setChatAccount } from "../../slide/chatSlide";
import { createConversations } from "../../slide/conversationSlide";
import ListFriend from "../listFriend/listFriend";
import { PhoneFilled } from "@ant-design/icons";

import {
  addUser,
  closeModelAddFriend,
  showModelAddFriend,
} from "../../slide/modalAddFriendSlide";
import userAPI from "../../api/userAPI";
import { closeModelAcountUser } from "../../slide/modelAcountSlide";
import { setVideoCallAccount } from "../../slide/videoCallSlide";
import { io } from "socket.io-client";
import audios from "../../assets/audio/audios";
import { closeModalCreateGroup } from "../../slide/modalCreateGroup";
// import sound_videoCall from "./audio_zalo.mp3";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const [receivingCall, setReceivingCall] = useState(false);
  const account = useSelector((state) => state.account.account);
  const modalCreateGroup = useSelector(
    (state) => state.modalCreateGroup.openModal
  );
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
  const [audio, setAudio] = useState(new Audio(audios[2].src));
  const audioRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
    audio.loop = true;
  }, []);

  useEffect(() => {
    socket.on("request_video_call", (data) => {
      audio.play();
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

  const handle_VideoCall = () => {
    const action = setVideoCallAccount({
      senderId: account._id,
      sender_name: account.user_name,
      receiverId: videoData.senderId,
      receiver_name: videoData.sender_name,
      type: "receiver",
    });
    dispatch(action);
    setReceivingCall(false);
    const y = window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
    const x = window.top.outerWidth / 2 + window.top.screenX - 900 / 2;
    audio.pause();
    window.open("/video-call", "", `width=900,height=500,top=${y},left=${x}`);
  };

  const handleCancel_Call = () => {
    setReceivingCall(false);
  };

  const handleCancel_ModalCreateGroup = () => {
    dispatch(closeModalCreateGroup());
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
            <img src={userGetById.avatar} alt="avatar" />
          </div>
          <div className="info-user-name">{userGetById.user_name}</div>
          <Card title="Card title">
            <div className="info-user-date">{userGetById.birth_day}</div>
          </Card>
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
            <img src={account.avatar} alt="avatar" />
          </div>
          <div className="info-user-name">{account.user_name}</div>
          <div className="info-user-label">phone</div>
          <Card title="Thông tin cá nhân" bordered={false}>
            <Row gutter={16}>
              <Col span={8}>
                <div className="">{account.phone}</div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}></Col>
              <Col span={14}>
                <div className="info-user-phone">{account.phone}</div>
              </Col>
            </Row>

            <div className="info-user-birthday">{account.birth_day}</div>
          </Card>
        </div>
      </Modal>

      <Modal
        //title="Cuộc gọi hình ảnh"
        open={receivingCall}
        // open={true}
        footer={null}
        header={null}
        className="video-call"
        width={400}
        style={{ borderRadius: "50px" }}
      >
        <div>
          <div className="caller">
            <p
              style={{
                textAlign: "center",
              }}
            >
              Cuộc gọi đến
            </p>
            <h5
              style={{
                textAlign: "center",
              }}
            >
              <b>{videoName}</b>
              {/* <b>Nguyễn Hải Nam</b> */}
            </h5>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={account.avatar}
                alt="avatar"
                style={{
                  width: "50%",
                }}
              />
            </div>
            <div
              className="video-call-toolbar"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              <Button
                type="primary"
                onClick={handleCancel_Call}
                style={{
                  backgroundColor: "red",
                  marginRight: "20px",
                }}
              >
                <PhoneFilled />
              </Button>

              <Button
                type="primary"
                onClick={handle_VideoCall}
                style={{
                  backgroundColor: "green",
                  marginLeft: "20px",
                }}
              >
                <PhoneFilled />
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Tạo nhóm"
        open={modalCreateGroup}
        //onOk={handleOk_modelAddFriend}
        onCancel={handleCancel_ModalCreateGroup}
        footer={null}
      >
        <div className="create-group">
          <div className="create-group-name">
            <Input placeholder="Nhập tên nhóm"></Input>
          </div>
          <div className="create-group-add-friend">
            <p>Danh sách bạn bè vào nhóm</p>
            <div className="list-add"></div>
            <p>Tìm kiếm bạn bè</p>
            <div className="search-user">
              <Input placeholder="Tìm kiếm bạn bè"></Input>
            </div>
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
