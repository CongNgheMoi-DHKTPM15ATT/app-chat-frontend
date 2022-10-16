import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import ConversationAPI from "../../api/conversationAPI";
import { closeModalLogout } from "../../slide/modalSlide";
import { setAccount } from "../../slide/userSlide";
import { setChatAccount } from "../../slide/chatSlide";
import { createConversations } from "../../slide/conversationSlide";

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
        id: "",
        user_name: "",
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
          <SideBar />
        </Col>
        <Col span={18}>
          <Chat socket={socket} />
        </Col>
      </Row>

      <Modal
        title="Cảnh báo"
        open={modelLogout}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn muốn đăng xuất tài khoản trên thiết bị này !</p>
      </Modal>
    </div>
  );
}

export default HomePage;
