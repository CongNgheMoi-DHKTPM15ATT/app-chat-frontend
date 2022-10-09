import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./components/homePage/homePage";
import Loading from "./basicComponent/loading";
import { Button } from "antd";
import { io } from "socket.io-client";

const Register = lazy(() => import("./components/register/register"));
const Login = lazy(() => import("./components/login/login"));
const socket = io("https://halo-chat.herokuapp.com");
function App() {
  useEffect(() => {
    socket.emit("addUser", { senderId: "634255ff21fbe65180fa2f07" });
  }, []);
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage socket={socket} />} />
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
