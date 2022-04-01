import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPasswordModal.module.css';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const ModalStep = () => {
  const navigate = useNavigate();

  const returnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles['step-content']}>
      <Text fontSize="48px" fontWeight="bold" className={styles['step-text']}>
        Password Reset
      </Text>
      <Text fontSize="18px" fontWeight="bold" className={styles['step-text']}>
        You may now log into your account using your new password
      </Text>
      <Button onClick={() => returnToLogin()} color="white" bg="#173848">
        Return to Login
      </Button>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ResetPasswordModalContent = ({ resetPassword }) => {
  return <ModalStep key="" resetPassword={resetPassword} />;
};

export default ResetPasswordModalContent;
