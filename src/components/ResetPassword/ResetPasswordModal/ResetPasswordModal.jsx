import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '@chakra-ui/icons';
import CommonModal from '../../../common/CommonModal/CommonModal';
import ResetPasswordModalContent from './ResetPasswordModalContent';
import styles from './ResetPasswordModal.module.css';

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={closeModal}
      modalClassName={styles.modal}
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className={styles['reset-password-modal-content']}>
        <CheckCircleIcon w={24} h={24} color="#345E80" />
        <ResetPasswordModalContent />
      </div>
    </CommonModal>
  );
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
