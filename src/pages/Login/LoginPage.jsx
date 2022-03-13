import React from 'react';
import { Button, ChakraProvider, useToast } from '@chakra-ui/react';
import LoginForm from '../../components/Login/LoginForm';
import CustomToast from '../../components/CustomToast/CustomToast';
import styles from './LoginPage.module.css';
import FYALogo from '../../assets/fya-text-logo.svg';

const LoginPage = () => {
  // const CustomToast = () =>
  //   toast({
  //     title: 'Account created.',
  //     description: "We've created your account for you.",
  //     status: 'success',
  //     duration: 9000,
  //     isClosable: true,
  //   });

  const toast = useToast();

  const warningToast = CustomToast(toast, {
    icon: 'warning',
    title: 'title',
    message: 'message',
    toastPosition: 'bottom-left',
  });
  const errorToast = CustomToast(toast, {
    icon: 'error',
    title: 'title',
    message: 'message',
    toastPosition: 'bottom-left',
  });
  const successToast = CustomToast(toast, {
    icon: 'success',
    title: 'title',
    message: 'message',
    toastPosition: 'bottom-left',
  });
  return (
    <ChakraProvider>
      <div className={styles['page-container']}>
        <div className={styles['login-form']}>
          <div className={styles['login-container']}>
            <div className={styles['logo-container']}>
              <img src={FYALogo} className={styles.logo} alt="logo" />
            </div>
            <div className={styles['login-form-component']}>
              <LoginForm />
              <div style={{ flexDirection: 'horizontal', width: '100%', alignContent: 'center' }}>
                <Button style={{ padding: '1%' }} onClick={warningToast}>
                  Warning Toast
                </Button>
                <Button style={{ padding: '1%' }} onClick={errorToast}>
                  Error Toast
                </Button>
                <Button style={{ padding: '1%' }} onClick={successToast}>
                  Success Toast
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.banner} />
      </div>
    </ChakraProvider>
  );
};

export default LoginPage;
