import { Tooltip, Form, Input, Checkbox, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  CodeOutlined,
} from "@ant-design/icons";

function Register() {
  return (
    <div className="sign-up">
      <div className="sign-up-layout">
        <div className="sign-up-layout__left">
          <div className="sign-up-layout__left__background">
            <img
              src={require("../../assets/images/img-viec-nhom.jpg")}
              alt="register-img"
            />
          </div>
        </div>
        <Form
          name="register-form"
          className="sign-up-layout__right antd-form"
          // onFinish={(value) => handleRegister(value)}
        >
          <Form.Item>
            <h4>Đăng ký</h4>
          </Form.Item>
          {/* {_message !== "" ? (
                            <Form.Item>
                                <Alert
                                    message={_message}
                                    type="error"
                                    showIcon
                                />
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
                  message: "Tên đăng nhập không được để trống",
                },
              ]}
              noStyle
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                suffix={
                  <Tooltip
                    placement="bottomRight"
                    title="Tên đăng nhập phải có ít nhất 8 ký tự"
                  >
                    <InfoCircleOutlined className="site-form-item-icon" />
                  </Tooltip>
                }
                placeholder="Tên đăng nhập"
                type="text"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email không được để trống",
                },
              ]}
              noStyle
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                type="text"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item name="firstname" noStyle>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Họ và tên đệm"
                type="text"
              />
            </Form.Item>
            <Form.Item name="lastname" noStyle>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Tên của bạn"
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
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                suffix={
                  <Tooltip
                    placement="bottomRight"
                    title="Mật khẩu phải có ít nhất 8 ký tự gồm chữ cái và số"
                    style={{
                      fontSize: "5px",
                    }}
                  >
                    <InfoCircleOutlined className="site-form-item-icon" />
                  </Tooltip>
                }
                placeholder="Mật khẩu"
                type="password"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="repassword"
              rules={[
                {
                  required: true,
                  message: "Xác nhận mật khẩu không được để trống",
                },
              ]}
              noStyle
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Xác nhận mật khẩu"
                type="password"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="register-form-btn"
              // loading={_loading}
              // onClick={() => enterLoading()}
            >
              Đăng ký
            </Button>
            <span className="register-form-register">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </span>
          </Form.Item>
        </Form>
      </div>
      <div className="footer">
        {/* <div className="img-group">
                    <img
                        src={require("../../assets/image/logo_iuh.png").default}
                        alt="logo-footer"
                    />
                    <img
                        src={require("../../assets/image/logo_h32.png").default}
                        alt="logo-footer"
                    />
                    <img
                        src={
                            require("../../assets/image/logo_icpc.png").default
                        }
                        alt="logo-footer"
                    />
                </div> */}
      </div>
    </div>
  );
}

export default Register;
