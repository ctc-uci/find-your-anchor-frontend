import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '@chakra-ui/icons';
import CommonModal from '../../../common/CommonModal/CommonModal';
import ResetPasswordModalContent from './ResetPasswordModalContent';
import styles from './ResetPasswordModal.module.css';

// TODO:
// - Implement resetPassword

const resetPassword = () => {
  // Make request to reset password here
  // eslint-disable-next-line no-console
  console.log('password reset complete');
};

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const closeModal = () => {
    onClose();
  };

  return (
    // TODO: remove the close button on the modal
    <CommonModal isOpen={isOpen} onClose={closeModal} modalClassName={styles.modal}>
      <div className={styles['reset-password-modal-content']}>
        <CheckCircleIcon w={24} h={24} color="#345E80" />
        <ResetPasswordModalContent resetPassword={resetPassword} />
      </div>
    </CommonModal>
  );
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
