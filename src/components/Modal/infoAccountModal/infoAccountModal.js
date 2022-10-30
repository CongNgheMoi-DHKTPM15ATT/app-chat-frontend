import { Button, Card, Col, Modal, Row, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { closeModelAcountUser } from "../../../slide/modelAcountSlide";
import { showModalUpdateAccount } from "../../../slide/modalUpdateAccountSlide";
import { useDispatch, useSelector } from "react-redux";
import { customDate } from "../../../utils/customDate";

const { Text } = Typography;

function ModalInfoAccount() {
  const account = useSelector((state) => state.account.account);
  const dispatch = useDispatch();
  const modelAcountUser = useSelector(
    (state) => state.modelAcountUser.openModal
  );

  const handleCancel_modelAcountUser = () => {
    dispatch(closeModelAcountUser());
  };

  return (
    <Modal
      title="Thông tin cá nhân"
      open={modelAcountUser}
      onCancel={handleCancel_modelAcountUser}
      className="modal-modelAcountUser"
      footer={null}
      style={{ overflow: "hidden" }}
    >
      <div className="info-user">
        <div className="info-user-img">
          <img src={account.avatar} alt="avatar" />
        </div>
        <div className="info-user-name">{account.user_name}</div>

        <Card title="Thông tin cá nhân" bordered={false}>
          <Row gutter={[16, 10]}>
            <Col span={12}>
              <div>
                <Text strong>Phone</Text>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text>{account.phone}</Text>
              </div>
            </Col>

            <Col span={12}>
              <div>
                <Text strong>Birthday</Text>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text>{customDate(account.birth_day)}</Text>
              </div>
            </Col>
          </Row>
        </Card>
        <div style={{ width: "100%", height: "50px" }}></div>
        <Button
          onClick={() => {
            dispatch(closeModelAcountUser());
            dispatch(showModalUpdateAccount());
          }}
          size="small"
          type="primary"
        >
          <EditOutlined />
          Cập nhật thông tin
        </Button>
      </div>
    </Modal>
  );
}

export default ModalInfoAccount;
