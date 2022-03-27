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
        Password
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

const ResetPasswordModalContent = ({ modalStep, closeModal, resetPassword }) => {
  const modalSteps = [<ModalStep key="" closeModal={closeModal} resetPassword={resetPassword} />];

  return modalSteps[modalStep];
};

export default ResetPasswordModalContent;
