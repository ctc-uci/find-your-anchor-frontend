import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes, { instanceOf } from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import styles from './LogoutModal.module.css';
import { logout } from '../../../common/auth_utils';
import { Cookies, withCookies } from '../../../common/cookie_utils';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const ModalStepOne = ({ incrementStep, closeModal, cookies }) => {
  const handleLogout = async () => {
    incrementStep();

    // Log out the user.
    await logout(cookies);
  };

  return (
    <div className={styles['step-content']}>
      <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
        Are you sure you want to logout?
      </Text>
      <ButtonGroup size="lg" className={styles['step-button-group']}>
        <Button onClick={closeModal} color="#2D3748" bg="#E2E8F0">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="white" bg="#345E80">
          Logout
        </Button>
      </ButtonGroup>
    </div>
  );
};

const ModalStepTwo = () => {
  const navigate = useNavigate();
  return (
    <div className={styles['step-content']}>
      <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
        Account has been successfully signed out.
      </Text>
      <Button onClick={() => navigate('/login')} size="lg" color="white" bg="#173848">
        Return to Login page
      </Button>
    </div>
  );
};

const LogoutModalContent = ({ modalStep, setModalStep, closeModal, cookies }) => {
  const incrementModalStep = () => {
    setModalStep(modalStep + 1);
  };

  const modalSteps = [
    <ModalStepOne
      key=""
      incrementStep={incrementModalStep}
      closeModal={closeModal}
      cookies={cookies}
    />,
    <ModalStepTwo key="" />,
  ];

  return modalSteps[modalStep];
};

ModalStepOne.propTypes = {
  incrementStep: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(LogoutModalContent);
