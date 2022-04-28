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
  width,
  height,
}) => {
  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={closeOnOverlayClick}>
        <ModalOverlay />
        <ModalContent minHeight={height} minWidth={width} borderRadius={20}>
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
  width: 700,
  height: 500,
};

CommonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node.isRequired,
  modalClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
};

export default CommonModal;
