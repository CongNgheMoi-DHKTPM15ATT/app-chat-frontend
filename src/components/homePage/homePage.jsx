import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { useSelector } from "react-redux";
import ListFriend from "../listFriend/listFriend";
import { io } from "socket.io-client";
import ModalLogOut from "../Modal/logoutModal/logoutModal";
import ModalInfoAccount from "../Modal/infoAccountModal/infoAccountModal";
import ModalInfoUser from "../Modal/infoUserModal/infoUserModal";
import ModalVideoCall from "../Modal/videoCallModal/videoCallModal";
import ModalUpdateInfoAccount from "../Modal/updateInfoAccount/updateInfoAccount";
import ModalCreateGroup from "../Modal/createGroupModal/createGroupModal";
import ConversationAPI from "../../api/conversationAPI";
import ModalAddUserGroup from "../Modal/addUserGroupModal/addUserGroupModal";
import ListGroup from "../listGroup/listGroup";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function HomePage() {
  const account = useSelector((state) => state.account.account);
  const [list_group, setList_Group] = useState([]);

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    handleGetAllGroup();
  }, []);

  useEffect(() => {
    //console.log(list_group);
    socket.emit("addGroup", { senderId: account._id, groups: list_group });
    socket.emit("addUser", { senderId: account._id });
  }, [list_group]);

  const handleGetAllGroup = async () => {
    try {
      const params = {
        user_id: account._id,
      };
      const response = await ConversationAPI.getGroupConversationsById(params);
      setList_Group(response.conversations);
    } catch (error) {
      console.log("Fail when get all group in home page");
    }
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
            path="/list-group"
            element={
              <PrivateRoute>
                <Col span={18}>
                  <ListGroup socket={socket} />
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
      <ModalInfoUser socket={socket} />
      <ModalVideoCall socket={socket} />
      <ModalUpdateInfoAccount />
      <ModalCreateGroup socket={socket} />
      <ModalAddUserGroup socket={socket} />
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
