import CoGioiThieu from "./GioiThieu/GioiThieu.jsx";
import CoVeChungToi from "./VeChungToi/VeChungToi.jsx";
import CoThucTrang from "./ThucTrang/ThucTrang.jsx";
import ThucTrang2 from "./ThucTrang2/ThucTrang2.js";
import Chatbot from "../../component/Chatbot/Chatbot";
import classNames from "classnames/bind";
import style from "./TrangChu.module.scss";
import { useNavigate } from "react-router-dom";

import CoSuMenh1 from "./SuMenh1/SuMenh1.jsx";
import CoSuMenh2 from "./SuMenh2/SuMenh2.jsx";
import CoSuMenh3 from "./SuMenh3/SuMenh3.jsx";
import CoThongTinMoi from "./ThongTinMoi/ThongTinMoi.jsx";
import Footer from "../../component/Footer/Footer.js";
import { getCookie } from "../../Cookie/getCookie.js";

import { CustomerServiceOutlined, CommentOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { FloatButton, Switch } from "antd";
import "antd/dist/reset.css";

const cx = classNames.bind(style);

function TrangChu() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  const toggleChatbot = () => {
    window.kommunicate.displayKommunicateWidget(true);
    window.kommunicate.openWidgetPreview();

    function changeConversationTitle() {
      var iframe = document.getElementById("kommunicate-widget-iframe");
      if (iframe) {
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        var h4Tag = innerDoc.getElementById("mck-conversation-title");
        if (h4Tag) {
          h4Tag.textContent = "Đoạn trò chuyện";
        } else {
          setTimeout(changeConversationTitle, 100); // Try again after 100ms if h4 tag is not found
        }

        var buttonContainer = innerDoc.getElementById("mck-msg-new");
        if (buttonContainer) {
          buttonContainer.textContent = "Bắt đầu đoạn chat mới!";
        } else {
          setTimeout(changeConversationTitle, 100); // Try again after 100ms if button container is not found
        }

        var footerChatBot = innerDoc.querySelector(
          ".mck-running-on.notranslate.vis"
        );
        if (footerChatBot) {
          footerChatBot.style.display = "none";
        } else {
          setTimeout(changeConversationTitle, 100); // Try again after 100ms if button container is not found
        }
      } else {
        setTimeout(changeConversationTitle, 100); // Try again after 100ms if iframe is not found
      }
    }

    setTimeout(changeConversationTitle, 200);
  };

  useEffect(() => {
    if (!window.kommunicate) {
      (function (d, m) {
        var kommunicateSettings = {
          appId: "e76b18426ebf68b6f1407f321791adba",
          popupWidget: false,
          automaticChatOpenOnNavigation: false,
          voiceNote: true,
          oneTimeRating: true,

          onInit: function () {
            var events = {
              onMessageReceived: function (resp) {
                // console.log(resp);
                console.log(resp.message.message);
                if (
                  resp.message.message ===
                  "Miu sẽ đưa bạn đến trang Cộng Đồng nhé"
                ) {
                  navigate("/CongDong");
                } else if (
                  resp.message.message ===
                  "Miu sẽ đưa bạn đến phần chiến dịch nhé. Bạn chỉ cần chọn vào chiến dịch bạn muốn và đi đến phần quỹ của chiến dịch đó"
                ) {
                  navigate("/ChienDich");
                } else if (
                  resp.message.message ===
                  "Miu sẽ đưa bạn đến phần chiến dịch nhé. Bạn có thể lựa chọn tỉnh thành và xem các chiến dịch ở đây"
                ) {
                  navigate("/ChienDich");
                } else if (
                  resp.message.message ===
                  "Vâng Miu hiểu rồi. Hãy đến phần Email đến có thể liên hệ với Admin của tổ chức nhé"
                ) {
                  navigate("/Email");
                } else if (
                  resp.message.message ===
                  "Vâng. Miu sẽ đưa bạn đến phần trò chuyện"
                ) {
                  navigate("/Messenger?type=user&user_id=0");
                } else if (
                  resp.message.message ===
                  "Vâng. Miu sẽ đưa bạn đến trang cá nhân của bạn"
                ) {
                  navigate("/User?user_id=" + getCookie("User_ID"));
                } else if (
                  resp.message.message ===
                  "Vâng. Miu sẽ đưa bạn đến phần quỹ của Việt Nam Journey"
                ) {
                  navigate("/Quy");
                } else if (
                  resp.message.message ===
                  "Vâng ạ. Miu sẽ đưa bạn đến trang chủ ngay"
                ) {
                  navigate("/TrangChu");
                }
              },

              onChatWidgetClose: function (resp) {
                window.kommunicate.displayKommunicateWidget(false);
              },
            };
            window.kommunicate.displayKommunicateWidget(false);
            window.kommunicate.subscribeToEvents(events);
          },
        };
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    }
  }, []);

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
            <i
              class="fa-solid fa-comment-dots"
              style={{ color: "#8591ff" }}
            ></i>
          }
          badge={{
            count: 5,
            color: "red",
          }}
          onClick={() => navigate("/Messenger?type=user&user_id=0")}
        />
        {/* <FloatButton
          icon={
            <i class="fa-brands fa-twitch" style={{ color: "#00ae2e" }}></i>
          }
        /> */}

        <FloatButton
          icon={
            <i className="fa-brands fa-twitch" style={{ color: "#00ae2e" }}></i>
          }
          onClick={toggleChatbot}
        />
      </FloatButton.Group>

      {/* {showChatbot && <Chatbot />} Hiển thị Chatbot nếu showChatbot là true */}
    </div>
  );
}

export default TrangChu;
