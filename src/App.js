import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./components/homePage/homePage";
import Loading from "./basicComponent/loading"
import { Button } from "antd";

const Register = lazy(() => import("./components/register/register"));
const Login = lazy(() => import("./components/login/login"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loading />} >
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={
        <div>
            <center>
                <br/>
                <h3>Lỗi 404</h3>
                <br/>
                <h5>Bạn đang truy cập vào đường dẫn không tồn tại</h5>
                <br/>
                <Link to="/home"><Button>Quay lại trang chủ</Button></Link>
            </center>
        </div>}/>
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
