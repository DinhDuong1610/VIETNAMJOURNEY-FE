import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import style from "./Read.module.scss";

const cx = classNames.bind(style);

const Read = () => {
  const { emailId } = useParams();

  const [email, setEmail] = useState(null);
  const [totalEmails, setTotalEmails] = useState(0);
  const [totalEmailsSend, setTotalEmailsSend] = useState(0);
  const [unreadEmailsCount, setUnreadEmailsCount] = useState(0);
  const navigate = useNavigate();

  // userId
  const cookies = document.cookie;
  const cookiesArray = cookies.split("; ");
  const userIdCookie = cookiesArray.find((cookie) =>
    cookie.startsWith("User_ID=")
  );
  const userId = userIdCookie ? userIdCookie.split("=")[1] : null;

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/email/read/${userId}/${emailId}`
      );
      setEmail(response.data.email);
      setTotalEmails(response.data.totalEmails);
      setTotalEmailsSend(response.data.totalEmailsSend);
      setUnreadEmailsCount(response.data.unreadEmailsCount);
    } catch (error) {
      console.error("Error fetching email", error);
    }
  };

  return (
    <div className={cx("Read")}>
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
            <div className={cx("card", "card-success", "card-outline", "overflow-hidden")}>
              <div className={cx("card-header-mailbox")}>
              </div>
              <div className={cx("card-body", "p-0")}>
                {email && (
                  <>
                    <div className={cx("mailbox-read-info")}>
                      <h4>
                        <b>{email.title}</b>
                      </h4>
                      <h6>
                        {email.isAdmin == 0 ? "Từ: " : "Đến: "}
                        <b>{email.user.Username}</b>
                        <span className={cx("mailbox-read-time", "float-end")}>
                          {new Date(email.created_at).toLocaleString()}
                        </span>
                      </h6>
                    </div>
                    <div
                      className={cx("mailbox-read-message")}
                    >
                      {email.content.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Read;
