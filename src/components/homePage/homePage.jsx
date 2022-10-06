import { useEffect, useState } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import SideBar from "../sideBar/sidebar";

function HomePage() {
  let _countDown = new Date("Oct 10, 2022 12:30:00").getTime();

  const [_days, _setDays] = useState();
  const [_hours, _setHours] = useState();
  const [_minutes, _setMinutes] = useState();
  const [_seconds, _setSeconds] = useState();

  useEffect(() => {
    setInterval(function () {
      let now = new Date().getTime();
      let distance = _countDown - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      _setDays(days);
      _setHours(hours);
      _setMinutes(minutes);
      _setSeconds(seconds);
    });
  });

  return (
    <div className="homepage">
      <SideBar />
      {/* <h1>Báo cáo lần 1 App Chat Project</h1>
      <h2>
        <h4>
          {_days} ngày {_hours} giờ {_minutes} phút {_seconds} giây
        </h4>
      </h2>

      <Button className="btn btn-login">
        <Link to="/login"> Đăng nhập </Link>
      </Button>

      <Button className="btn btn-register">
        <Link to="/register">Đăng ký </Link>
      </Button> */}
    </div>
  );
}

export default HomePage;
