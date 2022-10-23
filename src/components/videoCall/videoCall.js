import { Button, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { PhoneFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

function VideoCall({ socket }) {
  const account = useSelector((state) => state.account.account);
  const videoCallAccount = useSelector((state) => state.videoCall.account);
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });
    const data = {
      senderId: account._id,
      sender_name: videoCallAccount.sender_name,
      receiver_name: videoCallAccount.receiver_name,
      receiverId: videoCallAccount.receiverId,
    };
    if (videoCallAccount.type === "sender") {
      socket.emit("request_video_call", data);
      socket.on("connect_video_call", callUser);
    } else if (videoCallAccount.type === "receiver") {
      socket.emit("accept_video_call", data);
      socket.on("callUser", (data) => {
        setName(data.sender_name);
        setCallerSignal(data.signal);
      });
    }
  }, []);

  useEffect(() => {
    if (myVideo.current) myVideo.current.srcObject = stream;
  }, [stream]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", data);
    });
    socket.on("callAccepted", (signal) => peer.signal(signal));
    peer.on("stream", (stream) => (userVideo.current.srcObject = stream));
    connectionRef.current = peer;
    setCallAccepted(true);
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("stream", (stream) => (userVideo.current.srcObject = stream));
    peer.on("signal", (data) => socket.emit("answerCall", data));
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    connectionRef.current.destroy();
  };

  return (
    <>
      <div className="container">
        <div className="video-container">
          <div className=" my-video">
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className="play-my-video"
              />
            )}
          </div>
          <div className="video">
            {/* {callAccepted && !callEnded ? ( */}
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="play-receiver-video"
            />
            {/* ) : null} */}
          </div>
        </div>
        <div className="tool-bar">
          {callAccepted ? (
            <PhoneFilled
              className="icon icon-phone "
              onClick={() => window.close()}
            />
          ) : (
            <PhoneFilled
              className="icon icon-phone-active "
              onClick={answerCall}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default VideoCall;
