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

const CommonModal = ({
  isOpen,
  onClose,
  children,
  modalClassName,
  showCloseButton,
  closeOnOverlayClick,
}) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={closeOnOverlayClick}>
        <ModalOverlay />
        <ModalContent minHeight="500px" minWidth="700px">
          {showCloseButton && <ModalCloseButton />}
          <ModalBody className={modalClassName}>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

CommonModal.defaultProps = {
  modalClassName: '',
  showCloseButton: true,
  closeOnOverlayClick: true,
};

CommonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  modalClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
};

export default CommonModal;
