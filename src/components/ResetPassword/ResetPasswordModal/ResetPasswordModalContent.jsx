import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import styles from './ResetPasswordModal.module.css';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const ModalStep = ({ resetPassword }) => {
  const handleReset = () => {
    resetPassword();
  };
  return (
    <div className={styles['step-content']}>
      <Text fontSize="48px" fontWeight="bold" className={styles['step-text']}>
        Password
      </Text>
      <Text fontSize="18px" fontWeight="bold" className={styles['step-text']}>
        You may now log into your account using your new password
      </Text>
      <ButtonGroup size="lg" className={styles['step-button-group']}>
        {/* Will need to specify what this UNDO link leads to, right now placeholder is "someLink" */}
        {/* Will need to figure out how to have CHAKRA UI Buttons link to other pages */}
        <Button
          className={styles['undo-modal-button']}
          onClick={handleReset}
          color="#173848"
          bg="white"
          variant="outline"
          colorScheme="#173848"
        >
          Undo
        </Button>
        <Button onClick={handleReset} color="white" bg="#173848">
          Return to Login
        </Button>
      </ButtonGroup>
    </div>
  );
};

const ResetPasswordModalContent = ({ modalStep, closeModal, resetPassword }) => {
  const modalSteps = [<ModalStep key="" closeModal={closeModal} resetPassword={resetPassword} />];

  return modalSteps[modalStep];
};

ModalStep.propTypes = {
  resetPassword: PropTypes.func.isRequired,
};

export default ResetPasswordModalContent;
