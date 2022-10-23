import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./components/homePage/homePage";
import Loading from "./basicComponent/loading";
import { Button } from "antd";
import { useSelector } from "react-redux";
import VideoCall from "./components/videoCall/videoCall";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);
const Register = lazy(() => import("./components/register/register"));
const Login = lazy(() => import("./components/login/login"));

function App() {
  const account = useSelector((state) => state.account.account);

  //---- hàm kết nối với socket ----//
  useEffect(() => {
    socket.emit("addUser", { senderId: account._id });
  }, []);

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          {account._id === "" ? (
            <Route path="/login" element={<Login />} />
          ) : (
            <Route path="/login" element={<Navigate replace to="/home" />} />
          )}
          {account._id === "" ? (
            <Route path="/register" element={<Register />} />
          ) : (
            <Route path="/register" element={<Navigate replace to="/home" />} />
          )}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate replace to="/home" />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Navigate replace to="/home/message" />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home/*"
            element={
              <PrivateRoute>
                <HomePage socket={socket} />
              </PrivateRoute>
            }
          />
          <Route
            path="/video-call/*"
            element={
              <VideoCallRoute>
                <VideoCall socket={socket} />
              </VideoCallRoute>
            }
          />
          <Route
            path="*"
            element={
              <div>
                <center>
                  <br />
                  <h3>Lỗi 404</h3>
                  <br />
                  <h5>Bạn đang truy cập vào đường dẫn không tồn tại</h5>
                  <br />
                  <Link to="/home">
                    <Button>Quay lại trang chủ</Button>
                  </Link>
                </center>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

function useAuth() {
  const account = useSelector((state) => state.account.account);
  return account._id !== "";
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  return auth ? children : <Navigate to="/login" />;
}

function VideoCallRoute({ children }) {
  const auth = useAuth();
  const videoCall_account = useSelector((state) => state.videoCall.account);
  return auth ? (
    videoCall_account.receiver_id === "" ? (
      <Navigate to="/home" />
    ) : (
      children
    )
  ) : (
    <Navigate to="/login" />
  );
}
