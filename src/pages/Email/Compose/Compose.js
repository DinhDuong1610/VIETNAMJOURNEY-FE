import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./Compose.module.scss";
import API_BASE_URL from "../../../config/configapi";

const cx = classNames.bind(style);

function Compose() {
  const [totalEmails, setTotalEmails] = useState(0);
  const [totalEmailsSend, setTotalEmailsSend] = useState(0);
  const [unreadEmailsCount, setUnreadEmailsCount] = useState(0);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAdmin: 0, // Set the value based on your logic
  });

  // Extract userId from cookies
  const cookies = document.cookie;
  const cookiesArray = cookies.split("; ");
  const userIdCookie = cookiesArray.find((cookie) =>
    cookie.startsWith("User_ID=")
  );
  const userId = userIdCookie ? userIdCookie.split("=")[1] : null;

  useEffect(() => {
    // Fetch emails, emails_admin, and emails_send from API
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/email/${userId}`
      );
      setTotalEmails(response.data.totalEmails);
      setTotalEmailsSend(response.data.totalEmailsSend);
      setUnreadEmailsCount(response.data.unreadEmailsCount);
    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure userId is included in formData
      await axios.post(`${API_BASE_URL}api/email/create`, {
        ...formData,
        userId: userId, // Include userId here
      });
      alert("Gửi email thành công");
      navigate("/EmailSend");
    } catch (error) {
      console.error("Error sending email", error);
      alert("Gửi email thất bại");
    }
  };

  return (
    <div className={cx("Compose")}>
      <div className={cx("container-fluid")}>
        <div className={cx("row", "mt-3")}>
          <div className={cx("col-md-2")}>
            <Link
              to="/Email"
              className={cx(
                "btn-compose",
                "btn",
                "btn-success",
                "btn-block",
                "mb-3",
                "w-100"
              )}
            >
              Hộp thư
            </Link>

            <div className={cx("card")}>
              <div className={cx("card-header")}>
                <h4 className={cx("card-title")}>Thư mục</h4>
              </div>
              <div className={cx("card-folder", "card-body", "p-0")}>
                <ul className={cx("nav", "nav-pills", "flex-column")}>
                  <li className={cx("nav-item", "active")}>
                  <Link
                      to="/Email"
                      className={cx("nav-link", "nav-link-gray")}
                    >
                      <i className="fas fa-inbox"></i> Hộp thư đến
                      <span className={cx("badge-green", "badge", "float-end")}>
                        {unreadEmailsCount}
                      </span>
                    </Link>
                  </li>
                  <li className={cx("nav-item")}>
                    <Link
                      to="/EmailSend"
                      className={cx("nav-link", "nav-link-gray")}
                    >
                      <i className="far fa-envelope"></i> Đã gửi
                      {/* <span className={cx("badge-green", "badge", "float-end")}>
                        {totalEmailsSend}
                      </span> */}
                    </Link>
                  </li>
                  <li className={cx("nav-item")}>
                    <Link to="#" className={cx("nav-link", "nav-link-gray")}>
                      <i className="far fa-trash-alt"></i> Thùng rác
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={cx("col-md-10")}>
            <div className={cx("card", "card-success", "card-outline")}>
              <div className={cx("card-header", "card-header-email")}>
                <h3 className={cx("card-title")}>Soạn email</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={cx("card-body")}>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="username"
                      placeholder="Đến:"
                      value={"Đến: Admin"}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      name="title"
                      placeholder="Tiêu đề:"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={cx("mb-3", "content")}>
                    <textarea
                      id="compose-textarea"
                      name="content"
                      className="form-control"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="hidden"
                    name="isAdmin"
                    value={formData.isAdmin}
                  />
                </div>
                <div className={cx("card-footer")}>
                  <div className={cx("float-end", "mb-2")}>
                    <button
                      type="submit"
                      className={cx("btn", "btn-compose", "btn-success")}
                    >
                      <i className="far fa-envelope"></i> Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compose;
