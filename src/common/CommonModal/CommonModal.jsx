import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  ChakraProvider,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const CommonModal = ({ isOpen, setIsOpen, onSubmit, children }) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={setIsOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody className="text">{children}</ModalBody>
          <ModalFooter className="modal-button">
            <Button onClick={onSubmit}>Button Text</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

CommonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default CommonModal;
