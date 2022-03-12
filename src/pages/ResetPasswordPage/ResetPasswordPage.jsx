import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ResetPasswordForm from '../../components/ResetPassword/ResetPasswordForm';
import styles from './ResetPasswordPage.module.css';
import FYALogo from '../../assets/fya-text-logo.svg';

const LoginPage = () => {
  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['reset-password-form']}>
          <div className={styles['reset-password-container']}>
            <div className={styles['logo-container']}>
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </div>
            <div className={styles['reset-password-form-component']}>
              <ResetPasswordForm />
            </div>
          </div>
        </div>
        <div className={styles.banner} />
      </div>
    </ChakraProvider>
  );
};

export default LoginPage;
