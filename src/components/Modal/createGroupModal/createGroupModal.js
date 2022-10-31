import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationAPI from "../../../api/conversationAPI";
import userAPI from "../../../api/userAPI";
import { closeModalCreateGroup } from "../../../slide/modalCreateGroup";
import { CloseCircleOutlined } from "@ant-design/icons";
function ModalCreateGroup({ socket }) {
  const account = useSelector((state) => state.account.account);
  const [list_friend_group, setList_friend_group] = useState([]);
  const [txt_name_group, setTxt_name_group] = useState("");
  const [list_friend, setList_friend] = useState([]);
  const [txt_search, setTxt_Search] = useState("");
  const modalCreateGroup = useSelector(
    (state) => state.modalCreateGroup.openModal
  );
  const dispatch = useDispatch();

  useEffect(() => {
    handleGetListSearch(txt_search);
  }, [list_friend_group]);

  const handleCancel_ModalCreateGroup = () => {
    setList_friend_group([]);
    dispatch(closeModalCreateGroup());
  };
  const createGroup = async () => {
    var tmp = [account._id];
    list_friend_group.map((user) => {
      tmp.push(user.id);
    });
    const params = { group_name: txt_name_group, user_id: tmp };
    console.log(params);

    try {
      const response = await ConversationAPI.createGroupConversation(params);
      socket.emit("addGroup", { senderId: account._id, groups: [response] });
      socket.emit("requestLoadConver", { user: tmp });
      handleCancel_ModalCreateGroup();
    } catch (error) {
      console.log("Fail when axios API get user by ID: " + error);
    }
  };

  const handleGetListSearch = async (text) => {
    try {
      const params = {
        user_id: account._id,
        filter: text,
      };
      const response = await userAPI.searchUser(params);
      setList_friend([]);
      response.map((user) => {
        console.log(list_friend_group.findIndex((u) => u.id === user._id));
        if (list_friend_group.findIndex((u) => u.id === user._id) === -1)
          setList_friend((list_friend) => [user, ...list_friend]);
      });
    } catch (error) {
      console.log("Failed to call API get list search" + error);
    }
  };

  function UserItem(props) {
    return (
      <div id={props.id} className="search-user-item">
        <div className="search-user-item-left">
          <img src={props.user.avatar} alt="avatar" />
        </div>
        <div className="search-user-item-center">
          <div className="search-user-item-name">{props.user.nick_name}</div>
        </div>

        <div className="search-user-item-right">
          <Button
            type="primary "
            className="btn-add-user"
            onClick={() => {
              setList_friend_group((list_friend_group) => [
                { id: props.user._id, name: props.user.nick_name },
                ...list_friend_group,
              ]);
            }}
          >
            Chọn
          </Button>
        </div>
      </div>
    );
  }

  function rederListUser() {
    var render_list_friend = [];
    if (list_friend.length == 0) {
      return (
        <p style={{ margin: "2vw", fontWeight: "500", textAlign: "center" }}>
          Không có người dùng tương thích với yêu cầu tìm kiếm
        </p>
      );
    }
    list_friend.map((user, index) => {
      if (user.status !== "BLOCK") {
        render_list_friend.push(
          <UserItem key={index} id={index} user={user}></UserItem>
        );
      }
    });
    return render_list_friend;
  }

  return (
    <Modal
      title="Tạo nhóm"
      open={modalCreateGroup}
      onCancel={handleCancel_ModalCreateGroup}
      footer={[
        <Button key="back" onClick={handleCancel_ModalCreateGroup}>
          Hủy
        </Button>,
        <Button
          key="submit"
          style={{ backgroundColor: "#468bff", color: "white" }}
          onClick={createGroup}
        >
          Tạo nhóm
        </Button>,
      ]}
    >
      <div className="create-group">
        <div className="create-group-name">
          <Input
            placeholder="Nhập tên nhóm"
            type="text"
            value={txt_name_group}
            onChange={(e) => {
              setTxt_name_group(e.target.value);
            }}
          ></Input>
        </div>
        <div className="create-group-add-friend">
          <p>Danh sách bạn bè vào nhóm</p>
          <div className="list-add">
            {list_friend_group.map((user, index) => (
              <div className="list-add-user" key={index}>
                {user.name}
                <div className="list-add-user-remove">
                  <CloseCircleOutlined
                    onClick={() => {
                      list_friend_group.splice(
                        list_friend_group.indexOf(list_friend_group[index]),
                        1
                      );
                      handleGetListSearch(txt_search);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p>Tìm kiếm bạn bè</p>
          <div className="search-user">
            <Form className="form-search">
              <Input
                placeholder="Tìm kiếm bạn bè"
                type="text"
                value={txt_search}
                onChange={(e) => {
                  setTxt_Search(e.target.value);
                  handleGetListSearch(e.target.value);
                }}
              />
            </Form>
            <div className="search-user-list">{rederListUser()}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default ModalCreateGroup;
