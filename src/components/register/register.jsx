import { Tooltip, Form, Input, Checkbox, Button, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import userAPI from "../../api/userAPI";
import { authentication } from "../../app/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import { setAccount } from "../../slide/userSlide";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [otp, setOtp] = useState("");
  const [step, setStep] = useState("INPUT_PHONE_NUMBER");
  const [result, setResult] = useState("");
  const [messageOTP, setMessageOTP] = useState("");
  const [params, setParams] = useState("");
  const [status, setStatus] = useState(false);

  const showAlert = () => {
    Swal.fire({
      position: "top",
      width: 400,
      timerProgressBar: true,
      title: "Đăng ký tài khoản thành công",
      //text: "Đăng nhập thành công",
      showConfirmButton: false,
      icon: "success",
      timer: 2000,
    });
  };

  const handleLogin = async (value) => {
    try {
      const params = {
        phone: value.phone,
        password: value.password,
      };
      const response = await userAPI.loginByUserName(params);
      console.log(response);
      const action = setAccount(response.data);

      dispatch(action);

      showAlert();
      navigate("/home");
    } catch (error) {
      console.log("Failed to call API login " + error);
    }
  };

  useEffect(() => {
    if (status) {
      handleLogin(params);
    }
  }, [status]);

  const handleRegisterVerify = (value) => {
    if (value.auth_code === null) {
      setMessageOTP("Mã OTP không được để trống");
      return;
    } else if (value.auth_code.length !== 6) {
      setMessageOTP("Mã OTP có 6 kí tự");
      return;
    }
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(value.auth_code)
      .then(async (result) => {
        try {
          const response = await userAPI.RegisterByUserName(params);
          console.log(response);
          setStatus(true);
        } catch {
          console.log("Failed to call API Register");
        }
      })
      .catch((error) => {
        setMessageOTP("Mã OTP không chính xác: " + error);
      });
  };

  const generatrRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      },
      authentication
    );
  };
  const handleRegister = (value) => {
    if (value.phone === null) {
      setMessageOTP("Số điện thoại không được để trống");
      return;
    } else if (value.phone.length !== 10) {
      setMessageOTP("Số điện thoại có 10 kí tự");
      return;
    }
    const phone = "+84" + value.phone.substring(1, 10);
    generatrRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(authentication, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setParams({
          user_name: value.username,
          password: value.password,
          phone: value.phone,
          email: value.email,
        });
        setMessageOTP("");
        setStep("SEND-OTP");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        {step === "INPUT_PHONE_NUMBER" ? (
          <Form
            name="register-form"
            className="sign-up-layout__right antd-form"
            onFinish={(value) => handleRegister(value)}
          >
            <Form.Item>
              <h4>Đăng ký</h4>
            </Form.Item>
            {messageOTP !== "" ? (
              <Form.Item>
                <Alert message={messageOTP} type="error" showIcon />
              </Form.Item>
            ) : (
              ""
            )}
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
            {/* <Form.Item>
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
            </Form.Item> */}
            <Form.Item>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống",
                  },
                ]}
                noStyle
              >
                <Input
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="Số điện thoại"
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
        ) : (
          <Form
            name="register-verify-form"
            className="sign-up-layout__right antd-form"
            onFinish={(value) => handleRegisterVerify(value)}
          >
            <Form.Item>
              <h4>Xác nhận tài khoản</h4>
            </Form.Item>

            <Form.Item>
              <span>Nhập mã xác nhận đã được gửi đến điện thoại của bạn</span>
            </Form.Item>
            {messageOTP !== "" ? (
              <Form.Item>
                <Alert
                  message={messageOTP}
                  // type={_messageVerify.type}
                  showIcon
                />
              </Form.Item>
            ) : (
              ""
            )}
            <Form.Item>
              <Form.Item
                name="auth_code"
                rules={[
                  {
                    required: true,
                    message: "Mã xác nhận không được để trống",
                  },
                ]}
                noStyle
              >
                <Input
                  prefix={<CodeOutlined />}
                  placeholder="Nhập mã xác nhận"
                  type="text"
                />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="register-form-btn">
                Gửi mã
              </Button>
              {/* <span className="register-form-register">
                                Không nhận được mã?
                                <span onClick={() => handleSendToCode()}>
                                    {" "}
                                    Gửi lại {_counter > 0 && _counter}
                                </span>
                            </span> */}
            </Form.Item>
          </Form>
        )}
        <div id="recaptcha-container"></div>
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
