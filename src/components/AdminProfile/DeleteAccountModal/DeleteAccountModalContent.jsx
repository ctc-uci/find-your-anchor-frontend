import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes, { instanceOf } from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/provider';
import CheckIcon from '../../../assets/check-icon.svg';
import styles from './DeleteAccountModal.module.css';
import { FYABackend } from '../../../common/utils';
import { auth, getCurrentUser, logout } from '../../../common/auth_utils';
import { Cookies, withCookies } from '../../../common/cookie_utils';
import useMobileWidth from '../../../common/useMobileWidth';
import ChakraTheme from '../../../common/ChakraTheme';

const ModalStepOne = ({ incrementStep, closeModal, cookies }) => {
  const isMobile = useMobileWidth();

  const handleDelete = async () => {
    incrementStep();

    // Delete the user.
    const user = await getCurrentUser(auth);
    await FYABackend.delete(`/users/${user.uid}`);

    // Manually log out the user.
    await logout(cookies);
  };

  if (isMobile) {
    return (
      <ChakraProvider theme={ChakraTheme}>
        <div className={styles['step-content']}>
          <Text textSyle="body" fontWeight="bold" className={styles['modal-heading']}>
            Delete Account
          </Text>
          <Text textSyle="header1" className={styles['step-text']}>
            Are you sure? You can&apos;t undo this action afterwards.
          </Text>
          <ButtonGroup size="md" className={styles['step-button-group']}>
            <Button onClick={closeModal} colorScheme="cancel" color="var(--color-text)">
              Cancel
            </Button>
            <Button onClick={handleDelete} colorScheme="warning">
              Delete Account
            </Button>
          </ButtonGroup>
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['step-content']}>
        <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
          Are you sure you want to delete this account?
        </Text>
        <ButtonGroup size="lg" className={styles['step-button-group']}>
          <Button onClick={closeModal} colorScheme="cancel" color="var(--color-text)">
            Cancel
          </Button>
          <Button onClick={handleDelete} colorScheme="warning">
            Delete Account
          </Button>
        </ButtonGroup>
      </div>
    </ChakraProvider>
  );
};

const ModalStepTwo = () => {
  const isMobile = useMobileWidth();
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <ChakraProvider theme={ChakraTheme}>
        <div className={styles['modal-content']}>
          <img src={CheckIcon} className={styles['check-icon']} alt="Logo" />
          <Text fontSize="3xl" fontWeight="bold" className={styles['modal-header']}>
            Account Successfully Deleted
          </Text>
          <div className={styles['modal-button-section']}>
            <Button
              onClick={() => navigate('/login')}
              colorScheme="button"
              iconSpacing="120px"
              className={styles['modal-button']}
            >
              Login
            </Button>
          </div>
        </div>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['step-content']}>
        <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
          Account Successfully Deleted
        </Text>
        <Button onClick={() => navigate('/login')} size="lg" colorScheme="button">
          Login
        </Button>
      </div>
    </ChakraProvider>
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
