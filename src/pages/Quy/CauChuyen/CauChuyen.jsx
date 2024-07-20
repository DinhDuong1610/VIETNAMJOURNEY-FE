import styles from "./CauChuyen.module.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import arrow from "../../../Images/Quy/CauChuyen/arrow.png";
import ngoac from "../../../Images/Quy/CauChuyen/ngoac.png";
import nguoiphunu from "../../../Images/Quy/CauChuyen/nguoiphunu.png";
import points from "../../../Images/Quy/CauChuyen/points.png";

function CoCauChuyen() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Số lượng slides mặc định hiển thị
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className={styles.main}>
      <div className={styles.div1}>
        <p>Câu chuyện đằng sau những dự án</p>
      </div>

      <div className={styles.slide}>
        <Slider {...settings} className="row">
          <div className="col-12">
              <div className={styles.div2}>
                <div className={styles.div_left}>
                  <img alt=">_<" src={"https://congcutot.vn/uploads/store/page/article/2021/12/nguoi-nong-dan.jpg"}></img>
                </div>
      
                <div className={styles.div_right}>
                  <div className={styles.top}>
                    <div className={styles.part1}>
                      <div className={styles.line1}></div>
                      <p>FP207</p>
                    </div>
      
                    <p className={styles.top_p1}>
                    Chương trình hỗ trợ nông dân trồng cây ăn quả hữu cơ, bảo vệ môi trường và sức khỏe người tiêu dùng.
                    </p>
                  </div>
      
                  <div className={styles.mid}>
                    <img alt=">_<" src={ngoac}></img>
      
                    <p className={styles.mid_p1}>
                    Nhờ chương trình này, tôi đã chuyển sang trồng cây ăn quả hữu cơ. Sản phẩm của tôi hiện được tiêu thụ rộng rãi và được khách hàng đánh giá cao về chất lượng.
                    </p>
      
                    <p className={styles.mid_p2}>
                    Bà Lê Thị Hoa<br></br>Nông dân tại tỉnh Quảng Trị
                    </p>
                  </div>
      
                </div>
              </div>
          </div>
  
          <div className="col-12">
              <div className={styles.div2}>
                <div className={styles.div_left}>
                  <img alt=">_<" src={nguoiphunu}></img>
                </div>
      
                <div className={styles.div_right}>
                  <div className={styles.top}>
                    <div className={styles.part1}>
                      <div className={styles.line1}></div>
                      <p>FP196</p>
                    </div>
      
                    <p className={styles.top_p1}>
                      Nghiên cứu phát triển giống lúa mới chống chịu tác động của biến
                      đổi khí hậu và hạn chế sử dụng thuốc bảo vệ thực vật.
                    </p>
                  </div>
      
                  <div className={styles.mid}>
                    <img alt=">_<" src={ngoac}></img>
      
                    <p className={styles.mid_p1}>
                      Chị vừa nhận được giống lúa mới năm nay [2023]. Sau đó đem trồng
                      vào tháng 6 và thu hoạch vào tháng 11. Thực sự rất vui mừng vì
                      sản lượng tăng lên cao đồng thời cũng tiết kiệm chi phí mua
                      thuốc trừ sâu.
                    </p>
      
                    <p className={styles.mid_p2}>
                      Chị Trần Thị Thu Hà<br></br>Nông dân tại tỉnh Thừa Thiên Huế
                    </p>
                  </div>
  
                </div>
              </div>
          </div>
  
          <div className="col-12">
              <div className={styles.div2}>
                <div className={styles.div_left}>
                  <img alt=">_<" src={"https://dhtn.ttxvn.org.vn/Images/images/Boi%20Duong%20Nghiep%20Vu/Noi%20San%20Thong%20Tan/Nam%202024/So%20Xuan/NSTT/23.jpg"}></img>
                </div>
      
                <div className={styles.div_right}>
                  <div className={styles.top}>
                    <div className={styles.part1}>
                      <div className={styles.line1}></div>
                      <p>FP212</p>
                    </div>
      
                    <p className={styles.top_p1}>
                      Dự án nghiên cứu phát triển giống ngô chịu hạn giúp nông dân tăng năng suất và thu nhập.
                    </p>
                  </div>
      
                  <div className={styles.mid}>
                    <img alt=">_<" src={ngoac}></img>
      
                    <p className={styles.mid_p1}>
                    Tôi đã thử nghiệm giống ngô mới trong vụ mùa vừa qua. Giống ngô này chịu hạn rất tốt, giúp tôi tiết kiệm nước tưới và tăng năng suất lên 20%.
                    </p>
      
                    <p className={styles.mid_p2}>
                    Anh Nguyễn Văn Bảo<br></br>Nông dân tại tỉnh Bình Định
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default CoCauChuyen;
