import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes, { instanceOf } from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import styles from './DeleteAccountModal.module.css';
import { FYABackend } from '../../../common/utils';
import { auth, getCurrentUser, logout } from '../../../common/auth_utils';
import { Cookies, withCookies } from '../../../common/cookie_utils';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const ModalStepOne = ({ incrementStep, closeModal, cookies }) => {
  const handleDelete = async () => {
    incrementStep();

    // Delete the user.
    const user = await getCurrentUser(auth);
    await FYABackend.delete(`/users/${user.uid}`);

    // Manually log out the user.
    await logout(cookies);
  };

  return (
    <div className={styles['step-content']}>
      <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
        Are you sure you want to delete this account?
      </Text>
      <ButtonGroup size="lg" className={styles['step-button-group']}>
        <Button onClick={closeModal} color="#2D3748" bg="#E2E8F0">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="white" bg="#E53E3E">
          Delete Account
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
        Account Successfully Deleted
      </Text>
      <Button onClick={() => navigate('/login')} size="lg" color="white" bg="#345E80">
        Login
      </Button>
    </div>
  );
};

const DeleteAccountModalContent = ({ modalStep, setModalStep, closeModal, cookies }) => {
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

export default withCookies(DeleteAccountModalContent);
