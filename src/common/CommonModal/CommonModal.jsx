import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ChakraProvider,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import './CommonModal.css';

const CommonModal = ({ isOpen, setIsOpen, children }) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={setIsOpen} className="modal">
        <ModalOverlay />
        <ModalContent maxW="56rem">
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

CommonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  // onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default CommonModal;
