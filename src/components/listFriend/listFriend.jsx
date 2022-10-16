function ListFriend() {
  return (
    <div className="listFriend">
      <div className="listFriend-header">
        <div className="listFriend-header-info">
          <div className="listFriend-header-info-img">
            <img
              src={require("../../assets/images/add-friend-02.jpg")}
              alt="avatar"
            />
          </div>
          <div className="listFriend-header-info-name">
            <p>Danh sách bạn bè</p>
          </div>
        </div>
      </div>
      <div className="listFriend-center"></div>
    </div>
  );
}

export default ListFriend;
