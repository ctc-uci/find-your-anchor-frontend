import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/CommonModal/CommonModal';
import ResetPasswordModalContent from './ResetPasswordModalContent';
import styles from './ResetPasswordModal.module.css';
import CheckMark from '../../../assets/BlueCheckMark.png';

// TODO:
// - Implement resetPassword

const resetPassword = () => {
  // Make request to reset password here
  // eslint-disable-next-line no-console
  console.log('password reset complete');
};

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(0);

  const closeModal = () => {
    setModalStep(0);
    onClose();
  };

  return (
    <CommonModal isOpen={isOpen} onClose={closeModal} modalClassName={styles.modal}>
      <div className={styles['reset-password-modal-content']}>
        <img src={CheckMark} alt="Logo" className={styles['check-mark-image']} />
        <ResetPasswordModalContent
          modalStep={modalStep}
          setModalStep={setModalStep}
          closeModal={closeModal}
          resetPassword={resetPassword}
        />
      </div>
    </CommonModal>
  );
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
