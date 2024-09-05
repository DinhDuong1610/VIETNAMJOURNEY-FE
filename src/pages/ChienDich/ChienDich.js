import OverView from "./components/OverView/OverView";
import classNames from "classnames/bind";
import style from "./chiendich.module.scss";
import CampaignIng from "./components/CampaignIng/CampaignIng";
import CampaignEd from "./components/CampaignEd/CampaignEd";
import CampaignWill from "./components/CampaignWill/CampaignWill";
import Contact from "./components/Contact/Contact";
import PageDetail from "./page/PageDetail/PageDetail";
import Footer from "../../component/Footer/Footer";
import { getCookie } from "../../Cookie/getCookie";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { CustomerServiceOutlined, CommentOutlined } from "@ant-design/icons";
import { FloatButton, Switch } from "antd";
import "antd/dist/reset.css";
import ButtonMini from "../../component/ButtonMini/ButtonMini";

const cx = classNames.bind(style);

function ChienDich() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const province = searchParams.get("province") || "Đà Nẵng";

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
    <div className={cx("container")}>
      <OverView province={province} />
      <CampaignIng province={province} />
      <CampaignWill province={province} />
      <CampaignEd province={province} />
      <Contact />

      <ButtonMini />
    </div>
  );
}

export default ChienDich;
