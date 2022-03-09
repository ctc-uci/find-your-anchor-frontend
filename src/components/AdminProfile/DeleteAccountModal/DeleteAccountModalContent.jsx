import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button, ButtonGroup } from '@chakra-ui/react';
import styles from './DeleteAccountModal.module.css';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
//   This should fix the button highlight color, which is currently white
// - Implement "Return to Login page" button

const ModalStepOne = ({ incrementStep, closeModal, deleteAccount }) => {
  const handleDelete = () => {
    incrementStep();
    deleteAccount();
  };
  return (
    <div className={styles['step-content']}>
      <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
        Are you sure you want to delete this account?
      </Text>
      <ButtonGroup size="lg" className={styles['step-button-group']}>
        <Button onClick={closeModal} color="white" bg="#173848">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="white" bg="#4D93B7">
          Confirm
        </Button>
      </ButtonGroup>
    </div>
  );
};

const ModalStepTwo = () => (
  <div className={styles['step-content']}>
    <Text fontSize="2xl" fontWeight="bold" className={styles['step-text']}>
      Account has been successfully deleted!
    </Text>
    <Button size="lg" color="white" bg="#173848">
      Return to Login page
    </Button>
  </div>
);

const DeleteAccountModalContent = ({ modalStep, setModalStep, closeModal, deleteAccount }) => {
  const incrementModalStep = () => {
    setModalStep(modalStep + 1);
  };

  const modalSteps = [
    <ModalStepOne
      key=""
      incrementStep={incrementModalStep}
      closeModal={closeModal}
      deleteAccount={deleteAccount}
    />,
    <ModalStepTwo key="" />,
  ];

  return modalSteps[modalStep];
};

ModalStepOne.propTypes = {
  incrementStep: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

export default DeleteAccountModalContent;
