import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

import styles from './PaginationController.module.css';

const PaginationController = ({ paginatedIndex, setPaginatedIndex, totalNumberOfPages }) => (
  <div className={styles['pagination-indicator']}>
    <div className={styles['left-section']}>
      <button
        className={styles['start-button']}
        type="button"
        onClick={() => {
          setPaginatedIndex(0);
        }}
      >
        <FaAngleDoubleLeft />
      </button>
    </div>
    <div className={styles['middle-section']}>
      <button
        className={styles['back-button']}
        type="button"
        onClick={() => {
          setPaginatedIndex(old => Math.max(0, old - 1));
        }}
      >
        <MdArrowBackIos />
      </button>
      <div>Page&nbsp;</div>
      <div>{totalNumberOfPages === 0 ? 0 : paginatedIndex + 1}</div>
      <div>&nbsp;of&nbsp;</div>
      <div>{totalNumberOfPages}</div>
      <button
        className={styles['forward-button']}
        type="button"
        onClick={() => {
          setPaginatedIndex(old => Math.min(totalNumberOfPages - 1, old + 1));
        }}
      >
        <MdArrowForwardIos />
      </button>
    </div>
    <div className={styles['right-section']}>
      <button
        className={styles['end-button']}
        type="button"
        onClick={() => {
          setPaginatedIndex(totalNumberOfPages - 1);
        }}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  </div>
);

PaginationController.propTypes = {
  totalNumberOfPages: PropTypes.number.isRequired,
  paginatedIndex: PropTypes.number.isRequired,
  setPaginatedIndex: PropTypes.func.isRequired,
};

export default PaginationController;
