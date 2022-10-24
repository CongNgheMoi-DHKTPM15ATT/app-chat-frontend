import { Button, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { PhoneFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);

function VideoCall() {
  // const account = useSelector((state) => state.account.account);
  const videoCallAccount = useSelector((state) => state.videoCall.account);
  // const [stream, setStream] = useState();
  // const [receivingCall, setReceivingCall] = useState(false);
  // const [caller, setCaller] = useState("");
  // const [callerSignal, setCallerSignal] = useState();
  // const [callAccepted, setCallAccepted] = useState(false);
  // const [idToCall, setIdToCall] = useState("");
  // const [callEnded, setCallEnded] = useState(false);
  // const [name, setName] = useState("");
  // const dispatch = useDispatch();
  // const myVideo = useRef();
  // const userVideo = useRef();
  // const connectionRef = useRef();

  // useEffect(() => {
  // socket.emit("addUser", { senderId: account._id });
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       setStream(stream);
  // });

  //   const data = {
  //     senderId: account._id,
  //     sender_name: videoCallAccount.sender_name,
  //     receiver_name: videoCallAccount.receiver_name,
  //     receiverId: videoCallAccount.receiverId,
  //   };
  //   if (videoCallAccount.type === "sender")
  //     socket.emit("request_video_call", data);
  //   else if (videoCallAccount.type === "receiver")
  //     socket.emit("accept_video_call", data);
  // }, []);

  // useEffect(() => {
  //   if (myVideo.current) myVideo.current.srcObject = stream;
  // }, [stream]);

  // useEffect(() => {
  //   socket.on("connect_video_call", callUser);
  //   socket.on("callUser", (data) => {
  //     setName(data.sender_name);
  //     setCallerSignal(data.signal);
  //   });
  // }, [socket]);

  // const callUser = () => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", data);
  //   });
  //   socket.on("callAccepted", (signal) => {
  //     console.log(signal);
  //     peer.signal(signal);
  //   });
  //   connectionRef.current = peer;
  //   setCallAccepted(true);
  //   peer.on("stream", (stream) => (userVideo.current.srcObject = stream));
  // };

  // const answerCall = () => {
  //   setCallAccepted(true);
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", (data) => {
  //     socket.emit("answerCall", data);
  //     console.log(data);
  //   });
  //   peer.signal(callerSignal);
  //   connectionRef.current = peer;
  //   peer.on("stream", (stream) => {
  //     userVideo.current.srcObject = stream;
  //     console.log(stream);
  //   });
  // };

  // // const leaveCall = () => {
  // //   connectionRef.current.destroy();
  // // };

  // return (
  //   <>
  //     <div className="container">
  //       <div className="video-container">
  //         <div className=" my-video">
  //           {stream && (
  //             <video
  //               playsInline
  //               muted
  //               ref={myVideo}
  //               autoPlay
  //               className="play-my-video"
  //             />
  //           )}
  //         </div>
  //         <div className="video">
  //           {/* {callAccepted && !callEnded ? ( */}
  //           <video
  //             playsInline
  //             ref={userVideo}
  //             autoPlay
  //             className="play-receiver-video"
  //           />
  //           {/* ) : null} */}
  //         </div>
  //       </div>
  //       <div className="tool-bar">
  //         {callAccepted ? (
  //           <PhoneFilled
  //             className="icon icon-phone "
  //             onClick={() => window.close()}
  //           />
  //         ) : (
  //           <PhoneFilled
  //             className="icon icon-phone-active "
  //             onClick={answerCall}
  //           />
  //         )}
  //       </div>
  //     </div>
  //   </>
  // );

  const [receiver, setReceiver] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // useEffect(() => {

  // }, [socket]);

  useEffect(() => {
    console.log(videoCallAccount);
    console.log("-- step 1");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });

    console.log("Có tín hiện");
    socket.on("connect_video_call", () => {
      console.log("chaaps nhaanj");
    });

    socket.on("callUser", (data) => {
      console.log(data);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    if (videoCallAccount.type === "receiver") {
      console.log("-- step 3");
      socket.emit("accept_video_call", videoCallAccount.receiverId);
    }
  }, []);

  useEffect(() => {
    if (myVideo.current) myVideo.current.srcObject = stream;
  }, [stream]);

  const callUser = (id) => {
    console.log("-- step 5");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        signalData: data,
        senderId: videoCallAccount.senderId,
        sender_name: videoCallAccount.sender_name,
        receiver_name: videoCallAccount.receiver_name,
        receiverId: videoCallAccount.receiverId,
      });
    });
    peer.on("stream", (stream) => {
      console.log("-- step 7");
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      console.log("-- step 8");
      setCallAccepted(true);
      peer.signal(signal);
    });
    console.log("-- step 9");
    connectionRef.current = peer;
  };

  const answerCall = () => {
    console.log("-- step 10");
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      console.log("-- step 11");
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      console.log("-- step 12");
      userVideo.current.srcObject = stream;
    });

    console.log("-- step 13");
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // const leaveCall = () => {
  //   console.log("-- step 14");
  //   setCallEnded(true);
  //   connectionRef.current.destroy();
  // };

  return (
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
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="play-receiver-video"
            />
          ) : null}
        </div>
      </div>
      <div className="myId">
        <Input
          id="filled-basic"
          label="ID to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
        />
      </div>
      <div className="tool-bar">
        {receivingCall ? (
          <Button variant="contained" color="primary" onClick={answerCall}>
            <PhoneFilled />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => callUser(idToCall)}
          >
            Gọi
          </Button>
        )}
      </div>
    </div>
  );
}

export default VideoCall;
