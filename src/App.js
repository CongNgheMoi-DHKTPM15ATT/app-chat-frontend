import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./components/homePage/homePage";
import Loading from "./basicComponent/loading";
import { Button } from "antd";
import { useSelector } from "react-redux";

const Register = lazy(() => import("./components/register/register"));
const Login = lazy(() => import("./components/login/login"));

function App() {
  const account = useSelector((state) => state.account.account);
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          {account._id === "" ? (
            <Route path="/login" element={<Login />} />
          ) : (
            <Route path="/login" element={<Navigate replace to="/home" />} />
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
                <HomePage />
              </PrivateRoute>
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
