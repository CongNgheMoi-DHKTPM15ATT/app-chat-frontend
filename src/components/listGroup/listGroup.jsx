import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConversationAPI from "../../api/conversationAPI";
import messageAPI from "../../api/messageAPI";
import userAPI from "../../api/userAPI";

function ListGroup({ socket }) {
  const [chooseTab, setChooseTab] = useState(0);
  const account = useSelector((state) => state.account.account);
  const [list_group, setList_Group] = useState([]);

  useEffect(() => {
    handleGetAllGroup();
  }, []);

  useEffect(() => {
    console.log(list_group);
  }, [list_group]);

  const handleGetAllGroup = async () => {
    try {
      const params = {
        user_id: account._id,
      };
      const response = await ConversationAPI.getGroupConversationsById(params);
      setList_Group(response.conversations);
    } catch (error) {
      console.log("Fail when get all group in home page");
    }
  };

  function renderListGroup() {
    var list = [];
    list_group.map((gr, index) => {
      list.push(<GroupCard key={index} group={gr}></GroupCard>);
    });
    return list;
  }

  return (
    <div className="listGroup">
      <div className="listGroup-header">
        <div className="listGroup-header-info">
          <div className="listGroup-header-info-img">
            <img src={require("../../assets/images/people.png")} alt="avatar" />
          </div>
          <div className="listGroup-header-info-name">
            <p>Danh sách nhóm trò chuyện</p>
          </div>
        </div>
      </div>
      <div className="listGroup-center">
        <div className="listGroup-center-list">
          <Row gutter={[20, 24]} justify="space-evenly">
            {renderListGroup()}
          </Row>
        </div>
      </div>
    </div>
  );

  function GroupCard(props) {
    return (
      <Col>
        <div className="group-card">
          <div className="group-card-img">
            <img src={props.group.receiver.avatar} alt="avatar" />
          </div>
          <div className="group-card-center">
            <div className="group-card-center-name">
              <p>{props.group.receiver.nick_name}</p>
            </div>
          </div>
          <div className="group-card-button button-friend">
            <button className="btn-danger">Rời nhóm</button>
          </div>
        </div>
      </Col>
    );
  }
}

export default ListGroup;
