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

const CommonModal = ({ isOpen, onClose, width, height, children, modalClassName }) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent minHeight={height} minWidth={width}>
          <ModalCloseButton />
          <ModalBody className={modalClassName}>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

CommonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node.isRequired,
  modalClassName: PropTypes.string,
};

CommonModal.defaultProps = {
  width: 700,
  height: 500,
  modalClassName: '',
};

export default CommonModal;
