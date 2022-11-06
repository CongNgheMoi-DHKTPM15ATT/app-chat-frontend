import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Upload,
  Card,
  Typography,
  Collapse,
  List,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import InputEmoji from "react-input-emoji";
import {
  SendOutlined,
  PhoneTwoTone,
  VideoCameraTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  FileAddFilled,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "../chatItem/chatItem";
import messageAPI from "../../api/messageAPI";
import { useNavigate } from "react-router-dom";
import { setVideoCallAccount } from "../../slide/videoCallSlide";
import S3API from "../../api/s3API";
import { showModelAcountUser } from "../../slide/modelAcountSlide";
import { customDate } from "../../utils/customDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import audios from "../../assets/audio/audios";
import axios from "axios";
import { showModalAddUserGroup } from "../../slide/modalAddUserGroup";
import ConversationAPI from "../../api/conversationAPI";
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const actionReceiverRightBar = [
  {
    title: "Nhóm chung",
    icon: (
      <FontAwesomeIcon className="right-tab-action-icon" icon={faUserGroup} />
    ),
  },
];

function Chat({ socket }) {
  const account = useSelector((state) => state.account.account);
  const chatAcount = useSelector((state) => state.chat.account);
  const { _id } = account;
  const [value, setValue] = useState("");
  const [rightTab, setRightTab] = useState(false);
  const [_listMessage, _setListMessage] = useState([]);
  const [_listMessageImage, _setListMessageImage] = useState([]);
  const [pendingMess, setPendingMess] = useState(null);
  const content = useRef("");
  const ngay_trong_tuan = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const [__ListFileUpload, __SetListFileUpLoad] = useState([]);
  const dispatch = useDispatch();
  const audio_notification = new Audio(audios[1].src);

  //---- hàm lấy toàn bộ tin nhắn khi có sự thay dổi người nhận tin nhắn ----//
  useEffect(() => {
    getAllMess(chatAcount.conversation_id);
    if (rightTab) {
      getAllMessByContentType(chatAcount.conversation_id, "image");
    }
  }, [chatAcount]);

  useEffect(() => {
    socket.on("load_message", (data) => {
      getAllMess(data.conversation);
    });

    const load_mess = (data) => {
      console.log(data.conversation + " : " + chatAcount.conversation_id);
      if (chatAcount.conversation_id === data.conversation)
        getAllMess(data.conversation);
    };

    socket.on("load_message_receiver", load_mess);

    return () => socket.off("load_message_receiver", load_mess);
  }, [chatAcount, socket]);

  useEffect(() => {
    if (pendingMess) {
      if (
        chatAcount.receiver_id === pendingMess.mess.sender.user_id ||
        pendingMess.receiverId === chatAcount.receiver_id
      )
        _setListMessage((_listMessage) => [pendingMess.mess, ..._listMessage]);
    }
    setPendingMess(null);
  }, [pendingMess]);

  useEffect(() => {
    if (rightTab) {
      getAllMessByContentType(chatAcount.conversation_id, "image");
    }
  }, [rightTab]);

  //---- hàm nhận tin nhắn từ socket gửi đến ----//
  useEffect(() => {
    socket.on("getMessage", (data) => {
      const mess = createMess(
        data.text,
        data.content_type,
        false,
        data.senderId,
        data.nick_name,
        data.avatar,
        data._id
      );
      console.log(mess);
      if (chatAcount.receiver_id === mess.sender.user_id)
        audio_notification.play();
      setPendingMess({ receiverId: data.receiverId, mess: mess });
    });
  }, [socket]);

  //---- hàm gửi tin nhắn ----//
  const handleSendMessage = async (message) => {
    try {
      const params = {
        sender_id: _id,
        conversation_id: chatAcount.conversation_id,
        content_type: message.content_type,
        text: message.content,
      };
      const response = await messageAPI.sendMessage(params);
      message._id = response.data._id;
      socket.emit("send", {
        _id: response.data._id,
        senderId: _id,
        receiverId: chatAcount.receiver_id,
        nick_name: chatAcount.user_nick_name,
        text: message.content,
        content_type: message.content_type,
        avatar: message.sender.avatar,
      });
      _setListMessage((_listMessage) => [message, ..._listMessage]);
    } catch (error) {
      console.log("Failed to call API send message" + error);
    }
  };
  const handleOutGroup = async () => {
    try {
      const params = {
        conversation_id: chatAcount.conversation_id,
        user_id: account._id,
      };
      const mess = createMess(
        chatAcount.user_nick_name + "  đã rời khỏi nhóm",
        "notification",
        false,
        _id,
        chatAcount.user_nick_name,
        account.avatar,
        null
      );
      handleSendMessage(mess);
      const response = await ConversationAPI.outMemberGroup(params);
    } catch (error) {
      console.log("Failed to call API out group" + error);
    }
  };

  //---- hàm tạo 1 đối tượng tin nhắn ----//
  function createMess(
    content,
    content_type,
    deleted,
    user_id,
    name,
    avatar,
    id
  ) {
    const day_now = new Date();
    const mess = {
      _id: id,
      content: content,
      content_type: content_type,
      deleted: deleted,
      createdAt: day_now,
      sender: { avatar: avatar, user_id: user_id, nick_name: name },
    };
    return mess;
  }
  //---- hàm lấy toàn bộ tin nhắn ----//
  const getAllMess = async (conver_id) => {
    try {
      const params = {
        conversation_id: conver_id,
      };
      const response = await messageAPI.getAllMessage(params);
      console.log(response);
      _setListMessage(response.messages);
    } catch (error) {
      console.log("Failed to call API get all message " + error);
    }
  };

  const getAllMessByContentType = async (conver_id, type) => {
    try {
      const params = {
        conversation_id: conver_id,
        content_type: type,
      };
      _setListMessageImage([]);
      const response = await messageAPI.getAllMessageByContentType(params);
      if (response.length !== 0) {
        _setListMessageImage(response);
      }
    } catch (error) {
      console.log("Failed to call API get all message " + error);
    }
  };

  function renderLine(time) {
    const d = new Date(time);
    return (
      <div className="line">
        <p>
          {Math.abs(new Date() - new Date(time)) > 1000 * 60 * 60 * 24 * 7
            ? `${d.getHours()}:${d.getMinutes()} ${d.getDate()}Tháng${
                d.getMonth() + 1
              }, ${d.getFullYear()}`
            : `${
                ngay_trong_tuan[d.getDay()]
              } ${d.getHours()}:${d.getMinutes()}`}
        </p>
      </div>
    );
  }

  const renderListUserOfGroup = () => {
    const _listUser = [];
    if (chatAcount.member)
      chatAcount.member.map((user) => {
        _listUser.push(
          <div style={{ width: "100%", textAlign: "left", marginLeft: "10px" }}>
            {user.nick_name}
          </div>
        );
      });

    return _listUser;
  };

  const renderListMessImage = () => {
    const _listImg = [];
    const y = window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
    const x = window.top.outerWidth / 2 + window.top.screenX - 900 / 2;
    if (_listMessageImage.length !== 0) {
      _listMessageImage.map((mess) => {
        const list_file = mess.content.split("&%&");
        list_file.map((url, index) => {
          const type_file = url.split(".");
          if (
            type_file[type_file.length - 1] === "mp4" ||
            type_file[type_file.length - 1] === "mp3" ||
            type_file[type_file.length - 1] === "avi" ||
            type_file[type_file.length - 1] === "flv"
          )
            _listImg.push(
              <video
                className="right-tab-filter-img-video"
                controls
                onClick={() =>
                  window.open(
                    url,
                    "",
                    `width=900,height=500,top=${y},left=${x}`
                  )
                }
              >
                <source src={url} />
              </video>
            );
          else if (url)
            _listImg.push(
              <img
                className="right-tab-filter-img-video"
                key={index}
                src={url}
                alt="img"
                onClick={() =>
                  window.open(
                    url,
                    "",
                    `width=900,height=500,top=${y},left=${x}`
                  )
                }
              />
            );
        });
      });
      return _listImg;
    } else {
      return (
        <div style={{ textAlign: "center", width: "100%" }}>
          Hộp thoại thoại này chưa có hình ảnh/video
        </div>
      );
    }
  };

  //---- hàm render toàn bộ tin nhắn ----//
  const rederListMess = () => {
    const _ListMess = [];
    var loadImg = "";
    var check = true;
    var checkName = true;
    var befor_date = "";
    _listMessage.map((mess, index) => {
      const tmp = _listMessage[index + 1];
      if (tmp) {
        if (tmp.sender.user_id === mess.sender.user_id) checkName = false;
      }
      if (index === 0) {
        _ListMess.push(
          <ChatItem
            key={index}
            mess_id={mess._id}
            content={mess.content}
            senderId={mess.sender.user_id}
            senderName={mess.sender.nick_name}
            loadImg={check}
            loadName={checkName}
            createdAt={mess.createdAt}
            userID={_id}
            avatar={mess.sender.avatar}
            content_type={mess.content_type}
            is_group={chatAcount.is_group}
            socket={socket}
          />
        );
        loadImg = mess.sender.user_id;
      } else {
        if (
          Math.abs(
            new Date(befor_date).getDate() - new Date(mess.createdAt).getDate()
          ) > 0 ||
          Math.abs(new Date(befor_date) - new Date(mess.createdAt)) > 600000
        ) {
          _ListMess.push(renderLine(befor_date));
          check = true;
        }
        if (loadImg !== mess.sender.user_id) check = true;
        loadImg = mess.sender.user_id;
        _ListMess.push(
          <ChatItem
            key={index}
            mess_id={mess._id}
            content={mess.content}
            senderId={mess.sender.user_id}
            senderName={mess.sender.nick_name}
            loadImg={check}
            loadName={checkName}
            createdAt={mess.createdAt}
            userID={_id}
            content_type={mess.content_type}
            avatar={mess.sender.avatar}
            is_group={chatAcount.is_group}
            socket={socket}
          />
        );
      }
      checkName = true;
      check = false;
      befor_date = mess.createdAt;
    });
    return _ListMess;
  };

  const handleVideoCall = () => {
    const y = window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
    const x = window.top.outerWidth / 2 + window.top.screenX - 900 / 2;
    const action = setVideoCallAccount({
      senderId: _id,
      receiverId: chatAcount.receiver_id,
      sender_name: account.user_name,
      receiver_name: chatAcount.receiver_nick_name,
      type: "sender",
    });
    dispatch(action);

    window.open("/video-call", "", `width=900,height=500,top=${y},left=${x}`);
  };

  const openCloseRightTab = () => {
    setRightTab(!rightTab);
  };

  //---- hàm gửi tin nhắn ----//
  const handleEmitMessage = () => {
    const _text = value;
    setValue("");
    if (!(_text === "")) {
      const mess = createMess(
        _text,
        "text",
        false,
        _id,
        chatAcount.user_nick_name,
        account.avatar,
        null
      );
      handleSendMessage(mess);
    }
  };

  const handleUpLoadFile = async (e) => {
    const listFile_size = e.target.files.length;
    var imgUrl = "";
    for (var i = 0; i < listFile_size; i++) {
      const formData = new FormData();
      formData.append("img", e.target.files[i]);
      const response = await axios.put(
        "https://codejava-app-anime.herokuapp.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          mode: "no-cors",
        }
      );
      console.log(response.data.pathVideo);
      imgUrl += response.data.pathVideo + "&%&";
      if (listFile_size - 1 === i) {
        const mess = createMess(
          imgUrl,
          "image",
          false,
          _id,
          chatAcount.user_nick_name,
          account.avatar,
          null
        );
        console.log(mess);
        handleSendMessage(mess);
      }
    }
  };

  return (
    <div className="chat">
      <Row>
        <Col span={rightTab ? 18 : 24}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-info-img">
                <img
                  onClick={showModelAcountUser()}
                  src={chatAcount.avatar}
                  alt="avatar"
                />
              </div>
              <div className="chat-header-info-name">
                <p>{chatAcount.receiver_nick_name}</p>
              </div>
            </div>
            <div className="chat-header-toolbar">
              {chatAcount.is_group ? (
                <UserAddOutlined
                  className="chat-header-toolbar-icon"
                  onClick={() => {
                    dispatch(showModalAddUserGroup());
                  }}
                />
              ) : (
                <PhoneTwoTone className="chat-header-toolbar-icon" />
              )}
              {chatAcount.is_group ? null : (
                <VideoCameraTwoTone
                  className="chat-header-toolbar-icon"
                  onClick={handleVideoCall}
                />
              )}

              {rightTab ? (
                <MenuUnfoldOutlined
                  className="chat-header-toolbar-icon"
                  onClick={openCloseRightTab}
                />
              ) : (
                <MenuFoldOutlined
                  className="chat-header-toolbar-icon"
                  onClick={openCloseRightTab}
                />
              )}
            </div>
          </div>
          <div className="chat-center">
            <div className="chat-center-message">{rederListMess()}</div>
          </div>
          <div className="chat-footer">
            <Form className="chat-footer-input">
              <Form.Item className="chat-footer-input-form">
                <InputEmoji
                  className="text-area"
                  value={value}
                  ref={content}
                  onChange={setValue}
                  onEnter={handleEmitMessage}
                  placeholder="Nhập tin nhắn...."
                />
              </Form.Item>
              <Form.Item className="chat-footer-input-file">
                <label className="custom-file-upload">
                  <input
                    type="file"
                    name="file"
                    onChange={handleUpLoadFile}
                    multiple
                    style={{ display: "none" }}
                  />
                  <FileAddFilled className="toolbar-icon" />
                </label>
              </Form.Item>
              <Form.Item className="chat-footer-input-action">
                {value !== "" ? (
                  <Button className="action-icon" onClick={handleEmitMessage}>
                    {/* Gửi */}
                    <SendOutlined />
                  </Button>
                ) : (
                  <button className="action-icon" onClick={handleEmitMessage}>
                    <p>&#128077;</p>
                  </button>
                )}
              </Form.Item>
            </Form>
          </div>
        </Col>
        {rightTab ? (
          <Col span={6}>
            <div className="right-tab">
              <div className="right-tab-header">
                <p>Thông tin hội thoại</p>
              </div>

              <div className="right-tab-infor-img">
                <img src={chatAcount.avatar} alt="avatar" />
              </div>
              <div className="right-tab-user-name">
                {chatAcount.receiver_nick_name}
              </div>

              <div className="right-tab-line-divide"></div>

              {chatAcount.is_group ? (
                <Collapse defaultActiveKey={["0"]} bordered={false}>
                  <Panel
                    showArrow={true}
                    style={{ backgroundColor: "#FFFFFF" }}
                    header={<Title level={5}>Thành viên nhóm</Title>}
                    key="1"
                  >
                    <Row gutter={[0, 24]}>{renderListUserOfGroup()}</Row>
                  </Panel>
                </Collapse>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={actionReceiverRightBar}
                  renderItem={(item) => (
                    <List.Item
                      className="right-tab-ant-list-item"
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        justifyContent: "flex-start",
                      }}
                    >
                      {item.icon}
                      <Text style={{}}>{item.title}</Text>
                    </List.Item>
                  )}
                />
              )}

              <div
                style={{ marginTop: "0px" }}
                className="right-tab-line-divide"
              ></div>

              <Collapse defaultActiveKey={["1"]} bordered={false}>
                <Panel
                  showArrow={true}
                  style={{ backgroundColor: "#FFFFFF" }}
                  header={<Title level={5}>Ảnh / Video</Title>}
                  key="1"
                >
                  <Row
                    gutter={[0, 24]}
                    justify="space-evenly"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {renderListMessImage()}
                  </Row>
                </Panel>
              </Collapse>

              <div className="right-tab-line-divide"></div>

              <Collapse
                style={{ magrinBottom: "5px" }}
                defaultActiveKey={["0"]}
                bordered={false}
              >
                <Panel
                  showArrow={true}
                  style={{ backgroundColor: "#FFFFFF" }}
                  header={<Title level={5}>Files</Title>}
                  key="1"
                >
                  <Row gutter={[0, 24]}>
                    <div style={{ textAlign: "center", width: "100%" }}>
                      Chức năng đang hoàn thiện !!
                    </div>
                  </Row>
                </Panel>
              </Collapse>

              <div className="right-tab-line-divide"></div>

              <Collapse defaultActiveKey={["0"]} bordered={false}>
                <Panel
                  showArrow={true}
                  style={{ backgroundColor: "#FFFFFF" }}
                  header={<Title level={5}>Links</Title>}
                  key="1"
                >
                  <Row gutter={[0, 24]}>
                    <div style={{ textAlign: "center", width: "100%" }}>
                      Chức năng đang hoàn thiện !!
                    </div>
                  </Row>
                </Panel>
              </Collapse>

              <div className="right-tab-line-divide"></div>

              <Collapse defaultActiveKey={["0"]} bordered={false}>
                <Panel
                  showArrow={true}
                  style={{ backgroundColor: "#FFFFFF" }}
                  header={<Title level={5}>Tùy Chọn</Title>}
                  key="1"
                >
                  <Row gutter={[0, 24]}>
                    <div
                      style={{
                        margin: "10px",
                        textAlign: "center",
                        width: "100%",
                        border: "0.1px solid red",
                        color: "red",
                      }}
                      onClick={handleOutGroup}
                    >
                      Rời nhóm
                    </div>
                  </Row>
                </Panel>
              </Collapse>
            </div>
          </Col>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
}

export default Chat;
