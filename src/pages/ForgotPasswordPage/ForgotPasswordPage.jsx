import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ForgotPasswordForm from '../../components/ForgotPassword/ForgotPasswordForm';
import styles from './ForgotPasswordPage.module.css';
import FYALogo from '../../assets/fya-text-logo.svg';

const ForgotPasswordPage = () => {
  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['forgot-password-form']}>
          <div className={styles['forgot-password-form-container']}>
            <div className={styles['logo-container']}>
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </div>
            <div className={styles['forgot-password-form-component']}>
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
        <div className={styles.banner} />
      </div>
    </ChakraProvider>
  );
};

export default ForgotPasswordPage;
