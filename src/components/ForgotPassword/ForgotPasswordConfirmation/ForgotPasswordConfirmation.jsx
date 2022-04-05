import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Text, Button } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import CommonConfirmationPage from '../../../common/CommonConfirmationPage/CommonConfirmationPage';
import styles from './ForgotPasswordConfirmation.module.css';

const ForgotPasswordConfirmation = ({ isOpen }) => {
  const navigate = useNavigate();

  const returnToLogin = () => {
    navigate('/login');
  };

  return (
    <CommonConfirmationPage isOpen={isOpen}>
      <div className={styles['forgot-password-confirmation-content']}>
        <CheckCircleIcon className={styles['confirmation-icon']} w={24} h={24} color="#345E80" />
        <div className={styles['confirmation-message']}>
          <Text fontSize="48px" fontWeight="bold" className={styles['confirmation-header']}>
            Email Sent
          </Text>
          <Text fontSize="18px" fontWeight="normal" className={styles['confirmation-text']}>
            A link to reset your password has been sent to your registered FYA email address
          </Text>
        </div>
        <Button
          className={styles['confirmation-button']}
          onClick={() => returnToLogin()}
          color="white"
          bg="#345E80"
        >
          Return to Login
        </Button>
      </div>
    </CommonConfirmationPage>
  );
};

ForgotPasswordConfirmation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default ForgotPasswordConfirmation;
