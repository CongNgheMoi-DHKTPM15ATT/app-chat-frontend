import { useEffect, useRef, useState } from "react";

import { Button, Col, Form, Input, Modal, Row, Card, Typography, Collapse, List, Popover, DatePicker } from "antd";

import { Link, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../sideBar/sidebar";
import Chat from "../chat/chat";
import { useSelector, useDispatch } from "react-redux";
import { closeModalLogout } from "../../slide/modalSlide";
import { setAccount } from "../../slide/userSlide";
import { setChatAccount } from "../../slide/chatSlide";
import { createConversations } from "../../slide/conversationSlide";
import ListFriend from "../listFriend/listFriend";
import moment from 'moment';

import { PhoneFilled, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

import { customDate } from "../../utils/customDate";
import {
  addUser,
  closeModelAddFriend,
  showModelAddFriend,
} from "../../slide/modalAddFriendSlide";
import userAPI from "../../api/userAPI";
import { closeModelAcountUser } from "../../slide/modelAcountSlide";
import { closeModalUpdateAccount, showModalUpdateAccount } from "../../slide/modalUpdateAccountSlide";
import { setVideoCallAccount } from "../../slide/videoCallSlide";
import { io } from "socket.io-client";
import audios from "../../assets/audio/audios";
import { closeModalCreateGroup } from "../../slide/modalCreateGroup";
import ConversationAPI from "../../api/conversationAPI";
// import sound_videoCall from "./audio_zalo.mp3";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

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

  const modalUpdateAccount = useSelector(
    (state) => state.modalUpdateAccount.openModal
  );

  const modelLogout = useSelector((state) => state.modalLogout.openModal);
  const modelAddFriend = useSelector((state) => state.modelAddFriend.openModal);
  const modelAddFriend_user = useSelector(
    (state) => state.modelAddFriend.user.receiver_id
  );
  const [userGetById, setUserGetById] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [list_friend, setList_friend] = useState([]);
  const [list_friend_group, setList_friend_group] = useState([]);
  const [txt_search, setTxt_Search] = useState("");
  const [txt_name_group, setTxt_name_group] = useState("");
  const [videoName, setVideoName] = useState("");
  const [audio, setAudio] = useState(new Audio(audios[2].src));
  const audioRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetListSearch(txt_search);
  }, [list_friend_group]);

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
  }, [modelAddFriend_user]);

  const getUserById = async (id) => {
    const params = { _id: id };

    try {
      const response = await userAPI.getUserbyId(params);
      setUserGetById(response);
    } catch (error) {
      console.log("Fail when axios API get user by ID: " + error);
    }
  };

  const createGroup = async () => {
    var tmp = [account._id];
    list_friend_group.map((user) => {
      tmp.push(user.id);
    });
    const params = { group_name: txt_name_group, user_id: tmp };
    console.log(params);

    try {
      const response = await ConversationAPI.createGroupConversation(params);
      setList_friend_group([]);
      dispatch(closeModalCreateGroup());
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
    setList_friend_group([]);
    dispatch(closeModalCreateGroup());
  };

  const handleCancel_modelAcountUser = () => {
    dispatch(closeModelAcountUser());
  };

  const handleCancel_modalUpdateAccount = () => {
    dispatch(closeModalUpdateAccount());
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


  const handleGetListSearch = async (text) => {
    try {
      const params = {
        user_id: account._id,
        filter: text,
      };
      const response = await userAPI.searchUser(params);
      setList_friend([]);
      response.map((user) => {
        console.log(list_friend_group.findIndex((u) => u.id === user._id));
        if (list_friend_group.findIndex((u) => u.id === user._id) === -1)
          setList_friend((list_friend) => [user, ...list_friend]);
      });
    } catch (error) {
      console.log("Failed to call API get list search" + error);
    }
  };

  function UserItem(props) {
    return (
      <div id={props.id} className="search-user-item">
        <div className="search-user-item-left">
          <img src={props.user.avatar} alt="avatar" />
        </div>
        <div className="search-user-item-center">
          <div className="search-user-item-name">{props.user.nick_name}</div>
        </div>

        <div className="search-user-item-right">
          <Button
            type="primary "
            className="btn-add-user"
            onClick={() => {
              setList_friend_group((list_friend_group) => [
                { id: props.user._id, name: props.user.nick_name },
                ...list_friend_group,
              ]);
            }}
          >
            Chọn
          </Button>
        </div>
      </div>
    );
  }

  function rederListUser() {
    var render_list_friend = [];
    if (list_friend.length == 0) {
      return (
        <p style={{ margin: "2vw", fontWeight: "500", textAlign: "center" }}>
          Không có người dùng tương thích với yêu cầu tìm kiếm
        </p>
      );
    }
    list_friend.map((user, index) => {
      if (user.status !== "BLOCK") {
        render_list_friend.push(
          <UserItem key={index} id={index} user={user}></UserItem>
        );
      }
    });
    return render_list_friend;
  }

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
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel_ModalCreateGroup}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Đăng xuất
          </Button>,
        ]}
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
        style={{overflow: "hidden",}}
      >
        <div className="info-user">
          <div className="info-user-img">
            <img src={account.avatar} alt="avatar" />
          </div>
          <div className="info-user-name">{account.user_name}</div>

          
          <Card 

            title="Thông tin cá nhân" 
            bordered={false}>
            <Row gutter={[16,10]}>
              <Col span={12}>
                <div><Text strong>Phone</Text></div>
              </Col>
              <Col span={12}>
                <div><Text>{account.phone}</Text></div>
              </Col>

              <Col span={12}>
                <div><Text strong>Birthday</Text></div>
              </Col>
              <Col span={12}>
                <div><Text>{customDate(account.birth_day)}</Text></div>
              </Col>
            </Row>

          </Card>
          <div style={{width: '100%', height: "50px"}}></div>
          <Button onClick={()=> {dispatch(closeModelAcountUser()) ;dispatch(showModalUpdateAccount()); }} size='small' type="primary">
            <EditOutlined />Cập nhật thông tin
          </Button>
        </div>
      </Modal>

      <Modal
        title="Cập nhật thông tin cá nhân"
        open={modalUpdateAccount}
        //onOk={handleOk_modelAddFriend}
        onCancel={handleCancel_modalUpdateAccount}
        className="modal-modalUpdateAccount"
        footer={null}
        style={{overflow: "hidden",}}
      >
        <div className="info-update-user">
          <div className="info-update-user-img">
            <img
              src={account.avatar}
              alt="avatar"
              />
            < FontAwesomeIcon className = "icon-camera" size="lg" icon = { faCameraRetro }/>
          </div>
          <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label="User Name">
              <Input value={account.user_name}/>
            </Form.Item>
            <Form.Item label="Email">
              <Input value={account.email}/>
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input value={account.phone}/>
            </Form.Item>
            <Form.Item label="Sinh nhật">
              <DatePicker format={'DD/MM/YYYY'} defaultValue={moment(customDate(account.birth_day), 'DD/MM/YYYY')}/>
            </Form.Item>
            <div>
              <Button>Cập nhật thông tin</Button>
            </div>
              

          </Form>
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
        footer={[
          <Button key="back" onClick={handleCancel_ModalCreateGroup}>
            Hủy
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "#468bff", color: "white" }}
            onClick={createGroup}
          >
            Tạo nhóm
          </Button>,
        ]}
      >
        <div className="create-group">
          <div className="create-group-name">
            <Input
              placeholder="Nhập tên nhóm"
              type="text"
              value={txt_name_group}
              onChange={(e) => {
                setTxt_name_group(e.target.value);
              }}
            ></Input>
          </div>
          <div className="create-group-add-friend">
            <p>Danh sách bạn bè vào nhóm</p>
            <div className="list-add">
              {list_friend_group.map((user, index) => (
                <div className="list-add-user" key={index}>
                  {user.name}
                </div>
              ))}
            </div>
            <p>Tìm kiếm bạn bè</p>
            <div className="search-user">
              <Form className="form-search">
                <Input
                  placeholder="Tìm kiếm bạn bè"
                  type="text"
                  value={txt_search}
                  onChange={(e) => {
                    setTxt_Search(e.target.value);
                    handleGetListSearch(e.target.value);
                  }}
                />
              </Form>
              <div className="search-user-list">{rederListUser()}</div>
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
