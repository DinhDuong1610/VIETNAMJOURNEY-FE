import classNames from "classnames/bind";
import style from "./TongQuan.module.scss";
import CountUp from "react-countup";
import { ColorFactory } from "antd/es/color-picker/color";
import { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/configapi";
import axios from "axios";
import img_la from '../../../Images/TrangChu/TongQuan/img_la.png';

const cx = classNames.bind(style);

function TongQuan() {
  const [users, setUsers] = useState(0);
  const [campaigns, setCampaigns] = useState(0);
  const [fun, setFun] = useState(0);

  useEffect(() => {
    const fetchFunData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home`);
        setUsers(response.data.users);
        setCampaigns(response.data.campaigns);
        setFun(response.data.fun);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchFunData();
  }, []);

  return (
    <div className={cx("TongQuan")}>
      <div className={cx("title")}>
        Chào mừng đến với <span>Việt Nam Journey</span>
      </div>

      <div className={cx("row")}>
        <div className={cx("left")}>
          <div className={cx("image")}>
            {/* <img src="https://s3-alpha-sig.figma.com/img/be11/6881/5ac44640651f24b18bd98c4323cb8bed?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JcD4DsCcQVBXmfjc0EhzkrLcVV8LiOgt65wF749UXfK4U0SCjkVk7HuaII7fZ3ceLjNwM~s39l2AidSNBHtaJyJ5eGqE48aSrovwQzOWRRlyW2L9n4dfKd1HG3pOSVdwetTKMCCtTtg5x0SS32BKQRZZLHEJPPjLIbOyP8SFsGU0vf~okgX~nouZRdZDe0krbEf6egi-P~pw8ljbHwpXReOXHQ9hGNGd~MNbo5XZ1nzjID80BNIFNxP8fNoWvO3tIrOYA6298Rfzi00lqJ8po1Sz1WBioW-ZtGBgKyxMI1lYZd8U3Awu6roKCSswIwKDrGKhtk4FLy4Vu61bC79EEA__"></img> */}
            <img src="https://bcp.cdnchinhphu.vn/Uploaded/hoangtrongdien/2019_07_18/IMG-6376-copy-1427769072_660x0.jpg"></img>
          </div>
        </div>

        <div className={cx("right")}>
          <img src={img_la}></img>
          <p>
            <span>Việt Nam Journey</span> là dự án tình nguyện và gây quỹ đặc
            biệt, tập trung vào việc bảo vệ môi trường và phát triển bền vững
            tại Việt Nam.{" "}
          </p>
          <p>
            Chúng tôi kết hợp giữa lòng nhiệt huyết của các tình nguyện viên và
            sự hỗ trợ tài chính từ cộng đồng để thực hiện các dự án môi trường
            có ảnh hưởng lâu dài.
          </p>
        </div>
      </div>
      <div className={cx("row")}>
        <div className={cx("left")}>
          {/* <div className={cx("image-left")}>
            <img src="https://s3-alpha-sig.figma.com/img/a974/a031/4d9075ca2b0f89e80abddeb0c03868b2?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TkxMLItS3PmOLQEP5I91FsUkRL~jkyvDOMvhfF~BHKrI4slaDsWGOX3xDPGp1v2mSqkDattfJiuL8L8hBFIwnxcriqJF4uv7GXgNwKkr4BFAY0U3C1eJSPMhhAm97yuA5GryG6Vmzk2cCjWSVhzktkBj3sRiM5xhxLUTDJXThEm4vOdRtmig-V8aLHBbFw7TtnYfpRzKF2d8IsGBbzhCZm1Humz4IiE2a7Iby2OQpnBioTQwChT0cthBIAtpTVBfAf7fD0cVknHEJgP9~SfwTLm1hDreyb1g~wscONAx8fVrDX4e33NoANb6JaTRX8tdJcVNp9-NFVoI5pooO5bfBw__"></img>
          </div> */}
          <p>
            <span>Việt Nam Journey</span> được thành lập với mục tiêu bảo vệ và
            cải thiện môi trường sống, đồng thời nâng cao nhận thức cộng đồng về
            tầm quan trọng của việc bảo vệ thiên nhiên.{" "}
          </p>
          <p>
            Chúng tôi tin rằng mỗi hành động nhỏ của chúng ta đều có thể tạo ra
            sự khác biệt lớn, và cùng nhau, chúng ta có thể xây dựng một tương
            lai xanh hơn và bền vững hơn.
          </p>
        </div>
        <div className={cx("right", "number")}>
          <div classNames={cx("item-quy")}>
            <div className={cx("quy-title")}>
              Tổng số tiền quỹ dự án Việt Nam Jorney
            </div>
            <div classNames={cx("number")}>
              <CountUp
                end={fun}
                duration={1}
                formattingFn={(value) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
              />
            </div>

            <div
              className={cx("progress")}
              role="progressbar"
              aria-label="Success striped example"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ border: "0.5px solid #C6E3C4" }}
            >
              <div
                className={cx(
                  "progress-bar",
                  "progress-bar-striped",
                  "bg-success"
                )}
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          <div className={cx("number-bottom")}>
            <div className={cx("item")}>
              <div className={cx("item-number")}>{users}</div>
              <div className={cx("item-title")}>Tài khoản thành viên</div>
            </div>
            <div className={cx("item")}>
              <div className={cx("item-number")}>43</div>
              <div className={cx("item-title")}>Tỉnh / thành phố</div>
            </div>
            <div className={cx("item")}>
              <div className={cx("item-number")}>{campaigns}</div>
              <div className={cx("item-title")}>Chiến dịch hành động</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TongQuan;
