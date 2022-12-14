import { Button, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { PhoneFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import Typical from "react-typical";
import audios from "../../assets/audio/audios";
import { setVideoCallAccount } from "../../slide/videoCallSlide";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function VideoCall() {
  const account = useSelector((state) => state.account.account);
  const videoCallAccount = useSelector((state) => state.videoCall.account);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const dispatch = useDispatch();

  const endCall = new Audio(audios[3].src);

  const startCall = new Audio(audios[0].src);
  startCall.loop = true;

  useEffect(() => {
    if (!socket) return;
    socket.on("connect_video_call", () => {
      socket.emit("connect_video_call");
    });
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
    console.log(videoCallAccount);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });
    if (videoCallAccount.type === "receiver")
      socket.emit("accept_video_call", videoCallAccount.receiverId);
    // else if (videoCallAccount.type === "sender") {
    //   const action = setVideoCallAccount({
    //     senderId: videoCallAccount.senderId,
    //     sender_name: videoCallAccount.user_name,
    //     receiverId: videoCallAccount.senderId,
    //     receiver_name: videoCallAccount.sender_name,
    //     type: "called",
    //   });
    //   dispatch(action);

    //   callUser();
    // }
  }, []);

  useEffect(() => {
    if (myVideo.current) myVideo.current.srcObject = stream;
  }, [stream]);

  const callUser = () => {
    setReceivingCall(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      console.log(data);
      socket.emit("callUser", {
        signalData: data,
        senderId: videoCallAccount.senderId,
        sender_name: videoCallAccount.sender_name,
        receiver_name: videoCallAccount.receiver_name,
        receiverId: videoCallAccount.receiverId,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      startCall.pause();
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
    startCall.play();
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    connectionRef.current.destroy();
    window.close();
  };

  return (
    <div className="container">
      <div className="video-container">
        {stream &&
          (!callAccepted ? (
            <div className=" video">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="play-receiver-video"
              />
            </div>
          ) : (
            <div className=" my-video">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="play-my-video"
              />
            </div>
          ))}

        {callAccepted && !callEnded ? (
          <div className="video">
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="play-receiver-video"
            />
          </div>
        ) : null}
      </div>
      {videoCallAccount.type !== "sender" ? null : !receivingCall ? (
        <div className="btn-call">
          <Button onClick={callUser}>B???t ?????u cu???c g???i</Button>
        </div>
      ) : null}
      {videoCallAccount.type !== "sender" ? null : !callAccepted &&
        receivingCall ? (
        <Loading />
      ) : null}

      {videoCallAccount.type !== "receiver" ? null : !callAccepted ? (
        <div className="btn-call">
          <Button onClick={answerCall}>Tham gia cu???c g???i</Button>
        </div>
      ) : null}

      <div className="tool-bar">
        {callAccepted ? (
          <Button className="icon-phone icon" onClick={leaveCall}>
            <PhoneFilled />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default VideoCall;

function Loading() {
  const typicalStyle = {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "500",
    color: "#33bcb7",
  };
  return (
    <div style={typicalStyle}>
      <Typical
        steps={["", 1000, "??ang k???t n???i...", 3000]}
        loop={Infinity}
        wrapper="p"
      />
    </div>
  );
}
