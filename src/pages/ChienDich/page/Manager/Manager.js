import classNames from "classnames/bind";
import style from "./Manager.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../../../Cookie/getCookie";
import { Spin, Pagination, ConfigProvider } from "antd";
import API_BASE_URL from "../../../../config/configapi";

const cx = classNames.bind(style);

function Manager() {
  // State để lưu trữ dữ liệu từ API và quản lý phân trang
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số lượng chiến dịch mỗi trang

  const navigate = useNavigate();

  const userId = getCookie("User_ID");

  // Gọi API khi component được render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}api/managerCampaign/${userId}`
        );

        if (response.data.list) {
          setData(response.data.list);
          setLoading(false);
        } else {
          throw new Error(response.data.error || "Unknown error");
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Xử lý trạng thái tải dữ liệu
  if (loading) {
    return (
      <div className={cx("centeredSpin")}>
        <Spin size="large" />
      </div>
    );
  }

  // Xử lý lỗi
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Xác định dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Xử lý sự kiện thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (id) => {
    navigate("/ManagerDetail/?id=" + id);
  };

  const handleEditClick = (e, id) => {
    e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
    navigate("/UpdateCampaign" + "?id=" + id);
  };

  const handleAddCampaign = () => {
    navigate("/CreateCampaign");
  };

  return (
    <div className={cx("Manager")}>
      <div className={cx("container")}>
        <hr />
        <div className={cx("row-title")}>
          <h2 className={cx("title")}>Danh sách chiến dịch</h2>
          <button
            className={cx("add-button")}
            onClick={() => handleAddCampaign()}
          >
            Tạo chiến dịch
          </button>
        </div>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th className={cx("id")}>Mã chiến dịch</th>
              <th className={cx("name")}>Tên chiến dịch</th>
              <th className={cx("province")}>Tỉnh/Thành phố</th>
              <th className={cx("district")}>Quận/Huyện</th>
              <th className={cx("joined")}>TNV tham gia</th>
              <th className={cx("pending")}>TNV chờ duyệt</th>
              <th className={cx("status")}>Tình trạng</th>
              <th className={cx("edit")}>Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((campaign) => (
              <tr key={campaign.id} onClick={() => handleRowClick(campaign.id)}>
                <td className={cx("id")}>FP{campaign.id}</td>
                <td className={cx("name")}>{campaign.name}</td>
                <td className={cx("province")}>{campaign.province}</td>
                <td className={cx("district")}>{campaign.district}</td>
                <td className={cx("joined")}>{campaign.joined}</td>
                <td className={cx("pending")}>{campaign.pending}</td>
                <td className={cx("status")}>
                  <button
                    className={cx(
                      {
                        "dang-dien-ra": campaign.status === "đang diễn ra",
                        "sap-dien-ra": campaign.status === "sắp diễn ra",
                        "da-ket-thuc": campaign.status === "đã kết thúc",
                      },
                      "status"
                    )}
                  >
                    {campaign.status}
                  </button>
                </td>
                <td className={cx("edit")}>
                  <button
                    className={cx("edit")}
                    onClick={(e) => handleEditClick(e, campaign.id)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Thêm pagination vào */}

        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                colorPrimary: "#28a745",
                colorPrimaryBorder: "#9dedb0",
                colorPrimaryHover: "#28a745",
              },
            },
          }}
        >
          <Pagination
            className={cx("custom-pagination")}
            align="end"
            current={currentPage}
            pageSize={itemsPerPage}
            total={data.length}
            onChange={handlePageChange}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}

export default Manager;
