import { useEffect, useState } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";

function HomePage({ socket }) {
  return (
    <div className="homepage">
      <SideBar />
      <Chat socket={socket} />
    </div>
  );
}

export default HomePage;
