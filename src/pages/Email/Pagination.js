// src/components/Pagination.js

import React from 'react';
import classNames from "classnames/bind";
import style from "./Pagination.module.scss";

const cx = classNames.bind(style);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav>
      <ul className={cx("pagination")}>
        <li className={cx("page-item", { disabled: currentPage === 1 })}>
          <button
            className={cx("page-link")}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <i class="fa-solid fa-chevron-up fa-rotate-270"></i>
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index} className={cx("page-item", { active: currentPage === index + 1 })}>
            <button
              className={cx("page-link")}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li className={cx("page-item", { disabled: currentPage === totalPages })}>
          <button
            className={cx("page-link")}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <i class="fa-solid fa-chevron-up fa-rotate-90"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
