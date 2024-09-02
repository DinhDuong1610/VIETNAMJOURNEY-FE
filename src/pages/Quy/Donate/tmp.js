import classNames from "classnames/bind";
import style from "./Donate.module.css";

import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";

import Table from "react-bootstrap/Table";

import support1 from "../../../Images/Quy/Donate/support1.png";
import support2 from "../../../Images/Quy/Donate/support2.png";
import support3 from "../../../Images/Quy/Donate/support3.png";

const cx = classNames.bind(style);

function CoDonate() {

  return (
    <div className={cx("main")}>

      <div className={cx("fun-history")}>
          <div className={cx("title")}>Lịch sử quyên góp</div>
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
            <tr>
              <td className={cx("text-center")}>1</td>
              <td>Dương Đính</td>
              <td>0979727604</td>
              <td className={cx("money")}>15000000</td>
              <td className={cx("time")}>2024-07-08 01:29:03</td>
            </tr>
            <tr>
              <td className={cx("text-center")}>1</td>
              <td>Lê Hữu Anh Tú</td>
              <td>0979727604</td>
              <td className={cx("money")}>15000000</td>
              <td className={cx("time")}>2024-07-08 01:29:03</td>
            </tr>
            <tr>
              <td className={cx("text-center")}>1</td>
              <td>Lê Trung Việt</td>
              <td>0979727604</td>
              <td className={cx("money")}>15000000</td>
              <td className={cx("time")}>2024-07-08 01:29:03</td>
            </tr>
          </tbody>
        </Table>
      </div>

    </div>
  );
}

export default CoDonate;
