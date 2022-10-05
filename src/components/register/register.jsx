import { Form, Input, Checkbox, Button } from "antd";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="register">
      <div className="register-layout">
        <p>Đăng ký để bắt đầu với CHAT NOW</p>
        <Form
          name="register-form"
          className="register-form"
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
          <Form.Item
            label="Confirm password"
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "Please input  your confirm password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="register-form-btn">
              Đăng ký
            </Button>
          </Form.Item>
          <span className="register-form-login">
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </span>
        </Form>
      </div>
    </div>
  );
}

export default Register;
