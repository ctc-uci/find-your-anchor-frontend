import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import useMobileWidth from '../useMobileWidth';

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
  const isMobile = useMobileWidth();
  const modalContentProps = {};
  if (!isMobile) {
    modalContentProps.minHeight = height;
    modalContentProps.minWidth = width;
  } else {
    modalContentProps.height = '200px';
    modalContentProps.width = '300px';
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={closeOnOverlayClick}>
        <ModalOverlay />
        <ModalContent {...modalContentProps} borderRadius={20}>
          {showCloseButton && <ModalCloseButton />}
          <ModalBody className={modalClassName}>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
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
