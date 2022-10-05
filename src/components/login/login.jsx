import { Form, Input, Checkbox, Button } from "antd";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login">
      <div className="login-layout">
        <p>Đăng nhập để bắt đầu với CHAT NOW</p>
        <Form
          name="login-form"
          className="login-form"
          method="post"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" className="login-form-btn">
              Đăng nhập
            </Button>
          </Form.Item>
          <span className="login-form-register">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </span>
        </Form>
      </div>
    </div>
  );
}

export default Login;
