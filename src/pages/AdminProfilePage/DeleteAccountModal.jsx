import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

// TODO:
// - Replace ChakraUI Modal with common component once created
// - Remove ChakraProvider once provider is moved to index.js
// - Button colors should be added to ChakraProvider using extendTheme
// - Implement performDeleteAccount
// - Implement "Return to Login page" button

const performDeleteAccount = () => {
  // Make request to delete account here
  console.log('account deleted');
};

const ModalStepOne = ({ incrementStep, deleteAccount, closeModal }) => {
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

const DeleteAccountModalContent = ({ modalStep, setModalStep, closeModal }) => {
  const incrementModalStep = () => {
    setModalStep(modalStep + 1);
  };

  const modalSteps = [
    <ModalStepOne
      key=""
      incrementStep={incrementModalStep}
      deleteAccount={performDeleteAccount}
      closeModal={closeModal}
    />,
    <ModalStepTwo key="" />,
  ];

  return modalSteps[modalStep];
};

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(0);

  const closeModal = () => {
    setModalStep(0);
    onClose();
  };

  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <p>Modal Content</p>
              <DeleteAccountModalContent {...{ modalStep, setModalStep, closeModal }} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

ModalStepOne.propTypes = {
  incrementStep: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountModal;
