import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';

// TODO:
// - Button colors should be added to ChakraProvider using extendTheme
// - Implement "Return to Login page" button

const ModalStepOne = ({ incrementStep, closeModal, deleteAccount }) => {
  const handleDelete = () => {
    incrementStep();
    deleteAccount();
  };
  return (
    <div>
      <p>Step One</p>
      <Button onClick={closeModal}>Cancel</Button>
      <Button onClick={handleDelete}>Confirm</Button>
    </div>
  );
};

const ModalStepTwo = () => (
  <div>
    <p>Step Two</p>
    <Button>Return to Login page</Button>
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
