import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { Link, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { io } from "socket.io-client";
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
import { async } from "@firebase/util";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const account = useSelector((state) => state.account.account);
  const modelLogout = useSelector((state) => state.modalLogout.openModal);
  const modelAddFriend = useSelector((state) => state.modelAddFriend.openModal);
  const modelAddFriend_user = useSelector(
    (state) => state.modelAddFriend.user.receiver_id
  );

  const [userGetById, setUserGetById] = useState("");
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);

  useEffect(() => {
    getUserById(modelAddFriend_user);
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
      user_id: receiver_id,
      receiver_id: user_id,
    };
    try {
      const response = await userAPI.sendFriendRequest(params);
      console.log(response);
    } catch (error) {
      console.log("Fail when call API sen request add friend: " + error);
    }
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
        title="Gửi yêu cầu trò chuyện"
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
