import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import CommonModal from '../../../common/CommonModal/CommonModal';
import styles from './RegisterConfirmationPopup.module.css';

const RegisterConfirmationPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const closeModal = () => {
    onClose();
  };

  return (
    <CommonModal isOpen={isOpen} onClose={closeModal} modalClassName={styles.modal}>
      <div className={styles['popup-wrapper']}>
        <CheckCircleIcon className={styles['check-icon']} color="#345E80" />
        <h1 className={styles['main-text']}>Account Registered</h1>
        <p className={styles.subtext}>You may now log in to your account using your new account</p>
        <Button className={styles['login-button']} onClick={() => navigate('/login')} size="md">
          Login
        </Button>
      </div>
    </CommonModal>
  );
};

RegisterConfirmationPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RegisterConfirmationPopup;
