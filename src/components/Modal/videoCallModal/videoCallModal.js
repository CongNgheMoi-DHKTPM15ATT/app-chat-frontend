import { Button, Modal } from "antd";
import { PhoneFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setVideoCallAccount } from "../../../slide/videoCallSlide";
import audios from "../../../assets/audio/audios";

function ModalVideoCall({ socket }) {
  const account = useSelector((state) => state.account.account);
  const [receivingCall, setReceivingCall] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [audio, setAudio] = useState(new Audio(audios[2].src));
  const dispatch = useDispatch();
  audio.loop = true;

  useEffect(() => {
    socket.on("request_video_call", (data) => {
      audio.play();
      setReceivingCall(true);
      setVideoName(data.sender_name);
      setVideoData(data);
    });
  }, [socket]);

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

  return (
    <Modal
      open={receivingCall}
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
  );
}

export default ModalVideoCall;
