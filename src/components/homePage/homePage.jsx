import { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import { Link } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import ConversationAPI from "../../api/conversationAPI";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const account = useSelector((state) => state.account.account);
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);
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
    </div>
  );
}

export default HomePage;
