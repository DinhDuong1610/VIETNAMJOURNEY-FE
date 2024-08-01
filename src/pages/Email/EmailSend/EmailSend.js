import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../Pagination";
import classNames from "classnames/bind";
import style from "./EmailSend.module.scss";

const cx = classNames.bind(style);

const Email = () => {
  const [emails, setEmails] = useState([]);
  const [emailsSend, setEmailsSend] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesSend, setTotalPagesSend] = useState(1);
  const [totalEmails, setTotalEmails] = useState(1);
  const [unreadEmailsCount, setUnreadEmailsCount] = useState(0);
  const [totalEmailsSend, setTotalEmailsSend] = useState(1);

  const [itemsPerPage] = useState(10); // Giả sử số mục trên mỗi trang là 10
  const navigate = useNavigate();

  // userId
  const cookies = document.cookie;
  const cookiesArray = cookies.split("; ");
  const userIdCookie = cookiesArray.find((cookie) =>
    cookie.startsWith("User_ID=")
  );
  const userId = userIdCookie ? userIdCookie.split("=")[1] : null;

  useEffect(() => {
    // Fetch emails, emails_admin, and emails_send from API
    fetchEmails();
  }, [currentPage]);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/email/${userId}?page=${currentPage}`
      );
      setEmails(response.data.emails);
      setTotalPages(response.data.totalPages);
      setTotalEmails(response.data.totalEmails);
      setUnreadEmailsCount(response.data.unreadEmailsCount);
      setEmailsSend(response.data.emailsSend);
      setTotalPagesSend(response.data.totalPagesSend);
      setTotalEmailsSend(response.data.totalEmailsSend);
    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const updateEmailStatus = async (emailId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/email/readed/${emailId}`,
        { status: 1 },
        {
          headers: {
            "X-CSRF-TOKEN": document
              .querySelector('meta[name="csrf-token"]')
              .getAttribute("content"),
          },
        }
      );
      if (response.status === 200) {
        return true;
      } else {
        console.error("Failed to update email status", response);
        return false;
      }
    } catch (error) {
      console.error("Error updating email status", error);
      return false;
    }
  };

  const handleEmailClick = async (emailId) => {
    const success = await updateEmailStatus(emailId);
    if (success) {
      navigate(`/Email/Read/${emailId}`);
    }
  };

  const totalItems = totalEmailsSend;
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cx("EmailSend")}>
      <div className={cx("row", "mt-3")}>
        <div className={cx("col-md-2")}>
          <Link
            to="/Email/Compose"
            className={cx(
              "btn-compose",
              "btn",
              "btn-success",
              "btn-block",
              "mb-3",
              "w-100"
            )}
          >
            Soạn email
          </Link>

          <div className={cx("card")}>
            <div className={cx("card-header")}>
              <h4 className={cx("card-title")}>Thư mục</h4>
            </div>
            <div className={cx("card-folder", "card-body", "p-0")}>
              <ul className={cx("nav", "nav-pills", "flex-column")}>
                <li className={cx("nav-item", "active")}>
                  <Link to="/Email" className={cx("nav-link", "nav-link-gray")}>
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
            <div
              className={cx(
                "card-header-email",
                "d-flex",
                "justify-content-between"
              )}
            >
              <h3 className={cx("card-title")}>Hộp thư</h3>
              <div className={cx("card-tools")}>
                <div className={cx("input-group", "input-group-sm")}>
                  <input
                    type="text"
                    className={cx("form-control")}
                    placeholder="Tìm kiếm"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <div className={cx("input-group-append")}>
                    <div className={cx("btn", "btn-success")}>
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx("card-body", "p-0")}>
              <div className={cx("table-responsive", "mailbox-messages")}>
                <table className={cx("table-email", "table")}>
                  <tbody>
                    {emailsSend.map((email) => (
                      <tr
                        key={email.id}
                        className={cx("d-flex", "justify-content-between")}
                        onClick={() => handleEmailClick(email.id)}
                      >
                        <td className={cx("mailbox-check")}>
                          <input
                            type="checkbox"
                            value=""
                            id={`check${email.id}`}
                          />
                          <label htmlFor={`check${email.id}`}></label>
                        </td>
                        <td className={cx("mailbox-name")}>
                          {email.user.Username}
                        </td>
                        <td className={cx("mailbox-subject")}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <b>{email.title}</b> - {email.content}
                          </div>
                        </td>
                        <td className={cx("mailbox-date")}>
                          {new Date(email.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={cx("card-footer", "p-0")}>
              <div className={cx("mailbox-controls")}>
                <div
                  className={cx(
                    "d-flex",
                    "justify-content-between",
                    "align-items-center",
                    "mt-2",
                    "px-4"
                  )}
                >
                  <b>
                    {totalItems > 0
                      ? `${firstItemIndex}-${
                          lastItemIndex > totalItems
                            ? totalItems
                            : lastItemIndex
                        }`
                      : "0-0"}{" "}
                    / {totalItems}
                  </b>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
