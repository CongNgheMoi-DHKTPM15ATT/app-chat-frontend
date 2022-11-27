import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationAPI from "../../../api/conversationAPI";
import userAPI from "../../../api/userAPI";
import { CloseCircleOutlined } from "@ant-design/icons";
import { closeModalAddUserGroup } from "../../../slide/modalAddUserGroup";

function ModalAddUserGroup({ socket }) {
  const account = useSelector((state) => state.account.account);
  const chatAccount = useSelector((state) => state.chat.account);
  const [list_friend_group, setList_friend_group] = useState([]);
  const [list_friend, setList_friend] = useState([]);
  const [txt_search, setTxt_Search] = useState("");
  const modalAddUserGroup = useSelector(
    (state) => state.modalAddUserGroup.openModal
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(chatAccount);
  }, [chatAccount]);

  useEffect(() => {
    handleGetListSearch(txt_search);
  }, [list_friend_group]);

  useEffect(() => {
    console.log(list_friend);
  }, [list_friend]);

  const handleCancel_ModalAddUserGroup = () => {
    setTxt_Search("");
    setList_friend([]);
    setList_friend_group([]);
    dispatch(closeModalAddUserGroup());
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
        // console.log(chatAccount.member.findIndex((u) => u._id === user._id));
        if (
          list_friend_group.findIndex((u) => u.id === user._id) === -1 &&
          chatAccount.member.findIndex((u) => u._id === user._id) === -1
        )
          setList_friend((list_friend) => [user, ...list_friend]);
      });
    } catch (error) {
      console.log("Failed to call API get list search" + error);
    }
  };

  const handleAddMember = async () => {
    try {
      var tmp = [];
      list_friend_group.map((user) => {
        tmp.push(user.id);
      });
      const params = {
        user_control_id: account._id,
        conversation_id: chatAccount.conversation_id,
        user_id: tmp,
      };
      const response = await ConversationAPI.addMemberGroup(params);
      socket.emit("requestLoadConver", { user: tmp });
      handleCancel_ModalAddUserGroup();
    } catch (error) {
      console.log("fail when add member into group");
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
      title="Thêm thành viên"
      open={modalAddUserGroup}
      onCancel={handleCancel_ModalAddUserGroup}
      footer={[
        <Button key="back" onClick={handleCancel_ModalAddUserGroup}>
          Hủy
        </Button>,
        <Button
          key="submit"
          style={{ backgroundColor: "#468bff", color: "white" }}
          onClick={handleAddMember}
        >
          Thêm thành viên
        </Button>,
      ]}
    >
      <div className="create-group">
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
export default ModalAddUserGroup;
