import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import LoginForm from '../../components/Login/LoginForm';
import styles from './LoginPage.module.css';
import FYALogo from '../../assets/fya-text-logo.png';

const LoginPage = () => {
  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['login-form']}>
          <div className={styles['login-container']}>
            <div className={styles['logo-container']}>
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </div>
            <LoginForm className={styles['login-form-component']} />
          </div>
        </div>
        <div className={styles.banner} />
      </div>
    </ChakraProvider>
  );
};

export default LoginPage;
