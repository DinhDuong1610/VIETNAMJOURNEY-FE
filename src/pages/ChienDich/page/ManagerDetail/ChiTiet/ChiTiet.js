import classNames from "classnames/bind";
import style from "./ChiTiet.module.scss";
import axios from "axios";
import { useState, useEffect, useRef } from "react"; // Import useEffect
import { getCookie } from "../../../../../Cookie/getCookie";
import Modal from "react-modal";
import API_BASE_URL from "../../../../../config/configapi";
import { Timeline, ConfigProvider } from "antd";
import { Modal as AntdModal } from "antd";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; // Import CSS cho Geocoder

const cx = classNames.bind(style);

function ChiTiet({ campaign }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // State to keep track of volunteer status

  // Function to fetch the status from the API
  const fetchVolunteerStatus = async () => {
    const payload = {
      userId: getCookie("User_ID"), // Replace with dynamic user ID
      campaignId: campaign.id,
    };

    try {
      const response = await fetch(
        "http://localhost/bwd/VietNamJourney/Server/ChienDich/GetVolunteer.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data.status); // Set the status from API response
      } else {
        console.error("Failed to fetch volunteer status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect to call fetchVolunteerStatus on mount
  useEffect(() => {
    fetchVolunteerStatus();
  }, [campaign.id]);

  let MY_BANK = {
    BANK_ID: "MB",
    ACCOUNT_NO: "0979727604",
  };

  let link_qr = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=10000000&addInfo=Quyên góp quỹ chiến dịch FP${campaign.id}&accountName=TỔ CHỨC VIETNAM JOURNEY`;

  // State quản lý thông tin form
  const [formData, setFormData] = useState({
    senderName: "",
    amount: "",
  });

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [isVisible, setIsVisible] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State để quản lý modal
  const [showSuccessModalHistory, setShowSuccessModalHistory] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const toggleVisibility = () => {
    if (!isVisible) {
      fetchTransactionHistory();
    }
    setIsVisible(!isVisible);
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Cập nhật state để hiển thị QR code
    setShowQR(true);
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=e4mGsq58YbWsqYFIvfeutqud89CuN7-6Zka2Y9Wfi7w0-hew7IAJDxpsy9EWpj7OGFjYtJHlp_NiJEtqIXvo24w0gn0TKjsAm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHGmiWCNwSHgZ1q_skok2PqVzpAAKpwAmAlMZKCpEUBOWa60WJAGy9Sr3NxTdlSzLoUz1ZCzqCiy-unVfR6907llWsG3c7_bd9z9Jw9Md8uu&lib=MVFUzX_6n49ZAW6KvgD0y-3r7BlUAkecM"
      );
      const data = await response.json();
      if (!data.error) {
        setTransactionHistory(data.data);
        console.log(data.data);
        const lastPaid = data.data[data.data.length - 1];
        // Kiểm tra nếu giao dịch đã được thực hiện
        const isPaymentMade =
          lastPaid["Giá trị"] == formData.amount ? true : false;
        console.log(lastPaid["Giá trị"], formData.amount);
        console.log("isPaymentMade", isPaymentMade);
        if (isPaymentMade) {
          setShowQR(false); // Ẩn QR nếu thanh toán đã được thực hiện
          setFormData({
            senderName: "",
            amount: "",
          });
        }
      } else {
        console.error("Error fetching transaction history");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    let intervalId;
    let timeoutId;
    if (showQR) {
      // Gọi API ngay lập tức khi QR được hiển thị
      fetchTransactionHistory();
      // Thiết lập interval để gọi API mỗi giây
      intervalId = setInterval(fetchTransactionHistory, 1000);

      timeoutId = setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      }, 180000);
    }
    return () => {
      // Xóa interval khi component unmount hoặc khi showQR trở thành false
      if (intervalId) {
        clearInterval(intervalId);
        setShowSuccessModal(true);
        console.log("showSuccessModal", showSuccessModal);
      }
      // Xóa timeout khi component unmount hoặc khi showQR trở thành false
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showQR]);

  const viewHistory = () => {
    setShowSuccessModalHistory(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  const closeModalHistory = () => {
    setShowSuccessModalHistory(false);
  };

  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState({
    fullname: "",
    birth: "",
    phone: "",
    email: "",
    address: "",
    reason: "",
  });

  const showTab = (n) => {
    const x = document.getElementsByClassName(cx("step"));
    for (let i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    x[n].style.display = "block";

    if (n === 0) {
      document.getElementById(cx("prevBtn")).style.display = "none";
    } else {
      document.getElementById(cx("prevBtn")).style.display = "inline";
    }
    if (n === x.length - 1) {
      // document.getElementById(cx("nextBtn")).type = "submit";
      document.getElementById(cx("nextBtn")).innerHTML = "Đăng ký";
    } else {
      document.getElementById(cx("nextBtn")).innerHTML = "Tiếp theo";
      // document.getElementById(cx("nextBtn")).type = "button";
    }

    fixStepIndicator(n);
  };

  const nextPrev = (n) => {
    const x = document.getElementsByClassName(cx("step"));
    if (n === 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    setCurrentTab(currentTab + n);
    if (currentTab + n >= x.length) {
      // document.getElementById(cx("signUpForm")).submit();
      handleRegisterSubmit();
      return false;
    }
    showTab(currentTab + n);
  };

  const validateForm = () => {
    let valid = true;
    const x = document.getElementsByClassName(cx("step"));
    const y = x[currentTab].getElementsByTagName("input");
    const z = x[currentTab].getElementsByTagName("textarea");
    for (let i = 0; i < y.length; i++) {
      if (y[i].value === "") {
        y[i].className += ` ${cx("invalid")}`;
        valid = false;
      }
    }
    for (let i = 0; i < z.length; i++) {
      if (z[i].value === "") {
        z[i].className += ` ${cx("invalid")}`;
        valid = false;
      }
    }
    if (valid) {
      document.getElementsByClassName(cx("stepIndicator"))[
        currentTab
      ].className += ` ${cx("finish")}`;
    }
    return valid;
  };

  const fixStepIndicator = (n) => {
    const x = document.getElementsByClassName(cx("stepIndicator"));
    for (let i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(` ${cx("active")}`, "");
    }
    x[n].className += ` ${cx("active")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const handleRegisterSubmit = async () => {
    // e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", formValues.fullname);
    formData.append("birth", formValues.birth);
    formData.append("phone", formValues.phone);
    formData.append("email", formValues.email);
    formData.append("address", formValues.address);
    formData.append("reason", formValues.reason);
    formData.append("userId", getCookie("User_ID")); // Bạn cần lấy userId từ đâu đó
    formData.append("campaignId", campaign.id);
    formData.append("status", 1); // Bạn cần lấy status từ đâu đó

    // console.log formdata
    for (const pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/registerVolunteer`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("okkk");
      if (response.status === 201) {
        alert(response.data.message);
        closeRegisterModal();
        // Xử lý thành công
      } else {
        alert(response.data.error);
        // Xử lý lỗi
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const mapContainerRef = useRef(null);
  const [xLo, setXLo] = useState(108.2506521);
  const [yDo, setYDo] = useState(15.9752654);
  const [nameLo, setNameLo] = useState("Việt Hàn");

  const [open, setOpen] = useState(false);
  const showModal = (x, y, name) => {
    setXLo(x);
    setYDo(y);
    setNameLo(name);
    setOpen(true);
    console.log(xLo, yDo, nameLo);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/dinh1610/cm0jeiqxm005b01qydqacanqd",
        center: [xLo, yDo],
        zoom: 18,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      const Draw = require("@mapbox/mapbox-gl-draw");
      const draw = new Draw();
      map.addControl(draw);

      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([xLo, yDo])
        .setHTML(`<p>${nameLo}</p>`)
        .addTo(map);

      map.on("load", () => {
        map.resize();
      });

      return () => map.remove();
    }
  }, [open]);

  return (
    console.log("joined ", campaign.joined),
    (
      <div className={cx("ChiTiet")}>
        <div className={cx("row")}>
          <div
            className={cx(
              "col-xl-6",
              "col-lg-6",
              "col-md-6",
              "col-sm-12",
              "col-12",
              "left"
            )}
          >
            <hr />
            <div className={cx("title")}>Thời gian dự án</div>
            <ConfigProvider
              theme={{
                // token: {
                //   dotBg: "#001273",
                //   dotBorderWidth: 2,
                //   itemPaddingBottom: 20,
                //   tailWidth: 2,
                //   lineWidth: 3,
                //   lineColor: "blue",
                // },
                components: {
                  Timeline: {
                    lineWidth : 2.5,
                    lineColor : "#001273",
                    tailWidth : 5,
                    itemPaddingBottom : 0,
                    // dotBorderWidth : 2,
                  },
                },
              }}
            >
              <Timeline
                tailWidth={2}
                lineWidth={4}
                lineColor="blue"
                items={[
                  {
                    color: "#001273",
                    children: (
                      <>
                        <div className={cx("inner-title")}>
                          Giai đoạn ban đầu
                        </div>
                        <div className={cx("desc")}>
                          {campaign.timeline[0].value}
                        </div>
                      </>
                    ),
                  },
                  {
                    color: "#001273",
                    children: (
                      <>
                        <div className={cx("inner-title")}>Bắt đầu dự án</div>
                        <div className={cx("desc")}>
                          {campaign.timeline[1].value}
                        </div>
                      </>
                    ),
                  },
                  {
                    color: "#001273",
                    children: (
                      <>
                        <div className={cx("inner-title")}>Kết thúc dự án</div>
                        <div className={cx("desc")}>
                          {campaign.timeline[2].value}
                        </div>
                      </>
                    ),
                  },
                  {
                    color: "gray",
                    children: (
                      <>
                        <div className={cx("inner-title")}>Tổng kết dự án</div>
                        <div className={cx("desc")}>
                          {campaign.timeline[3].value}
                        </div>
                      </>
                    ),
                  },
                ]}
              />
            </ConfigProvider>
          </div>
          <div
            className={cx(
              "col-xl-6",
              "col-lg-6",
              "col-md-6",
              "col-sm-12",
              "col-12",
              "right"
            )}
          >
            <hr />
            <div className={cx("title")}>Đăng ký tham gia</div>
            <div className={cx("register")}>
              <div className={cx("desc")}>
                Số lượng TNV tham gia: {campaign.joined} 24 TNV
              </div>
              {/* {status === null && (
                <button className={cx("button")} onClick={handleRegisterClick}>
                  Đăng ký tham gia
                </button>
              )}
              {status === 0 && (
                <button
                  className={cx("button")}
                  onClick={handleRegisterClick}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng ký tham gia"}
                </button>
              )}
              {status === 1 && (
                <button className={cx("button")} disabled>
                  Đang chờ duyệt
                </button>
              )}
              {status === 2 && null} Button is hidden when status is 2 */}
            </div>
            <hr />
            <div className={cx("title")}>Địa điểm cụ thể</div>
            {/* <pre className={cx("desc")}>{campaign.location}</pre> */}
            {campaign.location.map((location, index) => (
              <div key={index} className={cx("form", "form-contact", "location")}>
                <button
                  type="button"
                  className={cx("location-button")}
                  onClick={() =>
                    showModal(location.x, location.y, location.name)
                  }
                >
                  <i class="fa-solid fa-location-dot"></i>
                </button>
                <span className={cx("location-desc")}>{location.name}</span>
              </div>
            ))}
            <AntdModal
              width={1000}
              // height={600}
              open={open}
              title="Bản đồ chiến dịch"
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
              // bodyStyle={{ padding: 0, height: "600px", width: "100%" }}
            >
              <div
                ref={mapContainerRef}
                style={{ height: "600px", width: "100%" }}
              />
            </AntdModal>
          </div>
        </div>

        <div className={cx("plan-row")}>
          <hr />
          <div className={cx("title")}>Kế hoạch chiến dịch</div>
          <pre className={cx("desc")}>
            <div dangerouslySetInnerHTML={{ __html: campaign.plan }} />
          </pre>
        </div>

        <div className={cx("line")}></div>
      </div>
    )
  );
}

export default ChiTiet;
