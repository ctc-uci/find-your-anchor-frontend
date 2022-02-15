import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';

import DeleteAccountModalContent from './DeleteAccountModalContent';
import './DeleteAccountModal.css';
import FYALogo from '../../../assets/fya-logo-large.svg';

// TODO:
// - Replace ChakraUI Modal with common component once created
// - Replace FYALogo with a less blurry svg
// - Implement deleteAccount

const deleteAccount = () => {
  // Make request to delete account here
  console.log('account deleted');
};

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(0);

  const closeModal = () => {
    setModalStep(0);
    onClose();
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <div className="delete-modal-content">
            <img src={FYALogo} alt="Logo" className="fya-logo" />
            <DeleteAccountModalContent
              modalStep={modalStep}
              setModalStep={setModalStep}
              closeModal={closeModal}
              deleteAccount={deleteAccount}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountModal;
