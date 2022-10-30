import { useEffect, useState } from "react";

import { Button, Col, Form, Input, Modal, Row, DatePicker } from "antd";

import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import ListFriend from "../listFriend/listFriend";
import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { customDate } from "../../utils/customDate";

import userAPI from "../../api/userAPI";
import { closeModalUpdateAccount } from "../../slide/modalUpdateAccountSlide";
import { io } from "socket.io-client";
import { closeModalCreateGroup } from "../../slide/modalCreateGroup";
import ConversationAPI from "../../api/conversationAPI";
import ModalLogOut from "../Modal/logoutModal/logoutModal";
import ModalInfoAccount from "../Modal/infoAccountModal/infoAccountModal";
import ModalInfoUser from "../Modal/infoUserModal/infoUserModal";
import ModalVideoCall from "../Modal/videoCallModal/videoCallModal";
import ModalUpdateInfoAccount from "../Modal/updateInfoAccount/updateInfoAccount";
import ModalCreateGroup from "../Modal/createGroupModal/createGroupModal";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const account = useSelector((state) => state.account.account);

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);

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

      <ModalLogOut />
      <ModalInfoAccount />
      <ModalInfoUser />
      <ModalVideoCall socket={socket} />
      <ModalUpdateInfoAccount />
      <ModalCreateGroup />
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
