import { useEffect, useState } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://localhost:8080");
function HomePage() {
  const account = useSelector((state) => state.account.account);
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);
  return (
    <div className="homepage">
      <SideBar />
      <Chat socket={socket} />
    </div>
  );
}

export default HomePage;
