import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import RegisterForm from '../../components/Register/RegisterForm';
import styles from './RegisterPage.module.css';
import FYALogo from '../../assets/fya-text-logo.png';

const RegisterPage = () => {
  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['register-form']}>
          <div className={styles['register-container']}>
            <div className={styles['logo-container']}>
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </div>
            <RegisterForm className={styles['register-form-component']} />
          </div>
        </div>
        <div className={styles.banner} />
      </div>
    </ChakraProvider>
  );
};

export default RegisterPage;
