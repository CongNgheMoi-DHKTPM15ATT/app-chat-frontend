import { Form, Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import userAPI from "../../api/userAPI";
import { useEffect } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (value) => {
    try {
      const params = {
        user_name: value.username,
        password: value.password,
      };
      const response = await userAPI.loginByUserName(params);
      console.log(response);
      navigate("/home");
    } catch (error) {
      console.log("Failed to call API login " + error);
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in-layout">
        <div className="sign-in-layout__left">
          <div className="sign-in-layout__left__background">
            <img
              src={require("../../assets/images/img_zalo.png")}
              alt="login-img"
            />
          </div>
        </div>
        <Form
          name="login-form"
          method="post"
          className="sign-in-layout__right antd-form"
          // initialValues={{
          //   _remember: true,
          // }}
          onFinish={(value) => handleLogin(value)}
        >
          <Form.Item>
            <h4>ĐĂNG NHẬP</h4>
          </Form.Item>
          {/* {_message !== "" ? (
            <Form.Item>
              <Alert message={_message} type="error" showIcon />
            </Form.Item>
          ) : (
            ""
          )} */}
          <Form.Item>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Tên tài khoản không được để trống",
                },
              ]}
              noStyle
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Tên đăng nhập"
                type="text"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu không được để trống",
                },
              ]}
              noStyle
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
                type="password"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="remember"
              // valuePropName={_remember}
              noStyle
            >
              <Checkbox
              // checked={_remember}
              // onChange={(e) => _setRemember(e.target.checked)}
              >
                Nhớ mật khẩu
              </Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="login-form-forgot">
              Quên mật khẩu?
            </Link>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="login-form-btn">
              Đăng nhập
            </Button>
            <span className="login-form-register">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </span>
          </Form.Item>
          <Form.Item>
            <div className="line"></div>
            Hoặc
            <div className="line"></div>
          </Form.Item>
          <Form.Item>
            <Button
              // onClick={() => handleLoginGoogle()}
              className="login-google-btn"
            >
              <img
                src={require("../../assets/images/google-icon.jpg")}
                className="login-google-icon"
                alt="login-google-icon"
              />
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default Login;
