import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import classNames from "classnames/bind";
import style from "./TacDong.module.scss";
import CountUp from "react-countup";
import API_BASE_URL from "../../../../../config/configapi";
import { Flex, Progress } from "antd";
import axios from "axios";

const cx = classNames.bind(style);

function TacDong({ campaign }) {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    });

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const totalMoney = campaign.totalMoney;
  const moneyByVNJN = campaign.moneyByVNJN;

  
  const [funData, setFunData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [countAmount, setCountAmount] = useState(0);

  useEffect(() => {
    const fetchFunData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}api/getFunByCampaign/${campaign.id}`
        );
        setFunData(response.data.funs);
        setTotalAmount(response.data.totalAmount);
        setCountAmount(response.data.countAmount);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchFunData();
  }, []);

  return (
    <div className={cx("TacDong")} ref={componentRef}>
      <div className={cx("row")}>
        <div
          className={cx(
            "col-xl-6",
            "col-lg-6",
            "col-md-6",
            "col-sm-6",
            "col-12"
          )}
        >
          <div className={cx("title", "left")}>Tổng giá trị dự án</div>
          <div className={cx("number")}>
            {isVisible && (
              <CountUp
                end={totalMoney}
                duration={1}
                formattingFn={(value) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
              />
            )}
          </div>
        </div>
        <div
          className={cx(
            "col-xl-6",
            "col-lg-6",
            "col-md-6",
            "col-sm-6",
            "col-12"
          )}
        >
          {/* <div className={cx('title')}>
            Quỹ VIETNAM JOURNEY tài trợ
          </div>
          <div className={cx('number')}>
            {isVisible && (
              <CountUp
                end={moneyByVNJN}
                duration={1}
                formattingFn={(value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              />
            )}
          </div> */}

          <div className={cx("title-progress")}>Quá trình quyên góp</div>

          <div className={cx("progress-number")}>
            <span className={cx("number-current")}>
              <CountUp
                end={totalAmount}
                duration={1}
                formattingFn={(value) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
              />
            </span>
            <span className={cx("number-separate")}> / </span>
            <span className={cx("number-total")}>
              <CountUp
                end={totalMoney}
                duration={1}
                formattingFn={(value) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
              />
            </span>
          </div>

          <Progress
            percent={Math.floor((totalAmount / totalMoney) * 100)}
            percentPosition={{
              align: "end",
              type: "inner",
            }}
            size={[, 15]}
            strokeColor="#35973F"
            status="active"
          />

          <div className={cx("sub-progress-number")}>
            <div className={cx("sub")}>
              <div className={cx("sub-title")}>Lượt quyên góp</div>
              <div className={cx("sub-number")}>{countAmount}</div>
            </div>
            <div className={cx("sub")}>
              <div className={cx("sub-title")}>Đạt được</div>
              <div className={cx("sub-number")}>
                {Math.floor((totalAmount / totalMoney) * 100)}%
              </div>
            </div>
            <div className={cx("sub")}>
              <div className={cx("sub-title")}>Thời gian còn</div>
              <div className={cx("sub-number")}>{Math.max(0, Math.floor((new Date(campaign.dateStart) - Date.now()) / (1000 * 60 * 60 * 24)))} ngày</div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("row")}>
        <div
          className={cx(
            "col-xl-6",
            "col-lg-6",
            "col-md-6",
            "col-sm-6",
            "col-12"
          )}
        >
          <div className={cx("title", "left")}>Mục tiêu dự án</div>
          <div className={cx("desc")}>Môi trường</div>
        </div>
        <div
          className={cx(
            "col-xl-6",
            "col-lg-6",
            "col-md-6",
            "col-sm-6",
            "col-12"
          )}
        >
          <div className={cx("title")}>Có tác động đến các lĩnh vực</div>
          <div className={cx("icon")}>
            <ul>
              <li>
                <i className="fa-solid fa-city"></i>
              </li>
              <li className={cx("mo")}>
                <i className="fa-solid fa-seedling"></i>
              </li>
              <li>
                <i className="fa-solid fa-charging-station"></i>
              </li>
              <li className={cx("mo")}>
                <i className="fa-solid fa-droplet"></i>
              </li>
              <li>
                <i className="fa-solid fa-heart-pulse"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TacDong;
