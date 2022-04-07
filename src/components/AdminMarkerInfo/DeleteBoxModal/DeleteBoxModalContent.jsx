import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeleteBoxModalContent.module.css';

const DeleteBoxModalContent = ({ deleteBox }) => (
  <div className={styles['content-wrapper']}>
    <h1 className={styles.title}>Delete Box</h1>
    <div className={styles.body}>
      Do you want to delete the entire box or just the last transaction?
    </div>
    <div className={styles.buttons}>
      {/* TODO: DELETE LAST TRANSACTION BUTTON FUNCTIONALITY */}
      <button type="button" className={styles['delete-last-transaction-button']}>
        Delete Last Transaction
      </button>
      <button type="button" className={styles['delete-entire-box-button']} onClick={deleteBox}>
        Delete Entire Box
      </button>
    </div>
  </div>
);

DeleteBoxModalContent.propTypes = {
  deleteBox: PropTypes.func.isRequired,
};

export default DeleteBoxModalContent;
