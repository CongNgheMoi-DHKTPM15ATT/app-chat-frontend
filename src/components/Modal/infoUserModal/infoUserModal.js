import { Button, Card, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userAPI from "../../../api/userAPI";
import {
  addUser,
  closeModelAddFriend,
} from "../../../slide/modalAddFriendSlide";

function ModalInfoUser() {
  const account = useSelector((state) => state.account.account);
  const modelAddFriend = useSelector((state) => state.modelAddFriend.openModal);
  const modelAddFriend_user = useSelector(
    (state) => state.modelAddFriend.user.receiver_id
  );
  const dispatch = useDispatch();
  const [userGetById, setUserGetById] = useState("");

  const sendRequestAddFriend = async (user_id, receiver_id) => {
    const params = {
      user_id: user_id,
      receiver_id: receiver_id,
    };
    try {
      const response = await userAPI.sendFriendRequest(params);
      console.log(response);
    } catch (error) {
      console.log("Fail when call API sen request add friend: " + error);
    }
  };

  useEffect(() => {
    getUserById(modelAddFriend_user);
  }, [modelAddFriend_user]);

  const getUserById = async (id) => {
    const params = { _id: id };

    try {
      const response = await userAPI.getUserbyId(params);
      setUserGetById(response);
    } catch (error) {
      console.log("Fail when axios API get user by ID: " + error);
    }
  };

  const handleOk_modelAddFriend = () => {
    sendRequestAddFriend(account._id, modelAddFriend_user);
    dispatch(closeModelAddFriend());
    dispatch(addUser({ receiver_id: "" }));
  };
  const handleCancel_modelAddFriend = () => {
    dispatch(closeModelAddFriend());
    dispatch(addUser({ receiver_id: "" }));
  };

  return (
    <Modal
      title="Thông tin người dùng"
      open={modelAddFriend}
      onCancel={handleCancel_modelAddFriend}
      className="modal-addfriend"
      footer={null}
    >
      <div className="info-user">
        <div className="info-user-img">
          <img src={userGetById.avatar} alt="avatar" />
        </div>
        <div className="info-user-name">{userGetById.user_name}</div>

        <Card title="Card title">
          <div className="info-user-date">{userGetById.birth_day}</div>
        </Card>
      </div>

      <div className="modal-addfriend-footer">
        <Button
          onClick={handleCancel_modelAddFriend}
          className="modal-addfriend-footer-btn"
        >
          Hủy
        </Button>
        <Button
          type="primary"
          onClick={handleOk_modelAddFriend}
          className="modal-addfriend-footer-btn"
        >
          Gửi yêu cầu
        </Button>
      </div>
    </Modal>
  );
}

export default ModalInfoUser;
