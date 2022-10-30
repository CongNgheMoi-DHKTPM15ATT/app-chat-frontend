import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChatAccount } from "../../../slide/chatSlide";
import { createConversations } from "../../../slide/conversationSlide";
import { closeModalLogout } from "../../../slide/modalSlide";
import { setAccount } from "../../../slide/userSlide";

function ModalLogOut() {
  const modelLogout = useSelector((state) => state.modalLogout.openModal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOk = () => {
    const action = setAccount({ _id: "" });
    dispatch(action);
    dispatch(
      setChatAccount({
        receiver_nick_name: "",
        user_nick_name: "",
        conversation_id: "",
        receiver_id: "",
      })
    );
    dispatch(createConversations([]));
    dispatch(closeModalLogout());
    navigate("/login");
  };

  const handleCancel = () => {
    console.log("cancel");
    dispatch(closeModalLogout());
  };

  return (
    <Modal
      title="Cảnh báo"
      open={modelLogout}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Đăng xuất
        </Button>,
      ]}
    >
      <p style={{ textAlign: "center", fontWeight: "500", fontSize: "1.2em" }}>
        Bạn muốn đăng xuất tài khoản trên thiết bị này !
      </p>
    </Modal>
  );
}

export default ModalLogOut;
