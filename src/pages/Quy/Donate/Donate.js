import classNames from "classnames/bind";
import style from "./Donate.module.scss";

import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/configapi";

// import {  Button, Input, Space, Table  } from "antd";
// import Highlighter from 'react-highlight-words';
// import {  SearchOutlined  } from "@ant-design/icons";
import Table from "react-bootstrap/Table";

import support1 from "../../../Images/Quy/Donate/support1.png";
import support2 from "../../../Images/Quy/Donate/support2.png";
import support3 from "../../../Images/Quy/Donate/support3.png";

const cx = classNames.bind(style);

function CoDonate() {
  let MY_BANK = {
    BANK_ID: "MB",
    ACCOUNT_NO: "0979727604",
  };

  // State quản lý thông tin form
  const [formData, setFormData] = useState({
    senderName: "",
    amount: "0",
  });

  const [formValues, setFormValues] = useState({
    fullname: "",
    birth: "",
    phone: "",
    email: "",
    address: "",
    reason: "",
  });

  // State quản lý bước hiện tại
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTab, setCurrentTab] = useState(0);

  // // Hàm xử lý thay đổi input
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [isVisible, setIsVisible] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State để quản lý modal
  const [showSuccessModalHistory, setShowSuccessModalHistory] = useState(false);

  // Hàm xử lý khi gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTab === 2) {
      setShowQR(true);
      setFormData({
        senderName: formValues.fullname,
        amount: formData.amount,
      });
    }
  };

  const nextPrev = (n) => {
    const newTab = currentTab + n;
    if (!validateForm()) return false;
    if (newTab >= 0 && newTab < 3) {
      setCurrentTab(newTab);
    }
    if (currentTab === 2) {
      setShowQR(true);
      setFormData({
        senderName: formValues.fullname,
        amount: formData.amount,
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const x = document.getElementsByClassName(cx("step"));
    const y = x[currentTab].getElementsByTagName("input");
    const z = x[currentTab].getElementsByTagName("textarea");

    // Xóa class invalid từ tất cả các input và textarea
    for (let i = 0; i < y.length; i++) {
      y[i].classList.remove(cx("invalid"));
    }
    for (let i = 0; i < z.length; i++) {
      z[i].classList.remove(cx("invalid"));
    }

    // Kiểm tra các trường input
    for (let i = 0; i < y.length; i++) {
      if (y[i].className.includes(cx("input-donate"))) {
        continue;
      }
      if (y[i].value === "") {
        y[i].className += ` ${cx("invalid")}`;
        valid = false;
      }
    }

    // Kiểm tra các trường textarea
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

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=e4mGsq58YbWsqYFIvfeutqud89CuN7-6Zka2Y9Wfi7w0-hew7IAJDxpsy9EWpj7OGFjYtJHlp_NiJEtqIXvo24w0gn0TKjsAm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHGmiWCNwSHgZ1q_skok2PqVzpAAKpwAmAlMZKCpEUBOWa60WJAGy9Sr3NxTdlSzLoUz1ZCzqCiy-unVfR6907llWsG3c7_bd9z9Jw9Md8uu&lib=MVFUzX_6n49ZAW6KvgD0y-3r7BlUAkecM"
      );
      const data = await response.json();
      if (!data.error) {
        setTransactionHistory(data.data);
        const lastPaid = data.data[data.data.length - 1];
        // Kiểm tra nếu giao dịch đã được thực hiện
        const isPaymentMade = lastPaid["Giá trị"] == formData.amount;
        if (isPaymentMade) {
          setShowQR(false); // Ẩn QR nếu thanh toán đã được thực hiện
          setFormData({
            senderName: "",
            amount: "",
          });
          setShowSuccessModal(true); // Hiển thị modal thông báo thành công
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

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleDonateButtonClick = (amount) => {
    setFormData((prevData) => ({
      ...prevData,
      amount: amount,
    }));
    document.querySelector(`.${cx("money-donate")}`).value =
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
  };

  const handleDonateInputChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      amount: value,
    }));
    if (value) {
      document.querySelector(`.${cx("money-donate")}`).value =
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
    } else {
      document.querySelector(`.${cx("money-donate")}`).value = "";
    }
  };

  fetchTransactionHistory();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };






  const [funData, setFunData] = useState([]);

  useEffect(() => {
    // Hàm gọi API để lấy dữ liệu
    const fetchFunData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/getFun`);
        setFunData(response.data.funs);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchFunData();
  }, []);

  function maskPhoneNumber(phone) {
    return phone.slice(0, -4).replace(/\d/g, '* ') + phone.slice(-4);
}




  return (
    <div className={cx("main")}>
      <div className={cx("top")}>
        <h2>Bắt đầu hành trình của bạn với chúng tôi</h2>
        <p>
          Quỹ VIETNAM JOURNEY cam kết sử dụng toàn bộ số tiền vào các dự án có
          mục tiêu môi trường.
          <br />
          Đồng thời cam kết theo dõi và báo cáo thường xuyên về hiệu quả môi
          trường của các dự án mà chúng tôi hỗ trợ.
        </p>
      </div>

      <div className={cx("donate")}>
        {/* <button className={cx("button-history")} onClick={viewHistory}>
          <i className="fa-solid fa-eye"></i> Lịch sử quyên góp
        </button> */}
        <div className={cx("row", "quy")}>
          <form id={cx("signUpForm")} className={cx("transfer-form")}>
            <div className={cx("form-header", "d-flex", "mb-4")}>
              <span
                className={cx("stepIndicator", { active: currentTab === 0 })}
              >
                Quyên góp
              </span>
              <span
                className={cx("stepIndicator", { active: currentTab === 1 })}
              >
                Thông tin cá nhân
              </span>
              <span
                className={cx("stepIndicator", { active: currentTab === 2 })}
              >
                Cam kết
              </span>
            </div>
            <div
              className={cx("step")}
              style={{ display: currentTab === 0 ? "block" : "none" }}
            >
              <p className={cx("text-center", "mb-4", "title")}>
                Nhập số tiền quyên góp
              </p>
              <div className={cx("row")}>
                <div className={cx("col-4")}>
                  <button
                    type="button"
                    className={cx("btn-donate")}
                    onClick={() => handleDonateButtonClick(100000)}
                  >
                    100K
                  </button>
                </div>
                <div className={cx("col-4")}>
                  <button
                    type="button"
                    className={cx("btn-donate")}
                    onClick={() => handleDonateButtonClick(200000)}
                  >
                    200K
                  </button>
                </div>
                <div className={cx("col-4")}>
                  <button
                    type="button"
                    className={cx("btn-donate")}
                    onClick={() => handleDonateButtonClick(500000)}
                  >
                    500K
                  </button>
                </div>
                <div className={cx("col-4")}>
                  <button
                    type="button"
                    className={cx("btn-donate")}
                    onClick={() => handleDonateButtonClick(1000000)}
                  >
                    1M
                  </button>
                </div>
                <div className={cx("col-4")}>
                  <button
                    type="button"
                    className={cx("btn-donate")}
                    onClick={() => handleDonateButtonClick(2000000)}
                  >
                    2M
                  </button>
                </div>
                <div className={cx("col-4", "mb-0")}>
                  <input
                    type="number"
                    className={cx("input-donate", "mb-0")}
                    placeholder="Khác"
                    min={0}
                    onChange={handleDonateInputChange}
                  />
                </div>
              </div>

              <div className={cx("row")}>
                <div className={cx("col-12")}>
                  <input
                    type="text"
                    className={cx("money-donate")}
                    onChange={handleDonateInputChange}
                    //format money
                    value={`${formatCurrency(formData.amount)}`}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div
              className={cx("step")}
              style={{ display: currentTab === 1 ? "block" : "none" }}
            >
              <p className={cx("text-center", "mb-4", "title")}>
                Nhập thông tin cá nhân của bạn
              </p>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  onInput={(e) => handleChange(e)}
                  name="fullname"
                  value={formValues.fullname}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  placeholder="Ngày sinh"
                  onInput={(e) => handleChange(e)}
                  name="birth"
                  value={formValues.birth}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  onInput={(e) => handleChange(e)}
                  name="phone"
                  value={formValues.phone}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  onInput={(e) => handleChange(e)}
                  name="email"
                  value={formValues.email}
                  required
                />
              </div>
            </div>
            <div
              className={cx("step")}
              style={{ display: currentTab === 2 ? "block" : "none" }}
            >
              <p className={cx("text-center", "mb-4", "title")}>
                <b>QŨY VIỆT NAM JOURNEY</b>
              </p>
              <div className="mb-3">
                <div className={cx("content")}>
                  <p>Tổ chức Việt Nam Journey xin cảm ơn sự đóng góp của bạn</p>
                  <p>
                    Chúng tôi xin hứa sẽ sử dụng quỹ một cách hợp lý và công
                    khai minh bạch
                  </p>
                  <p>
                    Bạn có thể kiểm tra lịch sử quyên góp của Quỹ ở trên sau khi
                    quyên góp cho chúng tôi
                  </p>
                  <p>
                    <b>Chúng ta cùng nhau góp sức bảo vệ môi trường!</b>
                  </p>
                </div>
              </div>
            </div>
            <div className={cx("form-footer", "d-flex", "justify-content-between", "button-form")}>
              <button
                type="button"
                id={cx("prevBtn")}
                onClick={() => nextPrev(-1)}
                style={{ display: currentTab === 0 ? "none" : "inline" }}
              >
                Quay lại
              </button>
              <button
                type="button"
                id={cx("nextBtn")}
                onClick={() => nextPrev(1)}
              >
                {currentTab === 2 ? "Quyên góp" : "Tiếp theo"}
              </button>
            </div>
          </form>

          <div className={cx("qr-code")}>
            {showQR && (
              <div className={cx("img-qr")}>
                <img
                  src={`https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${formData.amount}&addInfo=${formData.senderName} quyên góp vao quỹ VNJN&accountName=QUY VIETNAM JOURNEY`}
                  alt="QR Code"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cx("fun-history")}>
          <div className={cx("title")}>Lịch sử quyên góp</div>
          <div className={cx("table-container")}>
            <Table striped hover className={cx("table-fun-history")}>
              <thead>
                <tr>
                  <th></th>
                  <th>Nhà hảo tâm</th>
                  <th>Số điện thoại</th>
                  <th>Số tiền</th>
                  <th className={cx("time")}>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {funData.slice().reverse().map((fun, index) => (
                  <tr key={fun.id}>
                    <td className={cx("text-center")}>{index + 1}</td>
                    <td>{fun.name}</td>
                    <td>{maskPhoneNumber(fun.phone)}</td>
                    <td className={cx("money")}>{formatCurrency(fun.amount)}</td>
                    <td className={cx("time")}>{new Date(fun.time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onRequestClose={closeModal}
        contentLabel="Donation Successful"
        className={cx("modal")}
        overlayClassName={cx("overlay")}
      >
        <h2>Quyên góp thành công!</h2>
        <p>Cảm ơn bạn đã quyên góp vào quỹ VIỆT NAM JOURNEY.</p>
        <button onClick={closeModal}>Đóng</button>
      </Modal>

      <Modal
        isOpen={showSuccessModalHistory}
        onRequestClose={closeModalHistory}
        contentLabel="Donation History"
        className={cx("modal-history")}
        overlayClassName={cx("overlay-history")}
      >
        <div className={cx("transaction-history")}>
          <h3>Lịch sử giao dịch</h3>
          <ul>
            {transactionHistory
              .slice()
              .reverse()
              .map((transaction, index) => {
                if (transaction["Mô tả"].includes("VNJN")) {
                  return (
                    <li key={index}>
                      <div className={cx("name")}>
                        {transaction["Mô tả"]
                          .split(" ")
                          .slice(
                            2,
                            transaction["Mô tả"].split(" ").indexOf("quyen")
                          )
                          .join(" ")}
                      </div>
                      <div>
                        Số tiền quyên góp:{" "}
                        <span>
                          {parseInt(transaction["Giá trị"], 10).toLocaleString(
                            "vi-VN",
                            {
                              style: "currency",
                              currency: "VND",
                            }
                          )}
                        </span>
                      </div>
                      <div>Mã giao dịch: {transaction["Mã GD"]}</div>
                      <div>
                        Thời gian giao dịch: {transaction["Ngày diễn ra"]}
                      </div>
                    </li>
                  );
                } else {
                  return null;
                }
              })}
          </ul>
        </div>
      </Modal>
    </div>
  );
}

export default CoDonate;
