import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "antd";
import {
  Link,
  useNavigate,
  Routes,
  Route,
  Navigate,
  matchRoutes,
} from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { closeModalLogout } from "../../slide/modalSlide";
import { setAccount } from "../../slide/userSlide";
import { setChatAccount } from "../../slide/chatSlide";
import { createConversations } from "../../slide/conversationSlide";
import ListFriend from "../listFriend/listFriend";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const account = useSelector((state) => state.account.account);
  const modelLogout = useSelector((state) => state.modalLogout.openModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
