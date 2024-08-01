import CoGioiThieu from "./GioiThieu/GioiThieu.jsx";
import CoVeChungToi from "./VeChungToi/VeChungToi.jsx";
import CoThucTrang from "./ThucTrang/ThucTrang.jsx";
import ThucTrang2 from "./ThucTrang2/ThucTrang2.js";
import classNames from "classnames/bind";
import style from "./TrangChu.module.scss";
import { useNavigate } from "react-router-dom";

// import CoThucTrangVideo from "./ThucTrangVideo/ThucTrangVideo.jsx";

import CoSuMenh1 from "./SuMenh1/SuMenh1.jsx";
import CoSuMenh2 from "./SuMenh2/SuMenh2.jsx";
import CoSuMenh3 from "./SuMenh3/SuMenh3.jsx";
import CoThongTinMoi from "./ThongTinMoi/ThongTinMoi.jsx";
import Footer from "../../component/Footer/Footer.js";

import { CustomerServiceOutlined, CommentOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FloatButton, Switch } from "antd";
import "antd/dist/reset.css";

const cx = classNames.bind(style);

function TrangChu() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className="Trangchu">
      <CoGioiThieu />

      <CoVeChungToi />
      <CoThucTrang />

      <ThucTrang2 />

      {/* <CoThucTrangVideo /> */}

      <CoSuMenh1 />
      <CoSuMenh2 />
      <CoSuMenh3 />

      <CoThongTinMoi />

      <Footer />

      <FloatButton.Group
        open={open}
        trigger="click"
        onClick={handleClick}
        style={{
          insetInlineEnd: 30,
        }}
        icon={
          <i
            class="fa-solid fa-earth-americas"
            style={{ color: "#00ae2e" }}
          ></i>
        }
        badge={{
            count: 17,
            color: "red",
        }}
      >
        <FloatButton
          icon={
            <i class="fa-solid fa-envelope" style={{ color: "#48d4ff" }}></i>
          }
          badge={{
            count: 12,
            color: "red",
          }}
          onClick={() => navigate("/Email")} 
        />
        <FloatButton
          icon={
            <i class="fa-solid fa-comment-dots" style={{ color: "#8591ff" }} ></i>
          }
          badge={{
            count: 5,
            color: "red",
          }}
          onClick={() => navigate("/Messenger?type=user&user_id=0")} 
        />
        <FloatButton
          icon={
            <i class="fa-brands fa-twitch" style={{ color: "#00ae2e" }}></i>
          }
        />
      </FloatButton.Group>
    </div>
  );
}

export default TrangChu;
