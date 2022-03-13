import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button, ButtonGroup, Link } from '@chakra-ui/react';
import styles from './ResetPasswordModal.module.css';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const ModalStep = ({ incrementStep, closeModal, resetPassword }) => {
  const handleReset = () => {
    incrementStep();
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
        <Link className={styles['undo-click']} onClick={closeModal} to="/someLink">
          Undo
        </Link>
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
  incrementStep: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

export default ResetPasswordModalContent;
