import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Text, Button } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import FYALogo from '../../assets/fya-text-logo.svg';
import FYALogoMobile from '../../assets/fya-logo-large.svg';
import styles from './CommonConfirmationPage.module.css';

const CommonConfirmationPage = ({
  isOpen,
  confirmationTitle,
  confirmationText,
  showFYALogo,
  isReturnHome,
}) => {
  const navigate = useNavigate();

  const returnToLogin = () => {
    navigate('/login');
  };

  const returnToHome = () => {
    navigate('/');
  };

  if (isOpen) {
    return (
      <div className={styles['confirmation-page']}>
        {showFYALogo && <img src={FYALogo} className={styles.logo} alt="logo" />}
        {showFYALogo && <img src={FYALogoMobile} className={styles['logo-mobile']} alt="logo" />}
        <div className={styles['confirmation-content']}>
          <CheckCircleIcon className={styles['confirmation-icon']} w={24} h={24} />
          <div className={styles['confirmation-message']}>
            <Text fontSize="48px" fontWeight="bold" className={styles['confirmation-title']}>
              {confirmationTitle}
            </Text>
            <Text fontSize="18px" fontWeight="normal" className={styles['confirmation-text']}>
              {confirmationText}
            </Text>
          </div>
          {isReturnHome ? (
            <Button className={styles['confirmation-button']} onClick={returnToHome}>
              Return to Home
            </Button>
          ) : (
            <Button className={styles['confirmation-button']} onClick={returnToLogin}>
              Return to Login
            </Button>
          )}
        </div>
      </div>
    );
  }
  return '';
};

CommonConfirmationPage.defaultProps = {
  showFYALogo: true,
  isReturnHome: false,
};

CommonConfirmationPage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  confirmationTitle: PropTypes.string.isRequired,
  confirmationText: PropTypes.string.isRequired,
  showFYALogo: PropTypes.bool,
  isReturnHome: PropTypes.bool,
};

export default CommonConfirmationPage;
