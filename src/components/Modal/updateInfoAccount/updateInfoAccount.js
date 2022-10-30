import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DatePicker, Form, Input, Modal } from "antd";
import moment from "moment";
import { customDate } from "../../../utils/customDate";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import { closeModalUpdateAccount } from "../../../slide/modalUpdateAccountSlide";
import { useDispatch, useSelector } from "react-redux";

function ModalUpdateInfoAccount() {
  const account = useSelector((state) => state.account.account);
  const modalUpdateAccount = useSelector(
    (state) => state.modalUpdateAccount.openModal
  );
  const dispatch = useDispatch();

  const handleCancel_modalUpdateAccount = () => {
    dispatch(closeModalUpdateAccount());
  };

  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={modalUpdateAccount}
      onCancel={handleCancel_modalUpdateAccount}
      className="modal-modalUpdateAccount"
      footer={null}
      style={{ overflow: "hidden" }}
    >
      <div className="info-update-user">
        <div className="info-update-user-img">
          <img src={account.avatar} alt="avatar" />
          <FontAwesomeIcon
            className="icon-camera"
            size="lg"
            icon={faCameraRetro}
          />
        </div>
        <Form
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item label="User Name">
            <Input value={account.user_name} />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={account.email} />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input value={account.phone} />
          </Form.Item>
          <Form.Item label="Sinh nhật">
            <DatePicker
              format={"DD/MM/YYYY"}
              defaultValue={moment(customDate(account.birth_day), "DD/MM/YYYY")}
            />
          </Form.Item>
          <div>
            <Button>Cập nhật thông tin</Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
export default ModalUpdateInfoAccount;
