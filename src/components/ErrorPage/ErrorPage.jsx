import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Text, Button } from '@chakra-ui/react';
import { PropTypes } from 'prop-types';
import FYALogo from '../../assets/fya-text-logo.svg';
import FYALogoMobile from '../../assets/fya-logo-large.svg';
import styles from './ErrorPage.module.css';
import useMobileWidth from '../../common/useMobileWidth';

const ErrorPage = ({ errorNumber, title, message }) => {
  const navigate = useNavigate();
  const isMobile = useMobileWidth();

  const backToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles['error-page']}>
      {!isMobile && <img src={FYALogo} className={styles.logo} alt="logo" />}
      {isMobile && <img src={FYALogoMobile} className={styles['logo-mobile']} alt="logo" />}
      <div className={styles['error-page-content']}>
        <div className={styles['error-message']}>
          <Text fontSize="64px" fontWeight="bold" className={styles['confirmation-title']}>
            {errorNumber}
          </Text>
          <Text fontSize="28px" fontWeight="bold" className={styles['confirmation-text']}>
            {title}
          </Text>
          <br />
          <Text fontSize="20px" fontWeight="normal" className={styles['confirmation-text']}>
            {message}
          </Text>
        </div>
        <Button className={styles['home-button']} onClick={backToHome} color="white" bg="#345E80">
          Back to Home
        </Button>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  errorNumber: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorPage;
